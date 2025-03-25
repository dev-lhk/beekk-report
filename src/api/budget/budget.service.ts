import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CheckBudgetDto } from './dto/budget-check.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { CreateBudgetRequestDto } from './dto/budget-request.dto';
import { PrismaService } from 'src/provider/prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async checkBudget(dto: CheckBudgetDto): Promise<BudgetResponseDto> {
    const count = this.calculateMaxDepartments(dto.d, dto.budget);
    return { maxDepartments: count };
  }

  async createBudgetRequest(dto: CreateBudgetRequestDto) {
    const count = this.calculateMaxDepartments(dto.d, dto.budget);

    try {
      return await this.prisma.budgetRequest.create({
        data: {
          amounts: dto.d,
          budget: dto.budget,
          result: count,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException('예산 요청 저장 중 오류가 발생했습니다.');
    }
  }

  private calculateMaxDepartments(d: number[], budget: number): number {
    const sorted = [...d].sort((a, b) => a - b);
    let sum = 0;
    let count = 0;

    for (const amount of sorted) {
      if (sum + amount > budget) break;
      sum += amount;
      count++;
    }

    return count;
  }

  async getAllBudgetRequests() {
    return this.prisma.budgetRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async reset() {
    await this.prisma.budgetRequest.deleteMany();
    await this.prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'BudgetRequest'`);
    return { message: 'BudgetRequest 데이터가 초기화되었습니다.' };
  }
}