import { IsString, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateFacultyDto {
  @IsString()
  @ApiProperty({ example: 'Dr. John Doe' })
  name: string;

  @IsString()
  @ApiProperty({ example: '9876543210' })
  phone: string;

  @IsString()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'professor' })
  designation: string;
}

export class UpdateFacultyDto extends PartialType(CreateFacultyDto) {
  @IsOptional()
  @ApiPropertyOptional({ example: 'Dr. Jane Smith' })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '9876543211' })
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 'jane.smith@example.com' })
  email?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 'professor' })
  designation?: string;
}
