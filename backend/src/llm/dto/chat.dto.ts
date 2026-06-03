import { ArrayMinSize, IsArray, IsIn, IsString, MaxLength } from 'class-validator';

export class ChatMessageDto {
  @IsIn(['system', 'user', 'assistant'])
  role!: 'system' | 'user' | 'assistant';

  @IsString()
  @MaxLength(8000)
  content!: string;
}

export class ChatDto {
  @IsArray()
  @ArrayMinSize(1)
  messages!: ChatMessageDto[];
}

export class AskDto {
  @IsString()
  @MaxLength(4000)
  prompt!: string;
}
