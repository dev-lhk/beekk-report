import { ApiProperty } from '@nestjs/swagger';

export class ExpiryListResponseDto {
  @ApiProperty({ example: [1, 3], description: '파기해야 할 개인정보의 번호 목록' })
  expiredIndexes: number[];
}