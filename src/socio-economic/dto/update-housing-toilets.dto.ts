import { PartialType } from '@nestjs/swagger';
import { CreateHousingToiletsDto } from './create-housing-toilets.dto';

export class UpdateHousingToiletsDto extends PartialType(CreateHousingToiletsDto) {}


