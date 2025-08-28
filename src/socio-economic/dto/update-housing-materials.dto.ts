import { PartialType } from '@nestjs/swagger';
import { CreateHousingMaterialsDto } from './create-housing-materials.dto';

export class UpdateHousingMaterialsDto extends PartialType(CreateHousingMaterialsDto) {}


