import { PartialType } from '@nestjs/swagger';
import { CreateHouseRepairDto } from './create-house-repair.dto';

export class UpdateHouseRepairDto extends PartialType(CreateHouseRepairDto) {}


