import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ExpiryCheckDto } from './dto/expiry.dto';
import { ExpiryListResponseDto } from './dto/expiry-response.dto';
import { PrismaService } from 'src/provider/prisma/prisma.service';

@Injectable()
export class ExpiryService {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(dto: ExpiryCheckDto): Promise<ExpiryListResponseDto> {
    try {
      const todayDays = this.convertDateToDays(dto.today);
      const termMap = this.buildTermMap(dto.terms);

      const expiredIndexes = dto.privacies.reduce((acc: number[], p, i) => {
        const [collected, termCode] = p.split(' ');
        const duration = termMap.get(termCode);
        if (duration === undefined) return acc;

        const expiryLimit = this.convertDateToDays(collected) + duration * 28 - 1;
        if (expiryLimit < todayDays) acc.push(i + 1);

        return acc;
      }, []);

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

  private convertDateToDays(date: string): number {
    const [y, m, d] = date.split('.').map(Number);
    return (y - 2000) * 12 * 28 + (m - 1) * 28 + d;
  }

  private buildTermMap(terms: string[]): Map<string, number> {
    return terms.reduce((map, entry) => {
      const [code, dur] = entry.split(' ');
      map.set(code, parseInt(dur));
      return map;
    }, new Map<string, number>());
  }
}