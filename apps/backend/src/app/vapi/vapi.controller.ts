import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { VapiService } from './vapi.service';

@Controller('vapi')
export class VapiController {
  constructor(private vapiService: VapiService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getVapi() {
    return 'Hello Vapi';
  }

  @Post('/function-call')
  @HttpCode(HttpStatus.OK)
  async handleFunctionCall(@Body() call: any) {
    this.vapiService.handleFunctionCall(call);
    return 'Function call handled';
  }
}
