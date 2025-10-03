import { Injectable } from '@nestjs/common';
import { DbService } from 'src/core/services/db-service/db.service';
import { BuildingModel } from './building.schema';
import { CreateBuildingDto } from './building.dto';

@Injectable()
export class BuildingService {
  private readonly BuildingModel: typeof BuildingModel;
  constructor(private readonly dbService: DbService) {
    this.BuildingModel = this.dbService.sqlService.BuildingModel;
  }

  getAllBuildings() {
    return this.BuildingModel.findAll();
  }

  async create(createDto: CreateBuildingDto) {
    return this.BuildingModel.create(createDto);
  }

  async delete(id: string) {
    await this.BuildingModel.destroy({ where: { id } });
    return 'Deleted successfully';
  }
}
