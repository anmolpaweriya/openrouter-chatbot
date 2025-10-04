import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'Tech Conference 2025',
    description: 'The name of the event',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'An annual conference about the latest in technology.',
    description: 'Detailed description of the event',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-12-10T09:00:00Z',
    description: 'Date and time of the event in ISO8601 format',
  })
  @IsNotEmpty()
  @IsDateString()
  time: string;

  @ApiProperty({
    example: 'Main Auditorium, Tech Park',
    description: 'Location where the event will take place',
  })
  @IsNotEmpty()
  @IsString()
  location: string;
}
