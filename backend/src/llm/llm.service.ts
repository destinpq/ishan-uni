import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatMessageDto } from './dto/chat.dto';
import { ApplicationsService } from '../applications/applications.service';

const SYSTEM_PROMPT = [
  'You are UniHub, an AI advisor for international university applications.',
  'You help students discover programs, draft application materials, and',
  'understand admission requirements. Be concise, factual, and cite the',
  "user's tracked applications when relevant. Never fabricate deadlines",
  'or fees — recommend the user verify on the official site.',
  'When recommending a program, always provide the direct URL to that',
  'specific course/program page (not just the university homepage), and',
  'also include the URL of the application portal when available.',
  'Only share real official URLs; if you are unsure, say so instead of',
  'guessing a link.',
].join(' ');

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(
    config: ConfigService,
    private readonly applications: ApplicationsService,
  ) {
    const apiKey = config.get<string>('openai.apiKey') ?? '';
    this.model = config.get<string>('openai.model') ?? 'gpt-4o-mini';
    if (!apiKey) this.logger.warn('OPENAI_API_KEY is not set.');
    this.client = new OpenAI({ apiKey });
  }

  async chat(userId: string, messages: ChatMessageDto[]): Promise<string> {
    const context = this.buildUserContext(userId);
    const full: ChatMessageDto[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: context },
      ...messages,
    ];
    return this.complete(full);
  }

  ask(userId: string, prompt: string): Promise<string> {
    return this.chat(userId, [{ role: 'user', content: prompt }]);
  }

  private async complete(messages: ChatMessageDto[]): Promise<string> {
    try {
      const res = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.3,
      });
      return res.choices[0]?.message?.content?.trim() ?? '';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      this.logger.error(`OpenAI call failed: ${msg}`);
      throw new InternalServerErrorException('LLM request failed');
    }
  }

  private buildUserContext(userId: string): string {
    const apps = this.applications.listForUser(userId);
    const list = apps
      .map(
        (a) =>
          `- ${a.universityName} [${a.status}] deadline=${a.deadline}`,
      )
      .join('\n');
    return [
      'User context (do not echo verbatim):',
      `Tracked applications:\n${list || '(none yet)'}`,
    ].join('\n\n');
  }
}
