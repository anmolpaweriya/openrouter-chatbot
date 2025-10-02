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
  @IsOptional()
  @IsString()
  sessionId?: string;
}
