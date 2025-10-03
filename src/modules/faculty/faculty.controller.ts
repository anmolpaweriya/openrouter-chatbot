// src/faculty/faculty.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';

import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FacultyService } from './faculty.services';
import { CreateFacultyDto, UpdateFacultyDto } from './faculty.dto';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a faculty' })
  @ApiResponse({ status: 201, description: 'Faculty created' })
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all faculties' })
  findAll() {
    return this.facultyService.findAll();
  }

  @Get('by-id')
  @ApiQuery({ name: 'id', required: true, example: 'uuid-123' })
  @ApiOperation({ summary: 'Find faculty by ID' })
  findOne(@Query('id') id: string) {
    return this.facultyService.findById(id);
  }

  @Patch()
  @ApiQuery({ name: 'id', required: true, example: 'uuid-123' })
  @ApiOperation({ summary: 'Update faculty by ID' })
  update(@Query('id') id: string, @Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(id, dto);
  }

  @Delete()
  @ApiQuery({ name: 'id', required: true, example: 'uuid-123' })
  @ApiOperation({ summary: 'Delete faculty by ID' })
  remove(@Query('id') id: string) {
    return this.facultyService.delete(id);
  }
}
