import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { ExpiryService } from './expiry.service';
import { ExpiryCheckDto } from './dto/expiry.dto';
import { ExpiryListResponseDto } from './dto/expiry-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('expiry')
@Controller('expiry')
export class ExpiryController {
  constructor(private readonly expiryService: ExpiryService) {}

  @Post('calculate')
  @ApiOperation({ summary: '개인정보 유효기간 계산', description: '입력된 날짜 기준으로 파기 대상 개인정보 번호만 계산합니다.' })
  @ApiResponse({ status: 200, type: ExpiryListResponseDto })
  calculate(@Body() dto: ExpiryCheckDto): Promise<ExpiryListResponseDto> {
    return this.expiryService.calculate(dto);
  }

  @Post('check')
  @ApiOperation({ summary: '개인정보 유효기간 계산 및 저장', description: '계산 후 결과를 DB에 저장합니다.' })
  saveCheck(@Body() dto: ExpiryCheckDto): Promise<ExpiryListResponseDto> {
    return this.expiryService.saveCheck(dto);
  }

  @Get()
  @ApiOperation({ summary: '저장된 개인정보 유효기간 결과 목록 조회' })
  findAll() {
    return this.expiryService.findAll();
  }

  @Delete('reset')
  @ApiOperation({ summary: '개인정보 유효기간 데이터 초기화' })
  reset() {
    return this.expiryService.reset();
  }
}