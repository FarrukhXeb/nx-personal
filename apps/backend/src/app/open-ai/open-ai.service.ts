import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatRequestMessage,
} from '@azure/openai';

@Injectable()
export class OpenAIService {
  constructor(private configService: ConfigService) {}

  getOpenAIKey(): string {
    return this.configService.get('openai.key', { infer: true });
  }

  getBaseUrl(): string {
    return this.configService.get('openai.baseUrl', { infer: true });
  }

  async chatCompletion(prompt: string) {
    const client = new OpenAIClient(
      this.getBaseUrl(),
      new AzureKeyCredential(this.getOpenAIKey())
    );

    const messages: ChatRequestMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant. You will talk like a pirate.',
      },
      { role: 'user', content: 'Can you help me?' },
      {
        role: 'assistant',
        content: 'Arrrr! Of course, me hearty! What can I do for ye?',
      },
      { role: 'user', content: prompt },
    ];

    const events = await client.streamChatCompletions(
      'gpt-4-32k-model',
      messages
    );

    for await (const event of events) {
      for (const choice of event.choices) {
        const delta = choice.delta?.content;
        if (delta !== undefined) {
          console.log(`Chatbot: ${delta}`);
        }
      }
    }
  }
}
