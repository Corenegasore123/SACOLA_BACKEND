import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WaterPumpsService } from '../services/water-pumps.service';
import { CreateWaterPumpsDto } from '../dto/create-water-pumps.dto';
import { UpdateWaterPumpsDto } from '../dto/update-water-pumps.dto';

@ApiTags('socio-economic/water-pumps')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/water-pumps')
export class WaterPumpsController {
  constructor(private readonly service: WaterPumpsService) {}

  @Post()
  create(@Body() dto: CreateWaterPumpsDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWaterPumpsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
