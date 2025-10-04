import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Image file to be uploaded',
    example: 'image/jpeg',
  })
  file?: File;
}

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
    example: 'a2af34d5-327b-4050-9977-9452c3205884',
    required: true,
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
