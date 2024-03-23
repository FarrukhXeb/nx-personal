import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OpenAIService } from '../open-ai/open-ai.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
})
export class WebSocket {
  private logger: Logger = new Logger('WebSocket');
  private activeStreams: Record<string, () => Promise<void>> = {};
  private clients: Record<string, Socket> = {};

  constructor(private openAIService: OpenAIService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients[client.id] = client;
    this.openAIService.getOrCreateSession(client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeStreams[client.id]?.();
    delete this.activeStreams[client.id];
    delete this.clients[client.id];
  }

  @SubscribeMessage('chat')
  async handlePrompt(client: Socket, prompt: string) {
    this.activeStreams[client.id] = () =>
      this.openAIService.streamChatCompletion(
        client.id,
        prompt,
        (delta: string, err: Error) => {
          if (err) {
            this.logger.error(err);
            return;
          }
          client.emit('chat', delta);
        },
        () => {
          client.emit('prompt_completed', '');
        }
      );
    await this.activeStreams[client.id]();
  }

  // Add a method to get a client by its ID
  getClient(id: string): Socket | undefined {
    return this.clients[id];
  }
}
