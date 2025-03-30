import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SaleCheckDto } from './dto/sale-check.dto';
import { SaleResultDto } from './dto/sale-response.dto';
import { PrismaService } from 'src/provider/prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 할인 조건이 적용되는 횟수를 계산하여 결과만 반환하는 메서드
   */
  checkSale(dto: SaleCheckDto): SaleResultDto {
    const result = this.calculateSale(dto); // 할인 적용 횟수 계산
    return { result };
  }

  /**
   * 할인 조건이 적용되는 횟수를 계산하고, 요청 데이터를 DB에 저장하는 메서드
   */
  async saveSale(dto: SaleCheckDto) {
    const result = this.calculateSale(dto); // 할인 적용 횟수 계산
    try {
      // Prisma를 사용해 saleRequest 테이블에 저장
      return await this.prisma.saleRequest.create({
        data: {
          want: dto.want,           // 원하는 제품 목록
          number: dto.number,       // 각 제품별 원하는 수량
          discount: dto.discount,   // 할인 품목 배열
          result,                   // 할인 조건 충족 횟수
        },
      });
    } catch (error) {
      // 에러 발생 시 로그 출력 후 500 에러 응답
      console.error('Error:', error);
      throw new InternalServerErrorException('할인 요청 저장 중 오류가 발생했습니다.');
    }
  }

  /**
   * 저장된 모든 할인 요청 데이터를 최신순으로 조회
   */
  async getAllSales() {
    return this.prisma.saleRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /**
   * 테이블의 모든 데이터를 삭제하고, ID 시퀀스도 초기화
   */
  async reset() {
    await this.prisma.saleRequest.deleteMany(); // 모든 행 삭제
    await this.prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'SaleRequest'`); // auto increment 초기화
    return { message: 'SaleRequest 테이블이 초기화되었습니다.' };
  }

  /**
   * 실제 할인 조건 충족 횟수를 계산하는 핵심 로직
   */
  private calculateSale(dto: SaleCheckDto): number {
    const { want, number, discount } = dto;

    // 고객이 원하는 상품과 개수를 Map에 저장 (예: {'apple' => 2, 'banana' => 3})
    const wantMap = new Map<string, number>();
    for (let i = 0; i < want.length; i++) {
      wantMap.set(want[i], number[i]);
    }

    let result = 0; // 조건을 충족한 횟수
    const windowCount = new Map<string, number>(); // 현재 윈도우(슬라이딩 윈도우)의 아이템 개수 저장

    // 첫 10일(슬라이딩 윈도우)의 상품 목록으로 초기 세팅
    for (let i = 0; i < 10; i++) {
      const item = discount[i];
      windowCount.set(item, (windowCount.get(item) || 0) + 1);
    }

    // 첫 번째 윈도우가 조건을 만족하는지 확인
    if (this.isMatch(wantMap, windowCount)) result++;

    // 이후 11일째부터 끝까지 슬라이딩 윈도우 이동하면서 조건 체크
    for (let i = 10; i < discount.length; i++) {
      const removeItem = discount[i - 10]; // 윈도우에서 빠지는 항목
      const addItem = discount[i];         // 윈도우에 새로 들어오는 항목

      // 빠지는 항목 개수 하나 줄임
      windowCount.set(removeItem, windowCount.get(removeItem)! - 1);
      if (windowCount.get(removeItem) === 0) windowCount.delete(removeItem); // 0개가 되면 제거

      // 새 항목 개수 하나 증가
      windowCount.set(addItem, (windowCount.get(addItem) || 0) + 1);

      // 현재 윈도우가 조건을 만족하는지 확인
      if (this.isMatch(wantMap, windowCount)) result++;
    }

    return result;
  }

  /**
   * 현재 슬라이딩 윈도우가 고객의 원하는 상품 목록과 정확히 일치하는지 확인
   */
  private isMatch(wantMap: Map<string, number>, countMap: Map<string, number>): boolean {
    for (const [item, count] of wantMap.entries()) {
      if (countMap.get(item) !== count) return false; // 수량이 다르면 false
    }
    return true; // 모두 일치하면 true
  }
}
