import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatRequestMessage,
  ChatCompletions,
} from '@azure/openai';
import { CookingPrompt } from './cooking-prompt';

@Injectable()
export class OpenAIService {
  private client: OpenAIClient;
  private deploymentId = 'gpt-4-32k-model';

  private sessions: Map<string, ChatRequestMessage[]> = new Map();
  private logger: Logger = new Logger('OpenAIService');

  constructor(private configService: ConfigService) {
    this.client = new OpenAIClient(
      this.configService.get<string>('openai.baseUrl', { infer: true }),
      new AzureKeyCredential(
        this.configService.get<string>('openai.key', { infer: true })
      )
    );
  }

  async getOrCreateSession(sessionId: string): Promise<ChatRequestMessage[]> {
    let session: ChatRequestMessage[] = this.sessions.get(sessionId);
    if (session === undefined) {
      session = [...CookingPrompt];
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  private updateSession(sessionId: string, messages: ChatRequestMessage[]) {
    this.sessions.set(sessionId, messages);
  }

  async chatCompletion(prompt: string): Promise<string> {
    const messages: ChatRequestMessage[] = [
      ...CookingPrompt,
      { role: 'user', content: prompt },
    ];
    const completion: ChatCompletions = await this.client.getChatCompletions(
      this.deploymentId,
      messages
    );

    return completion.choices[0].message.content;
  }

  async streamChatCompletion(
    sessionId: string,
    prompt: string,
    cb: (delta: string, error: Error) => void,
    onCompletion?: () => void
  ) {
    try {
      const messages = await this.getOrCreateSession(sessionId);
      messages.push({ role: 'user', content: prompt });
      this.updateSession(sessionId, messages);

      this.logger.log(`Current session: ${JSON.stringify(messages)}`);

      const events = await this.client.streamChatCompletions(
        this.deploymentId,
        messages
      );

      for await (const event of events) {
        for (const choice of event.choices) {
          const delta = choice.delta?.content;
          if (delta !== undefined) {
            cb(delta, null);
          }
        }
      }

      if (onCompletion) {
        onCompletion();
      }
    } catch (error) {
      cb(null, error);
    }
  }
}
