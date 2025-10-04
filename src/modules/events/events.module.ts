import { Module } from '@nestjs/common';
import { EventController } from './events.controller';
import { EventService } from './events.services';

@Module({
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
