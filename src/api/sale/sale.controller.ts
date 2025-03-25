import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { SaleCheckDto } from './dto/sale-check.dto';
import { SaleResultDto } from './dto/sale-response.dto';

@ApiTags('sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('check')
  @ApiOperation({ summary: '할인 행사 계산만 수행' })
  @ApiResponse({ status: 200, type: SaleResultDto })
  check(@Body() dto: SaleCheckDto): SaleResultDto {
    return this.saleService.checkSale(dto);
  }

  @Post()
  @ApiOperation({ summary: '할인 행사 계산 및 DB 저장' })
  save(@Body() dto: SaleCheckDto) {
    return this.saleService.saveSale(dto);
  }

  @Get()
  @ApiOperation({ summary: '저장된 할인 계산 요청 목록 조회' })
  getAll() {
    return this.saleService.getAllSales();
  }

  @Delete('reset')
  @ApiOperation({ summary: '할인 계산 데이터 초기화' })
  reset() {
    return this.saleService.reset();
  }
}