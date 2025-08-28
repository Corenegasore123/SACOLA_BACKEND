import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { LivestockService } from '../services/livestock.service';
import { CreateLivestockDto } from '../dto/create-livestock.dto';
import { UpdateLivestockDto } from '../dto/update-livestock.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('socio-economic/livestock')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/livestock')
export class LivestockController {
  constructor(private readonly livestockService: LivestockService) {}

  @Post()
  create(@Body() dto: CreateLivestockDto) {
    return this.livestockService.create(dto);
  }

  @Get()
  findAll() {
    return this.livestockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.livestockService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLivestockDto) {
    return this.livestockService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.livestockService.remove(id);
  }
}


