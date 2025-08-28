import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HousingVillagesService } from '../services/village-housing.service';
import { CreateVillageHousingDto } from '../dto/create-village-housing.dto';
import { UpdateVillageHousingDto } from '../dto/update-village-housing.dto';

@ApiTags('socio-economic/housing/villages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/housing/villages')
export class VillageHousingController {
  constructor(private readonly service: HousingVillagesService) {}

  @Post()
  create(@Body() dto: CreateVillageHousingDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVillageHousingDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


