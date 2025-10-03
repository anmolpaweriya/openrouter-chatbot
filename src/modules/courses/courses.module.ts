import { Module } from '@nestjs/common';
import { EducationService } from './courses.services';
import { EducationController } from './courses.controller';

@Module({
  controllers: [EducationController],
  providers: [EducationService],
})
export class CoursesModule {}
