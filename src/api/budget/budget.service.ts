import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { CheckBudgetDto } from './dto/budget-check.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { CreateBudgetRequestDto } from './dto/budget-request.dto';

import { PrismaService } from 'src/provider/prisma/prisma.service';

@Injectable()
// 이 데코레이터는 해당 클래스가 의존성 주입이 가능한 서비스임을 나타냄
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}
  // 생성자에서 PrismaService를 주입받아 데이터베이스와 상호작용할 수 있도록 함

  // 예산을 체크하고, 주어진 부서 예산 배열에서 몇 개까지 예산을 지원할 수 있는지 계산
  async checkBudget(dto: CheckBudgetDto): Promise<BudgetResponseDto> {
    const count = this.calculateMaxDepartments(dto.d, dto.budget); // 최대 지원 가능한 부서 수 계산
    return { maxDepartments: count }; // 결과 반환
  }

  // 예산 요청을 DB에 저장하는 메서드
  async createBudgetRequest(dto: CreateBudgetRequestDto) {
    const count = this.calculateMaxDepartments(dto.d, dto.budget); // 계산 로직 재사용

    try {
      // Prisma를 통해 데이터베이스에 예산 요청을 저장
      return await this.prisma.budgetRequest.create({
        data: {
          amounts: dto.d,        // 요청된 각 부서 예산 배열
          budget: dto.budget,    // 전체 예산
          result: count,         // 최대 지원 가능한 부서 수
        },
      });
    } catch (error) {
      // 예외 발생 시 서버 에러 로그 출력 및 예외 던짐
      console.error('Error:', error);
      throw new InternalServerErrorException('예산 요청 저장 중 오류가 발생했습니다.');
    }
  }

  // 최대 몇 개 부서까지 예산을 지원할 수 있는지 계산하는 내부 메서드
private calculateMaxDepartments(d: number[], budget: number): number {
  // ✅ 그리디(Greedy) 알고리즘 사용 이유:
  // - 전체 예산(budget) 내에서 가능한 한 많은 부서에 예산을 배정하는 것이 목표입니다.
  // - 작은 금액부터 차례대로 선택하면, 같은 예산으로 더 많은 부서를 지원할 수 있습니다.
  //   예: 예산이 100이고, [20, 50, 30, 10]이면
  //       -> 10 + 20 + 30 = 60 (3개 부서 지원 가능)
  //       -> 50부터 쓰면 2개밖에 못 지원할 수도 있음
  // - 이런 방식은 "항상 현재 선택이 전체적으로도 최선"이라는 그리디 전략에 부합합니다.

  const sorted = [...d].sort((a, b) => a - b); 
  // 작은 금액부터 우선 지원하기 위해 오름차순 정렬

  let sum = 0;     // 현재까지 사용한 예산의 합
  let count = 0;   // 지원 가능한 부서 수

  for (const amount of sorted) {
    if (sum + amount > budget) break;
    // 현재 부서를 추가했을 때 예산 초과하면 반복 종료

    sum += amount; // 예산 합계에 포함
    count++;       // 지원 가능한 부서 수 증가
  }

  return count; // 최대 몇 개 부서를 지원할 수 있는지 반환
}


  // 저장된 모든 예산 요청을 조회하는 메서드 (최신순 정렬)
  async getAllBudgetRequests() {
    return this.prisma.budgetRequest.findMany({
      orderBy: { createdAt: 'desc' }, // 생성일 기준 내림차순 정렬
    });
  }

  // 예산 요청 데이터를 초기화하는 메서드
  async reset() {
    await this.prisma.budgetRequest.deleteMany(); // 모든 예산 요청 삭제
    await this.prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'BudgetRequest'`);
    // SQLite에서 자동 증가 ID 시퀀스 초기화 (주의: 보안상 안전하지 않음)
    return { message: 'BudgetRequest 데이터가 초기화되었습니다.' }; // 응답 메시지 반환
  }
}
