import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './building.dto';

@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get()
  async getAllBuildings() {
    return this.buildingService.getAllBuildings();
  }

  @Post()
  async create(@Body() createDto: CreateBuildingDto) {
    return this.buildingService.create(createDto);
  }

  @Delete()
  async delete(@Query('id') id: string) {
    return this.buildingService.delete(id);
  }
}
