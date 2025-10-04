import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { EventService } from './events.services';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEventDto } from './events.dto';

@Controller('/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async getAllEvents() {
    return this.eventService.getEvents();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Delete()
  async deleteEvent(@Query('id') id: string) {
    await this.eventService.delete(id);
    return 'Event removed successfully';
  }
}
