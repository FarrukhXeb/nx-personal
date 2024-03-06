// src/app/websocket.module.ts
import { Module } from '@nestjs/common';
import { WebSocket } from './websocket.gateway';
import { OpenAIService } from '../open-ai/open-ai.service';

@Module({
  providers: [WebSocket, OpenAIService],
  exports: [WebSocket],
})
export class WebsocketModule {}
