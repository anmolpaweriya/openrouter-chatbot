// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CoursesModule } from '../courses/courses.module';
import { FacultyModule } from '../faculty/faculty.module';
import { BuildingModule } from '../building/building.module';
import { EventModule } from '../events/events.module';
@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [CoursesModule, FacultyModule, BuildingModule, EventModule],
})
export class ChatModule {}
