import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'The message from the user',
    example: 'Hello! How are you?',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Optional session ID to maintain context',
    example: 'user-12345-session',
    required: false,
  })
  @IsString()
  chatId: string;
}

export class CreateChatSessionDto {
  @ApiProperty({
    description: 'Optional title for the chat session',
    example: 'My First Chat Session',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;
}

export class ChatIdDto {
  @ApiProperty({
    description: 'The chat session ID to fetch history for',
    example: 'chat-12345-session',
  })
  @IsNotEmpty()
  @IsString()
  chatId: string;
}

export class UserIdDto {
  @ApiProperty({
    description: 'The chat session ID to fetch history for',
    example: 'chat-12345-session',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
