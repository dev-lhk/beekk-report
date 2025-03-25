import { Controller, Post, Body, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CheckBudgetDto } from './dto/budget-check.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { CreateBudgetRequestDto } from './dto/budget-request.dto';

@ApiTags('budget')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('check')
  @ApiOperation({ summary: '예산 내 최대 지원 가능한 부서 수 계산만 수행' })
  @ApiResponse({ status: 200, description: '계산 결과', type: BudgetResponseDto })
  check(@Body() dto: CheckBudgetDto): Promise<BudgetResponseDto> {
    return this.budgetService.checkBudget(dto);
  }

  @Post()
  @ApiOperation({ summary: '예산 요청 저장 (계산 및 저장)' })
  create(@Body() dto: CreateBudgetRequestDto) {
    return this.budgetService.createBudgetRequest(dto);
  }

  @Get()
  @ApiOperation({ summary: '예산 요청 목록 조회' })
  getAll() {
    return this.budgetService.getAllBudgetRequests();
  }

  @Delete('reset')
  @ApiOperation({ summary: '예산 요청 계산 데이터 초기화' })
  reset() {
    return this.budgetService.reset();
  }
}