import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmpowermentTailoringService } from '../services/empowerment.service';
import { CreateEmpowermentDto } from '../dto/create-empowerment.dto';
import { UpdateEmpowermentDto } from '../dto/update-empowerment.dto';

@ApiTags('socio-economic/empowerment/tailoring')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/empowerment/tailoring')
export class EmpowermentTailoringController {
  constructor(private readonly service: EmpowermentTailoringService) {}

  @Post()
  create(@Body() dto: CreateEmpowermentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEmpowermentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


