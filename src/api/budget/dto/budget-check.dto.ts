import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min, Max, ArrayNotEmpty } from 'class-validator';

export class CheckBudgetDto {
    @ApiProperty({ example: [1, 3, 2, 5, 4], description: '부서별 신청 금액 목록' })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    d: number[];

    @ApiProperty({ example: 9, description: '전체 예산 금액' })
    @IsInt()
    @Min(1)
    @Max(10000000)
    budget: number;
}
