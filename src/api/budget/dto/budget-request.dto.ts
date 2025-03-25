import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class CreateBudgetRequestDto {
  @ApiProperty({ 
    // example: [1, 3, 2, 5, 4],
    example: [2, 2, 3, 3],
    description: '부서별 신청 금액' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  d: number[];

  @ApiProperty({ 
    // example: 9,
    example: 10,
    description: '예산' })
  @IsInt()
  budget: number;
}