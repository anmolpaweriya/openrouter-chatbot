// src/faculty/faculty.module.ts
import { Module } from '@nestjs/common';

import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.services';

@Module({
  providers: [FacultyService],
  controllers: [FacultyController],
  exports: [FacultyService],
})
export class FacultyModule {}
