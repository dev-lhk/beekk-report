import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExpiryCheckDto {
  @ApiProperty({
    // example: '2022.05.19',
    example: '2020.01.01',
    description: '오늘 날짜 (YYYY.MM.DD)' })
  @IsString()
  today: string;

  @ApiProperty({
    // example: ['A 6', 'B 12', 'C 3'],
    example: ['Z 3', 'D 5'],
    description: '약관별 유효기간 배열 (형식: "약관명 유효기간")'
  })
  @IsArray()
  terms: string[];

  @ApiProperty({
    // example: ['2021.05.02 A', '2021.07.01 B', '2022.02.19 C', '2022.02.20 C'],
    example: ['2019.01.01 D', '2019.11.15 Z', '2019.08.02 D', '2019.07.01 D', '2018.12.28 Z'],
    description: '개인정보 수집일자 및 약관 종류 배열 (형식: "날짜 약관명")'
  })
  @IsArray()
  privacies: string[];
}
