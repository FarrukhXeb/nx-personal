import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VapiService {
  private logger = new Logger(VapiService.name);
  async handleFunctionCall(call: any) {
    this.logger.log(`Handling function call: ${JSON.stringify(call, null, 2)}`);
  }
}
