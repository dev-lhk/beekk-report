import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SaleCheckDto } from './dto/sale-check.dto';
import { SaleResultDto } from './dto/sale-response.dto';
import { PrismaService } from 'src/provider/prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  checkSale(dto: SaleCheckDto): SaleResultDto {
    const result = this.calculateSale(dto);
    return { result };
  }

  async saveSale(dto: SaleCheckDto) {
    const result = this.calculateSale(dto);
    try {
      return await this.prisma.saleRequest.create({
        data: {
          want: dto.want,
          number: dto.number,
          discount: dto.discount,
          result,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException('할인 요청 저장 중 오류가 발생했습니다.');
    }
  }

  async getAllSales() {
    return this.prisma.saleRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async reset() {
    await this.prisma.saleRequest.deleteMany();
    await this.prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'SaleRequest'`);
    return { message: 'SaleRequest 테이블이 초기화되었습니다.' };
  }

  private calculateSale(dto: SaleCheckDto): number {
    const { want, number, discount } = dto;
    const wantMap = new Map<string, number>();
    for (let i = 0; i < want.length; i++) {
      wantMap.set(want[i], number[i]);
    }

    let result = 0;
    const windowCount = new Map<string, number>();

    // 초기 윈도우 세팅
    for (let i = 0; i < 10; i++) {
      const item = discount[i];
      windowCount.set(item, (windowCount.get(item) || 0) + 1);
    }

    if (this.isMatch(wantMap, windowCount)) result++;

    for (let i = 10; i < discount.length; i++) {
      const removeItem = discount[i - 10];
      const addItem = discount[i];

      // 윈도우 슬라이딩
      windowCount.set(removeItem, windowCount.get(removeItem)! - 1);
      if (windowCount.get(removeItem) === 0) windowCount.delete(removeItem);

      windowCount.set(addItem, (windowCount.get(addItem) || 0) + 1);

      if (this.isMatch(wantMap, windowCount)) result++;
    }

    return result;
  }

  private isMatch(wantMap: Map<string, number>, countMap: Map<string, number>): boolean {
    for (const [item, count] of wantMap.entries()) {
      if (countMap.get(item) !== count) return false;
    }
    return true;
  }
}