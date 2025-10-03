// src/controllers/education.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CourseService } from './courses.services';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateSubjectDto,
  UpdateSubjectDto,
  CreateTimetableDto,
  UpdateTimetableDto,
  IdQueryDto,
  JoinCourseDto,
  CreateCompleteTimetableDto,
} from './courses.dto';
import { UserGuard } from 'src/core/guards/guards';
import { RequestDto } from 'src/core/dtos/request.dto';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: CourseService) {}

  // ----- Course -----
  @Post('courses')
  @ApiBody({ type: CreateCourseDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createCourse(@Body() body: CreateCourseDto) {
    return this.educationService.createCourse(body);
  }

  @Get('course/joined')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(UserGuard)
  getStudentCourse(@Req() req: RequestDto) {
    return this.educationService.getUserCourse(req.userId);
  }
  @Post('course/join')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(UserGuard)
  joinCourse(@Body() body: JoinCourseDto, @Req() req: RequestDto) {
    return this.educationService.joinCourse(req.userId, body.courseId);
  }

  @Get('courses')
  getCourses() {
    return this.educationService.getCourses();
  }

  @Get('course')
  @ApiQuery({ name: 'id', type: String })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  getCourse(@Query() query: IdQueryDto) {
    return this.educationService.getCourse(query.id);
  }

  @Put('course')
  @ApiQuery({ name: 'id', type: String })
  @ApiBody({ type: UpdateCourseDto })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateCourse(@Query() query: IdQueryDto, @Body() body: UpdateCourseDto) {
    return this.educationService.updateCourse(query.id, body);
  }

  @Delete('course')
  @ApiQuery({ name: 'id', type: String })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  deleteCourse(@Query() query: IdQueryDto) {
    return this.educationService.deleteCourse(query.id);
  }

  // ----- Subject -----
  @Post('subjects')
  @ApiBody({ type: CreateSubjectDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createSubject(@Body() body: CreateSubjectDto) {
    return this.educationService.createSubject(body);
  }

  @Get('subjects')
  getSubjects() {
    return this.educationService.getSubjects();
  }

  @Get('subject')
  @ApiQuery({ name: 'id', type: String })
  getSubject(@Query() query: IdQueryDto) {
    return this.educationService.getSubject(query.id);
  }

  @Put('subject')
  @ApiQuery({ name: 'id', type: String })
  @ApiBody({ type: UpdateSubjectDto })
  updateSubject(@Query() query: IdQueryDto, @Body() body: UpdateSubjectDto) {
    return this.educationService.updateSubject(query.id, body);
  }

  @Delete('subject')
  @ApiQuery({ name: 'id', type: String })
  deleteSubject(@Query() query: IdQueryDto) {
    return this.educationService.deleteSubject(query.id);
  }

  // ----- Timetable -----
  @Post('complete-timetable')
  async setCompleteTimetableForSubject(
    @Body() data: CreateCompleteTimetableDto,
  ) {
    return this.educationService.setCompleteTimetableForSubject(data);
  }
  @Post('timetables')
  @ApiBody({ type: CreateTimetableDto })
  createTimetable(@Body() body: CreateTimetableDto) {
    return this.educationService.createTimetable(body);
  }

  @Get('timetables')
  getTimetables() {
    return this.educationService.getTimetables();
  }

  @Get('timetable')
  @ApiQuery({ name: 'id', type: String })
  getTimetable(@Query() query: IdQueryDto) {
    return this.educationService.getTimetable(query.id);
  }

  @Put('timetable')
  @ApiQuery({ name: 'id', type: String })
  @ApiBody({ type: UpdateTimetableDto })
  updateTimetable(
    @Query() query: IdQueryDto,
    @Body() body: UpdateTimetableDto,
  ) {
    return this.educationService.updateTimetable(query.id, body);
  }

  @Delete('timetable')
  @ApiQuery({ name: 'id', type: String })
  deleteTimetable(@Query() query: IdQueryDto) {
    return this.educationService.deleteTimetable(query.id);
  }
}
