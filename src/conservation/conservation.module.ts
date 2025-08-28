import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConservationProject } from './entities/conservation-project.entity';
import { WaterTank } from './entities/water-tank.entity';
import { TreePlanting } from './entities/tree-planting.entity';
import { BambooPlantation } from './entities/bamboo-plantation.entity';
import { BuffaloWall } from './entities/buffalo-wall.entity';
import { EUFundedProject } from './entities/eu-funded-project.entity';
import { CustomProject } from './entities/custom-project.entity';
import { CustomProjectEntry } from './entities/custom-project-entry.entity';
import { ConservationProjectController } from './controllers/conservation-project.controller';
import { WaterTankController } from './controllers/water-tank.controller';
import { TreePlantingController } from './controllers/tree-planting.controller';
import { BambooPlantationController } from './controllers/bamboo-plantation.controller';
import { BuffaloWallController } from './controllers/buffalo-wall.controller';
import { EUFundedProjectController } from './controllers/eu-funded-project.controller';
import { CustomProjectController } from './controllers/custom-project.controller';
import { ConservationProjectService } from './services/conservation-project.service';
import { WaterTankService } from './services/water-tank.service';
import { TreePlantingService } from './services/tree-planting.service';
import { BambooPlantationService } from './services/bamboo-plantation.service';
import { BuffaloWallService } from './services/buffalo-wall.service';
import { EUFundedProjectService } from './services/eu-funded-project.service';
import { CustomProjectService } from './services/custom-project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConservationProject, 
      WaterTank, 
      TreePlanting, 
      BambooPlantation, 
      BuffaloWall, 
      EUFundedProject,
      CustomProject,
      CustomProjectEntry
    ]), 
  ],
  controllers: [
    ConservationProjectController,
    WaterTankController,
    TreePlantingController,
    BambooPlantationController,
    BuffaloWallController,
    EUFundedProjectController,
    CustomProjectController
  ],
  providers: [
    ConservationProjectService, 
    WaterTankService,
    TreePlantingService,
    BambooPlantationService,
    BuffaloWallService,
    EUFundedProjectService,
    CustomProjectService
  ],
  exports: [
    ConservationProjectService, 
    WaterTankService,
    TreePlantingService,
    BambooPlantationService,
    BuffaloWallService,
    EUFundedProjectService,
    CustomProjectService
  ], 
})
export class ConservationModule {}
