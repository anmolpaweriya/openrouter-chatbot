// src/dtos/education.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Weekday } from './courses.schema';
import { Max } from 'sequelize-typescript';
import { Type } from 'class-transformer';

export class JoinCourseDto {
  @IsString()
  @ApiProperty({ example: 'uuid-1234-5678' })
  courseId: string;
}

export class CreateCourseDto {
  @IsString()
  @ApiProperty({ example: 'Computer Science' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'CAP455' })
  code: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Computer Science' })
  name?: string;
}

export class SingleTimetableDto {
  @ApiProperty({
    enum: Weekday,
    example: Weekday.Monday,
    description: 'Day of the week for the class',
  })
  @IsEnum(Weekday)
  day: Weekday;

  @ApiProperty({
    example: '09:00',
    description: 'Start time of the class (HH:mm)',
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    example: '10:30',
    description: 'End time of the class (HH:mm)',
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    example: '304 building 24',
    description: 'room details',
  })
  @IsString()
  room: string;
}

export class CompleteTimetableDto {
  @ApiProperty({
    type: [SingleTimetableDto],
    description: 'List of timetable entries for the subject',
    example: [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
      },
      {
        day: 'Wednesday',
        startTime: '11:00',
        endTime: '12:30',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleTimetableDto)
  timetables: SingleTimetableDto[];
}

export class CreateSubjectDto extends CompleteTimetableDto {
  @IsString()
  @ApiProperty({ example: 'Data Structures' })
  name: string;

  @IsString()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId: string;

  @IsString()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  teacherId: string;
}

export class UpdateSubjectDto extends CompleteTimetableDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Algorithms' })
  name?: string;
}

export class CreateTimetableDto {
  @IsString()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId: string;

  @IsString()
  @ApiProperty({ example: '2fa85f64-5717-4562-b3fc-2c963f66afa7' })
  subjectId: string;

  @IsEnum(Weekday)
  @ApiProperty({ example: Weekday.Monday, enum: Weekday })
  day: Weekday;

  @IsString()
  @ApiProperty({ example: '09:00', description: 'Start time in HH:mm format' })
  startTime: string;

  @IsString()
  @ApiProperty({ example: '10:30', description: 'End time in HH:mm format' })
  endTime: string;
}

export class UpdateTimetableDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  courseId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '2fa85f64-5717-4562-b3fc-2c963f66afa7' })
  subjectId?: string;

  @IsOptional()
  @IsEnum(Weekday)
  @ApiPropertyOptional({ example: Weekday.Friday, enum: Weekday })
  day?: Weekday;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '10:00',
    description: 'Start time in HH:mm format',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '11:30',
    description: 'End time in HH:mm format',
  })
  endTime?: string;
}

export class IdQueryDto {
  @IsString()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;
}

export class CreateCompleteTimetableDto extends CompleteTimetableDto {
  @ApiProperty({
    example: 'subject-uuid',
    description: 'UUID of the subject',
  })
  @IsString()
  @IsNotEmpty()
  subjectId: string;
}
