import { Module } from '@nestjs/common';
import { ExpiryController } from './expiry.controller';
import { ExpiryService } from './expiry.service';

@Module({
  imports: [],
  controllers: [ExpiryController],
  providers: [ExpiryService],
})
export class ExpiryModule {}
