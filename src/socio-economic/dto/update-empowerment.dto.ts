import { PartialType } from '@nestjs/swagger';
import { CreateEmpowermentDto } from './create-empowerment.dto';

export class UpdateEmpowermentDto extends PartialType(CreateEmpowermentDto) {}


