import { PartialType } from '@nestjs/swagger';
import { CreateEmpowermentMicroFinanceDto } from './create-empowerment-microfinance.dto';

export class UpdateEmpowermentMicroFinanceDto extends PartialType(CreateEmpowermentMicroFinanceDto) {}


