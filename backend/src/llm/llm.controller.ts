import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  AuthUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { LlmService } from './llm.service';
import { AskDto, ChatDto } from './dto/chat.dto';

@UseGuards(JwtAuthGuard)
@Controller('llm')
export class LlmController {
  constructor(private readonly llm: LlmService) {}

  @Post('ask')
  async ask(
    @CurrentUser() u: AuthUser,
    @Body() dto: AskDto,
  ): Promise<{ reply: string }> {
    return { reply: await this.llm.ask(u.id, dto.prompt) };
  }

  @Post('chat')
  async chat(
    @CurrentUser() u: AuthUser,
    @Body() dto: ChatDto,
  ): Promise<{ reply: string }> {
    return { reply: await this.llm.chat(u.id, dto.messages) };
  }
}
