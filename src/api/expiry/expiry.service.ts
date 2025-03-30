import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ExpiryCheckDto } from './dto/expiry.dto';
import { ExpiryListResponseDto } from './dto/expiry-response.dto';
import { PrismaService } from 'src/provider/prisma/prisma.service';

@Injectable()
export class ExpiryService {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(dto: ExpiryCheckDto): Promise<ExpiryListResponseDto> {
    try {
      // 오늘 날짜를 기준으로 일(day) 수로 변환 (기준: 2000.01.01)
      const todayDays = this.convertDateToDays(dto.today);
  
      // 약관 코드별 유효기간(개월 수)을 Map 형태로 저장
      const termMap = this.buildTermMap(dto.terms);
  
      // 개인정보 수집 정보들을 순회하며 유효기간이 지난 항목의 인덱스를 찾음
      const expiredIndexes = dto.privacies.reduce((acc: number[], p, i) => {
        const [collected, termCode] = p.split(' '); // 수집일과 약관 코드 분리
        const duration = termMap.get(termCode);     // 해당 약관 코드에 대한 유효기간 조회
        if (duration === undefined) return acc;     // 유효기간이 없으면 건너뜀
  
        // 만료일 계산:
        // 수집일을 일(day) 수로 변환한 후,
        // 유효기간(개월 수 * 28일)을 더하고,
        // -1을 해서 마지막 유효일을 포함하도록 조정
        const expiryLimit = this.convertDateToDays(collected) + duration * 28 - 1;
  
        // 오늘이 만료일을 지난 경우 → 만료된 항목이므로 결과에 포함
        if (expiryLimit < todayDays) acc.push(i + 1); // (i + 1)은 문제 조건상 1-based 인덱스
  
        return acc;
      }, []);
  
      // 만료된 항목들의 인덱스를 응답으로 반환
      return { expiredIndexes };
    } catch (error) {
      console.error('Error calculating expiry:', error);
      throw new InternalServerErrorException('유효기간 계산 중 오류가 발생했습니다.');
    }
  }

  async saveCheck(dto: ExpiryCheckDto): Promise<ExpiryListResponseDto> {
    const result = await this.calculate(dto);

    try {
      await this.prisma.expiryRequest.create({
        data: {
          today: dto.today,
          terms: dto.terms,
          privacies: dto.privacies,
          result: result.expiredIndexes
        }
      });

      return result;
    } catch (error) {
      console.error('Error saving expiry result:', error);
      throw new InternalServerErrorException('결과 저장 중 오류가 발생했습니다.');
    }
  }

  async findAll() {
    return this.prisma.expiryRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async reset() {
    await this.prisma.expiryRequest.deleteMany();
    await this.prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'ExpiryRequest'`);
    return { message: 'ExpiryRequest 테이블이 초기화되었습니다.' };
  }

/**
 * 날짜 문자열을 정수로 변환하여 비교하기 쉽게 만든다.
 * 
 * 예: "2022.05.19" → 2000년 1월 1일부터 며칠이 지났는지를 계산해 정수로 반환
 * 모든 달은 28일로 고정된 가상 달력을 사용하여 계산함
 */
private convertDateToDays(date: string): number {
  // 날짜 문자열을 '.' 기준으로 잘라서 숫자 배열로 변환 → [년, 월, 일]
  const [y, m, d] = date.split('.').map(Number);

  // 일수 계산:
  // (년 - 2000) * 12달 * 28일 + (월 - 1) * 28일 + 일
  // → 기준일(2000.01.01)부터 경과한 총 일수
  return (y - 2000) * 12 * 28 + (m - 1) * 28 + d;
}


/**
 * 약관 목록을 순회하며 약관 코드와 유효기간(개월 수)을 Map 형태로 저장
 * 
 * 예: ["A 6", "B 12"] → Map { "A" => 6, "B" => 12 }
 */
private buildTermMap(terms: string[]): Map<string, number> {
  return terms.reduce((map, entry) => {
    // 각 항목은 "약관코드 기간" 형식이므로 공백 기준으로 분리
    const [code, dur] = entry.split(' ');

    // Map에 추가: 약관 코드 → 유효기간(숫자형으로 변환)
    map.set(code, parseInt(dur));

    return map;
  }, new Map<string, number>()); // 초기값은 빈 Map
}

}