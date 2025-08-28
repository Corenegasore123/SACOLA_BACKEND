import { PartialType } from '@nestjs/swagger';
import { CreateEducationMaterialsDto } from './create-education-materials.dto';

export class UpdateEducationMaterialsDto extends PartialType(CreateEducationMaterialsDto) {}


