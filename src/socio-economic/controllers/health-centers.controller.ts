import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HealthCentresService } from '../services/health-center.service';
import { CreateHealthCenterDto } from '../dto/create-health-center.dto';
import { UpdateHealthCenterDto } from '../dto/update-health-center.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('socio-economic/health/centres')
@ApiBearerAuth()
@Controller('api/socio-economic/health/centres')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class HealthCentresController {
  constructor(private readonly service: HealthCentresService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Body() dto: CreateHealthCenterDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.VIEWER, UserRole.USER)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  update(@Param('id') id: string, @Body() dto: UpdateHealthCenterDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


