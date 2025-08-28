import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TreePlantingService } from '../services/tree-planting.service';
import { CreateTreePlantingDto } from '../dto/create-tree-planting.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { TreePlanting } from '../entities/tree-planting.entity';

@ApiTags('conservation')
@ApiBearerAuth()
@Controller('api/conservation/tree-planting')
export class TreePlantingController {
  constructor(private readonly treePlantingService: TreePlantingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTreePlantingDto: CreateTreePlantingDto) {
    return this.treePlantingService.create(createTreePlantingDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: PaginationDto<TreePlanting>) {
    return this.treePlantingService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.treePlantingService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateTreePlantingDto: CreateTreePlantingDto) {
    return this.treePlantingService.update(id, updateTreePlantingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.treePlantingService.remove(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.treePlantingService.getStatistics();
  }
}
