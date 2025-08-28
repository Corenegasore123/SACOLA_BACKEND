import { PartialType } from '@nestjs/swagger';
import { CreateEducationInfrastructureDto } from './create-education-infrastructure.dto';

export class UpdateEducationInfrastructureDto extends PartialType(CreateEducationInfrastructureDto) {}


