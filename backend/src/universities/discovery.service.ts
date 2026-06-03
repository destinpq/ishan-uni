import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import OpenAI from 'openai';

export interface Program {
  name: string;
  url: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city?: string;
  website: string;
  applicationPortalUrl?: string;
  programs: Program[];
  description?: string;
  logo?: string;
}

interface DiscoverArgs {
  search?: string;
  program?: string;
  country?: string;
  limit?: number;
}

const SYSTEM = [
  'You are a university discovery assistant for international applicants.',
  'Return ONLY valid JSON: {"results":[{"name":string,"country":string,',
  '"city":string,"website":string,"applicationPortalUrl":string,',
  '"programs":[{"name":string,"url":string}],"description":string}]}',
  'For EACH program, "url" MUST be the direct link to that specific',
  'course/program page on the university\'s official website (e.g. the',
  'department or program landing page), NOT just the university homepage.',
  'Only include programs relevant to the user\'s search term.',
  'Use official university domains. Never invent fees or deadlines.',
  'If you cannot find a real program page URL, omit that program rather than',
  'guessing a fake link.',
].join(' ');

@Injectable()
export class DiscoveryService {
  private readonly logger = new Logger(DiscoveryService.name);
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly cache = new Map<string, University>();

  constructor(config: ConfigService) {
    this.client = new OpenAI({
      apiKey: config.get<string>('openai.apiKey') ?? '',
    });
    this.model = config.get<string>('openai.model') ?? 'gpt-4o-mini';
  }

  async discover(args: DiscoverArgs): Promise<University[]> {
    const limit = Math.min(Math.max(args.limit ?? 12, 1), 30);
    const lines: string[] = [];
    if (args.search) lines.push(`Search term: "${args.search}"`);
    if (args.program) lines.push(`Program of interest: "${args.program}"`);
    if (args.country) lines.push(`Country: "${args.country}"`);
    if (lines.length === 0) {
      lines.push('Return the top globally recognised universities.');
    }
    lines.push(`Return up to ${limit} matching universities.`);

    const raw = await this.callModel(lines.join('\n'));
    const parsed = this.safeParse(raw);
    const results = parsed.map((r) => this.toUniversity(r));
    for (const u of results) this.cache.set(u.id, u);
    return results;
  }

  getById(id: string): University | null {
    return this.cache.get(id) ?? null;
  }

  private async callModel(prompt: string): Promise<string> {
    try {
      const res = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
      });
      return res.choices[0]?.message?.content ?? '{"results":[]}';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      this.logger.error(`OpenAI discovery failed: ${msg}`);
      throw new InternalServerErrorException('University discovery failed');
    }
  }

  private safeParse(raw: string): Array<Record<string, unknown>> {
    try {
      const obj = JSON.parse(raw) as { results?: Array<Record<string, unknown>> };
      return obj.results ?? [];
    } catch {
      return [];
    }
  }

  private toUniversity(r: Record<string, unknown>): University {
    const name = String(r.name ?? 'Unknown');
    const country = String(r.country ?? '');
    const website = String(r.website ?? r.websiteUrl ?? '');
    const id = createHash('sha1')
      .update(`${name}|${country}|${website}`)
      .digest('hex')
      .slice(0, 16);
    const programs: Program[] = Array.isArray(r.programs)
      ? (r.programs as unknown[])
          .map((p) => {
            if (p && typeof p === 'object') {
              const obj = p as Record<string, unknown>;
              return {
                name: String(obj.name ?? ''),
                url: String(obj.url ?? obj.link ?? ''),
              };
            }
            // Backwards-compat: model returned a plain string program name.
            return { name: String(p), url: '' };
          })
          .filter((p) => p.name)
      : [];
    return {
      id,
      name,
      country,
      city: r.city ? String(r.city) : undefined,
      website,
      applicationPortalUrl: r.applicationPortalUrl
        ? String(r.applicationPortalUrl)
        : undefined,
      programs,
      description: r.description ? String(r.description) : undefined,
    };
  }
}
