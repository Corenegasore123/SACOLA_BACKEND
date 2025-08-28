import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HealthCentresService } from '../services/health-center.service';
import { CreateHealthCenterDto } from '../dto/create-health-center.dto';
import { UpdateHealthCenterDto } from '../dto/update-health-center.dto';

@ApiTags('socio-economic/health-centres')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/health-centres')
export class HealthCentresController {
  constructor(private readonly service: HealthCentresService) {}

  @Post()
  create(@Body() dto: CreateHealthCenterDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateHealthCenterDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


