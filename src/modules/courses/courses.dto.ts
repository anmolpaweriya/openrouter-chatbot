// src/dtos/education.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @ApiProperty({ example: 'Computer Science' })
  name: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Computer Science' })
  name?: string;
}

export class CreateSubjectDto {
  @IsString()
  @ApiProperty({ example: 'Data Structures' })
  name: string;

  @IsUUID()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId: string;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Algorithms' })
  name?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId?: string;
}

export class CreateTimetableDto {
  @IsUUID()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId: string;

  @IsUUID()
  @ApiProperty({ example: '2fa85f64-5717-4562-b3fc-2c963f66afa7' })
  subjectId: string;

  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  @ApiProperty({
    example: 'Monday',
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  })
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

  @IsString()
  @ApiProperty({ example: '09:00' })
  timeSlot: string;
}

export class UpdateTimetableDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '2fa85f64-5717-4562-b3fc-2c963f66afa7' })
  subjectId?: string;

  @IsOptional()
  @IsEnum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  @ApiPropertyOptional({
    example: 'Friday',
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  })
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '10:30' })
  timeSlot?: string;
}

export class IdQueryDto {
  @IsUUID()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;
}
