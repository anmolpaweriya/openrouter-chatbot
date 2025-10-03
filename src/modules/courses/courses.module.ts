import { Module } from '@nestjs/common';
import { CourseService } from './courses.services';
import { EducationController } from './courses.controller';

@Module({
  controllers: [EducationController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CoursesModule {}
