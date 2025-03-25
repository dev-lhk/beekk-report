import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, ArrayNotEmpty, Min } from 'class-validator';

export class SaleCheckDto {
  @ApiProperty({
    // example: ["banana", "apple", "rice", "pork", "pot"],
    example: ["apple"],
    description: '원하는 제품 목록' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  want: string[];

  @ApiProperty({
    // example: [3, 2, 2, 2, 1],
    example: [10],
    description: '각 제품별 원하는 수량' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  number: number[];

  @ApiProperty({ 
    // example: ["chicken", "apple", "apple", "banana", "rice", "apple", "pork", "banana", "pork", "rice", "pot", "banana", "apple", "banana"],
    example: ["banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana"],
    description: 'XYZ 마트에서 할인하는 제품 순서' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  discount: string[];
}
