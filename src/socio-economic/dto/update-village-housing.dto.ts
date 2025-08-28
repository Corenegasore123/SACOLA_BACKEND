import { PartialType } from '@nestjs/swagger';
import { CreateVillageHousingDto } from './create-village-housing.dto';

export class UpdateVillageHousingDto extends PartialType(CreateVillageHousingDto) {}


