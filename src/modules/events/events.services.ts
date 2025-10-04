import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/core/services/db-service/db.service';
import { CreateEventDto } from './events.dto';

@Injectable()
export class EventService {
  constructor(private readonly dbService: DbService) {}
  getEvents() {
    return this.dbService.sqlService.EventModel.findAll();
  }

  async create(data: CreateEventDto) {
    const newEvent = await this.dbService.sqlService.EventModel.create({
      ...data,
      time: new Date(data.time),
    });
    return newEvent.dataValues;
  }

  async delete(id: string) {
    return await this.dbService.sqlService.EventModel.destroy({
      where: { id },
    });
  }
}
