import { ApiProperty } from '@nestjs/swagger';

export class BudgetResponseDto {
  @ApiProperty({ example: 3, description: '지원 가능한 부서 수' })
  maxDepartments: number;
}