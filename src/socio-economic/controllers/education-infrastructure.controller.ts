import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EducationInfrastructuresService } from '../services/education-infrastructure.service';
import { CreateEducationInfrastructureDto } from '../dto/create-education-infrastructure.dto';
import { UpdateEducationInfrastructureDto } from '../dto/update-education-infrastructure.dto';

@ApiTags('socio-economic/education/infrastructures')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/education/infrastructures')
export class EducationInfrastructuresController {
  constructor(private readonly service: EducationInfrastructuresService) {}

  @Post()
  create(@Body() dto: CreateEducationInfrastructureDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEducationInfrastructureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


