import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { LivestockService } from '../services/livestock.service';
import { CreateLivestockDto } from '../dto/create-livestock.dto';
import { UpdateLivestockDto } from '../dto/update-livestock.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('socio-economic/livestock')
@ApiBearerAuth()
@Controller('api/socio-economic/livestock')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LivestockController {
  constructor(private readonly livestockService: LivestockService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Body() dto: CreateLivestockDto) {
    return this.livestockService.create(dto);
  }

  @Get()
  @Roles(UserRole.VIEWER, UserRole.USER)
  findAll() {
    return this.livestockService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.livestockService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  update(@Param('id') id: string, @Body() dto: UpdateLivestockDto) {
    return this.livestockService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  remove(@Param('id') id: string) {
    return this.livestockService.remove(id);
  }
}


