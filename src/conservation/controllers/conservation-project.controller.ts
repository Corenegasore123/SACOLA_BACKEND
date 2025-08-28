import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ConservationProjectService } from '../services/conservation-project.service';
import { CreateConservationProjectDto } from '../dto/create-conservation-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { ConservationProject } from '../entities/conservation-project.entity';

@ApiTags('conservation/projects')
@ApiBearerAuth()
@Controller('api/conservation/projects')
export class ConservationProjectController {
  constructor(private readonly conservationProjectService: ConservationProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createConservationProjectDto: CreateConservationProjectDto) {
    return this.conservationProjectService.create(createConservationProjectDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'startDate', 'endDate', 'status', 'createdAt', 'updatedAt'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order (ASC or DESC)',
    example: 'DESC',
  })
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query() paginationDto: PaginationDto<ConservationProject>,
  ) {
    return this.conservationProjectService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.conservationProjectService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateConservationProjectDto: CreateConservationProjectDto) {
    return this.conservationProjectService.update(id, updateConservationProjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.conservationProjectService.remove(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.conservationProjectService.getStatistics();
  }
}
