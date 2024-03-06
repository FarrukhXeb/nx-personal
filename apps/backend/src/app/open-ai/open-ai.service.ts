import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatRequestMessage,
  ChatCompletions,
} from '@azure/openai';

@Injectable()
export class OpenAIService {
  private client: OpenAIClient;
  private deploymentId = 'gpt-4-32k-model';
  private messages: ChatRequestMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant. You will talk like a pirate.',
    },
    { role: 'user', content: 'Can you help me?' },
    {
      role: 'assistant',
      content: 'Arrrr! Of course, me hearty! What can I do for ye?',
    },
  ];

  constructor(private configService: ConfigService) {
    this.client = new OpenAIClient(
      this.configService.get<string>('openai.baseUrl', { infer: true }),
      new AzureKeyCredential(
        this.configService.get<string>('openai.key', { infer: true })
      )
    );
  }

  async chatCompletion(prompt: string): Promise<string> {
    const messages: ChatRequestMessage[] = [
      ...this.messages,
      { role: 'user', content: prompt },
    ];
    const completion: ChatCompletions = await this.client.getChatCompletions(
      this.deploymentId,
      messages
    );

    return completion.choices[0].message.content;
  }

  async streamChatCompletion(
    prompt: string,
    cb: (delta: string, error: Error) => void
  ) {
    try {
      const messages: ChatRequestMessage[] = [
        ...this.messages,
        { role: 'user', content: prompt },
      ];
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
    } catch (error) {
      cb(null, error);
    }
  }
}
