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
import { HousingToiletsService } from '../services/housing-toilets.service';
import { CreateHousingToiletsDto } from '../dto/create-housing-toilets.dto';
import { UpdateHousingToiletsDto } from '../dto/update-housing-toilets.dto';

@ApiTags('socio-economic/housing/toilets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/housing/toilets')
export class HousingToiletsController {
  constructor(private readonly service: HousingToiletsService) {}

  @Post()
  create(@Body() dto: CreateHousingToiletsDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateHousingToiletsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
