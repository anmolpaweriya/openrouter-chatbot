// src/faculty/faculty.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFacultyDto, UpdateFacultyDto } from './faculty.dto';
import { DbService } from 'src/core/services/db-service/db.service';
import { FacultyModel } from './faculty.schema';

@Injectable()
export class FacultyService {
  private readonly FacultyModel: typeof FacultyModel;
  constructor(private readonly dbService: DbService) {
    this.FacultyModel = this.dbService.sqlService.FacultyModel;
  }

  async create(createDto: CreateFacultyDto) {
    return this.FacultyModel.create(createDto);
  }

  async findAll() {
    return this.FacultyModel.findAll();
  }

  async findById(id: string) {
    const faculty = await this.FacultyModel.findByPk(id);
    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async update(id: string, updateDto: UpdateFacultyDto) {
    const faculty = await this.findById(id);
    return faculty.update(updateDto);
  }

  async delete(id: string) {
    const faculty = await this.findById(id);
    await faculty.destroy();
    return { message: 'Faculty deleted successfully' };
  }
}
