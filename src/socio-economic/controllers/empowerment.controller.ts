import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmpowermentTailoringService } from '../services/empowerment.service';
import { CreateEmpowermentDto } from '../dto/create-empowerment.dto';
import { UpdateEmpowermentDto } from '../dto/update-empowerment.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('socio-economic/empowerment/tailoring')
@ApiBearerAuth()
@Controller('api/socio-economic/empowerment/tailoring')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmpowermentTailoringController {
  constructor(private readonly service: EmpowermentTailoringService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Body() dto: CreateEmpowermentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEmpowermentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


