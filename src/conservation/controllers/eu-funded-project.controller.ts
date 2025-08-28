import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { EUFundedProjectService } from '../services/eu-funded-project.service';
import { CreateEUFundedProjectDto } from '../dto/create-eu-funded-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { EUFundedProject } from '../entities/eu-funded-project.entity';

@ApiTags('conservation')
@ApiBearerAuth()
@Controller('api/conservation/eu-projects')
export class EUFundedProjectController {
  constructor(private readonly euFundedProjectService: EUFundedProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createEUFundedProjectDto: CreateEUFundedProjectDto) {
    return this.euFundedProjectService.create(createEUFundedProjectDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'district', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() paginationDto: PaginationDto<EUFundedProject>) {
    return this.euFundedProjectService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.euFundedProjectService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateEUFundedProjectDto: CreateEUFundedProjectDto) {
    return this.euFundedProjectService.update(id, updateEUFundedProjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.euFundedProjectService.remove(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.euFundedProjectService.getStatistics();
  }
}
