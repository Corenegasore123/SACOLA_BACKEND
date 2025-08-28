import { PartialType } from '@nestjs/swagger';
import { CreateSupportedStudentDto } from './create-supported-student.dto';

export class UpdateSupportedStudentDto extends PartialType(CreateSupportedStudentDto) {}


