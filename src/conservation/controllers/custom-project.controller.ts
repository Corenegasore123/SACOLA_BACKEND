import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CustomProjectService } from '../services/custom-project.service';
import { CreateCustomProjectDto } from '../dto/create-custom-project.dto';
import { CreateProjectEntryDto } from '../dto/create-project-entry.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { CustomProject } from '../entities/custom-project.entity';

@ApiTags('conservation')
@ApiBearerAuth()
@Controller('api/conservation/other')
export class CustomProjectController {
  constructor(private readonly customProjectService: CustomProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createProject(@Body() createCustomProjectDto: CreateCustomProjectDto) {
    return this.customProjectService.createProject(createCustomProjectDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @UseGuards(AuthGuard('jwt'))
  getProjects(@Query() query: PaginationDto<CustomProject>) {
    return this.customProjectService.getProjects(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getProjectById(@Param('id') id: string) {
    return this.customProjectService.getProjectById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: CreateCustomProjectDto,
  ) {
    return this.customProjectService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteProject(@Param('id') id: string) {
    return this.customProjectService.deleteProject(id);
  }

  @Post(':id/entries')
  @UseGuards(AuthGuard('jwt'))
  addEntry(
    @Param('id') projectId: string,
    @Body() createEntryDto: CreateProjectEntryDto,
  ) {
    return this.customProjectService.addEntry(projectId, createEntryDto);
  }

  @Put(':id/entries/:entryId')
  @UseGuards(AuthGuard('jwt'))
  updateEntry(
    @Param('id') projectId: string,
    @Param('entryId') entryId: string,
    @Body() updateEntryDto: CreateProjectEntryDto,
  ) {
    return this.customProjectService.updateEntry(projectId, entryId, updateEntryDto);
  }

  @Delete(':id/entries/:entryId')
  @UseGuards(AuthGuard('jwt'))
  deleteEntry(
    @Param('id') projectId: string,
    @Param('entryId') entryId: string,
  ) {
    return this.customProjectService.deleteEntry(projectId, entryId);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  getStatistics() {
    return this.customProjectService.getStatistics();
  }
}

