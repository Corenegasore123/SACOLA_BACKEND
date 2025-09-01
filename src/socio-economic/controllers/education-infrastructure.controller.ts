import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EducationInfrastructuresService } from '../services/education-infrastructure.service';
import { CreateEducationInfrastructureDto } from '../dto/create-education-infrastructure.dto';
import { UpdateEducationInfrastructureDto } from '../dto/update-education-infrastructure.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('socio-economic/education/infrastructures')
@ApiBearerAuth()
@Controller('api/socio-economic/education/infrastructures')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EducationInfrastructuresController {
  constructor(private readonly service: EducationInfrastructuresService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Body() dto: CreateEducationInfrastructureDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEducationInfrastructureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


