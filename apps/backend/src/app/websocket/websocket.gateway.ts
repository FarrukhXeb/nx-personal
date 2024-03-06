import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OpenAIService } from '../open-ai/open-ai.service';

@WebSocketGateway()
export class WebSocket {
  private logger: Logger = new Logger('WebSocket');
  private activeStreams: Record<string, () => Promise<void>> = {};

  constructor(private openAIService: OpenAIService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeStreams[client.id]?.();
    delete this.activeStreams[client.id];
  }

  @SubscribeMessage('chat')
  async handlePrompt(client: Socket, prompt: string) {
    this.activeStreams[client.id] = () =>
      this.openAIService.streamChatCompletion(
        prompt,
        (delta: string, err: Error) => {
          if (err) {
            this.logger.error(err);
            return;
          }
          client.emit('chat', delta);
        }
      );
    await this.activeStreams[client.id]();
  }
}
