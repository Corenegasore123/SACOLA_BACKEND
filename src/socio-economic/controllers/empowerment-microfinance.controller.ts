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
import { EmpowermentMicroFinanceService } from '../services/empowerment-microfinance.service';
import { CreateEmpowermentMicroFinanceDto } from '../dto/create-empowerment-microfinance.dto';
import { UpdateEmpowermentMicroFinanceDto } from '../dto/update-empowerment-microfinance.dto';

@ApiTags('socio-economic/empowerment/microfinances')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/empowerment/microfinances')
export class EmpowermentMicroFinanceController {
  constructor(private readonly service: EmpowermentMicroFinanceService) {}

  @Post()
  create(@Body() dto: CreateEmpowermentMicroFinanceDto) {
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
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmpowermentMicroFinanceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
