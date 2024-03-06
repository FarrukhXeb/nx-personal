import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { OpenAIService } from './app/open-ai/open-ai.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API for NestJS')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('port', { infer: true });
  await app.listen(port);
  const env = configService.get('env', { infer: true });
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix} in ${env}`
  );

  const openAIService = app.get(OpenAIService);
  await openAIService.chatCompletion('What is the meaning of life?');
}

bootstrap();
