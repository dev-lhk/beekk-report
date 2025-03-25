import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './provider/prisma/prisma.service';
import { ExpiryModule } from './api/expiry/expiry.module';
import { PrismaModule } from './provider/prisma/prisma.module';
import { BudgetModule } from './api/budget/budget.module';
import { SaleModule } from './api/sale/sale.module';

@Module({
  imports: [
    PrismaModule,
    ExpiryModule,
    BudgetModule,
    SaleModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
