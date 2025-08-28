import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { WaterTankService } from '../services/water-tank.service';
import { CreateWaterTankDto } from '../dto/create-water-tank.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { WaterTank } from '../entities/water-tank.entity';

@ApiTags('conservation')
@ApiBearerAuth()
@Controller('api/conservation/water-tanks')
export class WaterTankController {
  constructor(private readonly waterTankService: WaterTankService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createWaterTankDto: CreateWaterTankDto) {
    return this.waterTankService.create(createWaterTankDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: PaginationDto<WaterTank>) {
    return this.waterTankService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.waterTankService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateWaterTankDto: CreateWaterTankDto) {
    return this.waterTankService.update(id, updateWaterTankDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.waterTankService.remove(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.waterTankService.getStatistics();
  }
}
