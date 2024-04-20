import { Module } from '@nestjs/common';
import { VapiController } from './vapi.controller';
import { VapiService } from './vapi.service';

@Module({
  imports: [],
  controllers: [VapiController],
  providers: [VapiService],
})
export class VapiModule {}
