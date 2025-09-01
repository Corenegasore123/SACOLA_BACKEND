import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SportsService } from '../services/sports.service';
import { CreateSportsDto } from '../dto/create-sports.dto';
import { UpdateSportsDto } from '../dto/update-sports.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('socio-economic/sports')
@ApiBearerAuth()
@Controller('api/socio-economic/sports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SportsController {
  constructor(private readonly service: SportsService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Body() dto: CreateSportsDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSportsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


