import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HousingRepairsService } from '../services/house-repair.service';
import { CreateHouseRepairDto } from '../dto/create-house-repair.dto';
import { UpdateHouseRepairDto } from '../dto/update-house-repair.dto';

@ApiTags('socio-economic/housing/repairs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/housing/repairs')
export class HousingRepairsController {
  constructor(private readonly service: HousingRepairsService) {}

  @Post()
  create(@Body() dto: CreateHouseRepairDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateHouseRepairDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


