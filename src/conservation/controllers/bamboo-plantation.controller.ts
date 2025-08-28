import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BambooPlantationService } from '../services/bamboo-plantation.service';
import { CreateBambooPlantationDto } from '../dto/create-bamboo-plantation.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { BambooPlantation } from '../entities/bamboo-plantation.entity';

@ApiTags('conservation')
@ApiBearerAuth()
@Controller('api/conservation/bamboo')
export class BambooPlantationController {
  constructor(private readonly bambooPlantationService: BambooPlantationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createBambooPlantationDto: CreateBambooPlantationDto) {
    return this.bambooPlantationService.create(createBambooPlantationDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() paginationDto: PaginationDto<BambooPlantation>) {
    return this.bambooPlantationService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.bambooPlantationService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateBambooPlantationDto: CreateBambooPlantationDto) {
    return this.bambooPlantationService.update(id, updateBambooPlantationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.bambooPlantationService.remove(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.bambooPlantationService.getStatistics();
  }
}
