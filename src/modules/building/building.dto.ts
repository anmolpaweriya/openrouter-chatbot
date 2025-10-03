import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty({ example: 'Empire State Building' })
  @IsString()
  name: string;

  @ApiProperty({ example: 40.748817 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -73.985428 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'Famous skyscraper in NYC', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
