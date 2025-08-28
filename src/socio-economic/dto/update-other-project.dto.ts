import { PartialType } from '@nestjs/swagger';
import { CreateOtherProjectDto } from './create-other-project.dto';

export class UpdateOtherProjectDto extends PartialType(CreateOtherProjectDto) {}


