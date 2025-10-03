// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CoursesModule } from '../courses/courses.module';
import { FacultyModule } from '../faculty/faculty.module';
@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [CoursesModule, FacultyModule],
})
export class ChatModule {}
