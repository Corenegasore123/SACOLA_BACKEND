import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OtherProjectsService } from '../services/other-projects.service';
import { CreateOtherProjectDto } from '../dto/create-other-project.dto';
import { UpdateOtherProjectDto } from '../dto/update-other-project.dto';

@ApiTags('socio-economic/other')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/other')
export class OtherProjectsController {
  constructor(private readonly service: OtherProjectsService) {}

  @Post()
  create(@Body() dto: CreateOtherProjectDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'category', required: false, type: String })
  findAll(@Query('category') category?: string) {
    return this.service.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOtherProjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


