import { ApiProperty } from '@nestjs/swagger';

export class SaleResultDto {
  @ApiProperty({ example: 3, description: '정현이가 회원 가입할 수 있는 가능한 날짜 수' })
  result: number;
}