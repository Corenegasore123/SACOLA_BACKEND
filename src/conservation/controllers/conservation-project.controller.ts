import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ConservationProjectService } from '../services/conservation-project.service';
import { CreateConservationProjectDto } from '../dto/create-conservation-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { ConservationProject } from '../entities/conservation-project.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('conservation/projects')
@ApiBearerAuth()
@Controller('api/conservation/projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ConservationProjectController {
  constructor(private readonly conservationProjectService: ConservationProjectService) {}

  @Post()
  @Roles(UserRole.USER)
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
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @Roles(UserRole.VIEWER, UserRole.USER)
  findAll(@Query() query: PaginationDto<ConservationProject>) {
    return this.conservationProjectService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.conservationProjectService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  update(@Param('id') id: string, @Body() updateConservationProjectDto: CreateConservationProjectDto) {
    return this.conservationProjectService.update(id, updateConservationProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  remove(@Param('id') id: string) {
    return this.conservationProjectService.remove(id);
  }

  @Get('stats')
  @Roles(UserRole.VIEWER, UserRole.USER)
  getStatistics() {
    return this.conservationProjectService.getStatistics();
  }
}
