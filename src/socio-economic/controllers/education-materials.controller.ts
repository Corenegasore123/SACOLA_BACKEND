import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EducationMaterialsService } from '../services/education-materials.service';
import { CreateEducationMaterialsDto } from '../dto/create-education-materials.dto';
import { UpdateEducationMaterialsDto } from '../dto/update-education-materials.dto';

@ApiTags('socio-economic/education/materials')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/education/materials')
export class EducationMaterialsController {
  constructor(private readonly service: EducationMaterialsService) {}

  @Post()
  create(@Body() dto: CreateEducationMaterialsDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEducationMaterialsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


