import {
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

@Controller('openai')
export class OpenAIController {
  private logger: Logger = new Logger(OpenAIController.name);

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    return 'Hello OpenAI';
  }
}
