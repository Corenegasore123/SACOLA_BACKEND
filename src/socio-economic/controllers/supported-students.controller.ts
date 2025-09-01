import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { EducationStudentsService } from '../services/supported-students.service';
import { CreateSupportedStudentDto } from '../dto/create-supported-student.dto';
import { UpdateSupportedStudentDto } from '../dto/update-supported-student.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';

@ApiTags('socio-economic/education/students')
@ApiBearerAuth()
@Controller('api/socio-economic/education/students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EducationStudentsController {
  constructor(private readonly service: EducationStudentsService) {}

  @Post()
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new supported student entry' })
  @ApiResponse({ status: 201, description: 'Student entry created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() dto: CreateSupportedStudentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.VIEWER, UserRole.USER)
  @ApiOperation({ summary: 'Get all supported student entries' })
  @ApiResponse({ status: 200, description: 'List of student entries retrieved successfully' })
  findAll() {
    return this.service.findAll();
  }

  @Get('archived')
  @ApiOperation({ summary: 'Get all archived supported student entries' })
  @ApiResponse({ status: 200, description: 'List of archived student entries' })
  findAllArchived() {
    return this.service.findAllArchived();
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.USER)
  @ApiOperation({ summary: 'Get a specific supported student entry' })
  @ApiParam({ name: 'id', description: 'Student entry ID' })
  @ApiResponse({ status: 200, description: 'Student entry retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student entry not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update a supported student entry' })
  @ApiParam({ name: 'id', description: 'Student entry ID' })
  @ApiResponse({ status: 200, description: 'Student entry updated successfully' })
  @ApiResponse({ status: 404, description: 'Student entry not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(@Param('id') id: string, @Body() dto: UpdateSupportedStudentDto) {
    return this.service.update(id, dto);
  }

  @Put(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a supported student entry' })
  @ApiParam({ name: 'id', description: 'Student entry ID to archive' })
  @ApiResponse({
    status: 200,
    description: 'Student entry archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Student entry not found' })
  archive(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Put(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive a supported student entry' })
  @ApiParam({ name: 'id', description: 'Student entry ID to unarchive' })
  @ApiResponse({
    status: 200,
    description: 'Student entry unarchived successfully',
  })
  @ApiResponse({ status: 404, description: 'Student entry not found' })
  unarchive(@Param('id') id: string) {
    return this.service.unarchive(id);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Delete a supported student entry' })
  @ApiParam({ name: 'id', description: 'Student entry ID' })
  @ApiResponse({ status: 200, description: 'Student entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student entry not found' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
