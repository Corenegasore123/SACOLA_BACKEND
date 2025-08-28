import { PartialType } from '@nestjs/swagger';
import { CreateWaterPumpsDto } from './create-water-pumps.dto';

export class UpdateWaterPumpsDto extends PartialType(CreateWaterPumpsDto) {}


