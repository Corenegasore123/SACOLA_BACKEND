import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BuffaloWallService } from '../services/buffalo-wall.service';
import { CreateBuffaloWallDto } from '../dto/create-buffalo-wall.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { BuffaloWall } from '../entities/buffalo-wall.entity';

@ApiTags('conservation')
@ApiBearerAuth()
@Controller('api/conservation/buffalo-wall')
export class BuffaloWallController {
  constructor(private readonly buffaloWallService: BuffaloWallService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createBuffaloWallDto: CreateBuffaloWallDto) {
    return this.buffaloWallService.create(createBuffaloWallDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: PaginationDto<BuffaloWall>) {
    return this.buffaloWallService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.buffaloWallService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateBuffaloWallDto: CreateBuffaloWallDto) {
    return this.buffaloWallService.update(id, updateBuffaloWallDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.buffaloWallService.remove(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.buffaloWallService.getStatistics();
  }
}
