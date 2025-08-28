import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HousingMaterialsService } from '../services/housing-materials.service';
import { CreateHousingMaterialsDto } from '../dto/create-housing-materials.dto';
import { UpdateHousingMaterialsDto } from '../dto/update-housing-materials.dto';

@ApiTags('socio-economic/housing/materials')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/housing/materials')
export class HousingMaterialsController {
  constructor(private readonly service: HousingMaterialsService) {}

  @Post()
  create(@Body() dto: CreateHousingMaterialsDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateHousingMaterialsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


