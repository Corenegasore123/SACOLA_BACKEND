import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EducationStudentsService } from '../services/supported-students.service';
import { CreateSupportedStudentDto } from '../dto/create-supported-student.dto';
import { UpdateSupportedStudentDto } from '../dto/update-supported-student.dto';

@ApiTags('socio-economic/education/students')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/socio-economic/education/students')
export class EducationStudentsController {
  constructor(private readonly service: EducationStudentsService) {}

  @Post()
  create(@Body() dto: CreateSupportedStudentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSupportedStudentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}


