import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LivestockEntryData } from './entities/livestock.entity';
import { HousingMaterialsEntryData } from './entities/housing-materials.entity';
import { HousingVillagesEntryData } from './entities/village-housing.entity';
import { HousingHousesEntryData } from './entities/house.entity';
import { HousingRepairmentsEntryData } from './entities/house-repair.entity';
import { EmpowermentTailoringEntryData } from './entities/empowerment-project.entity';
import { EducationMaterialsEntryData } from './entities/education-materials.entity';
import { EducationInfrastructuresEntryData } from './entities/education-infrastructure.entity';
import { EducationStudentsEntryData } from './entities/supported-student.entity';
import { HealthCentresEntryData } from './entities/health-center.entity';
import { OfficesEntryData } from './entities/office.entity';
import { SportsEntryData } from './entities/sports-infrastructure.entity';
import { ITTrainingEntryData } from './entities/it-training-center.entity';
import { OtherProject } from './entities/other-project.entity';
import { EmpowermentMicroFinanceEntryData } from './entities/empowerment-microfinance.entity';
import { HousingToiletsEntryData } from './entities/housing-toilets.entity';
import { ParkingEntryData } from './entities/parking.entity';
import { WaterPumpsEntryData } from './entities/water-pumps.entity';
import { WorkersEntryData } from './entities/workers.entity';

import { LivestockService } from './services/livestock.service';
import { HousingMaterialsService } from './services/housing-materials.service';
import { HousingVillagesService } from './services/village-housing.service';
import { HousingHousesService } from './services/house.service';
import { HousingRepairsService } from './services/house-repair.service';
import { EmpowermentTailoringService } from './services/empowerment.service';
import { EducationMaterialsService } from './services/education-materials.service';
import { EducationInfrastructuresService } from './services/education-infrastructure.service';
import { EducationStudentsService } from './services/supported-students.service';
import { HealthCentresService } from './services/health-center.service';
import { OfficesService } from './services/office.service';
import { SportsService } from './services/sports.service';
import { ITTrainingService } from './services/it-training.service';
import { OtherProjectsService } from './services/other-projects.service';
import { EmpowermentMicroFinanceService } from './services/empowerment-microfinance.service';
import { HousingToiletsService } from './services/housing-toilets.service';
import { ParkingService } from './services/parking.service';
import { WaterPumpsService } from './services/water-pumps.service';
import { WorkersService } from './services/workers.service';

import { LivestockController } from './controllers/livestock.controller';
import { HousingMaterialsController } from './controllers/housing-materials.controller';
import { VillageHousingController } from './controllers/village-housing.controller';
import { HousingHousesController } from './controllers/house.controller';
import { HousingRepairsController } from './controllers/house-repair.controller';
import { EmpowermentTailoringController } from './controllers/empowerment.controller';
import { EducationMaterialsController } from './controllers/education-materials.controller';
import { EducationInfrastructuresController } from './controllers/education-infrastructure.controller';
import { EducationStudentsController } from './controllers/supported-students.controller';
import { HealthCentresController } from './controllers/health-centers.controller';
import { OfficesController } from './controllers/offices.controller';
import { SportsController } from './controllers/sports.controller';
import { ITTrainingController } from './controllers/it-training.controller';
import { OtherProjectsController } from './controllers/other-projects.controller';
import { ParkingController } from './controllers/parking.controller';
import { WaterPumpsController } from './controllers/water-pumps.controller';
import { HousingToiletsController } from './controllers/housing-toilets.controller';
import { EmpowermentMicroFinanceController } from './controllers/empowerment-microfinance.controller';
import { WorkersController } from './controllers/workers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LivestockEntryData,
      HousingMaterialsEntryData,
      HousingVillagesEntryData,
      HousingHousesEntryData,
      HousingRepairmentsEntryData,
      EmpowermentTailoringEntryData,
      EducationMaterialsEntryData,
      EducationInfrastructuresEntryData,
      EducationStudentsEntryData,
      HealthCentresEntryData,
      OfficesEntryData,
      SportsEntryData,
      ITTrainingEntryData,
      OtherProject,
      EmpowermentMicroFinanceEntryData,
      HousingToiletsEntryData,
      ParkingEntryData,
      WaterPumpsEntryData,
      WorkersEntryData,
    ]),
  ],
  controllers: [
    LivestockController,
    HousingMaterialsController,
    VillageHousingController,
    HousingHousesController,
    HousingRepairsController,
    EmpowermentTailoringController,
    EducationMaterialsController,
    EducationInfrastructuresController,
    EducationStudentsController,
    HealthCentresController,
    OfficesController,
    SportsController,
    ITTrainingController,
    OtherProjectsController,
    ParkingController,
    WaterPumpsController,
    HousingToiletsController,
    EmpowermentMicroFinanceController,
    WorkersController,
  ],
  providers: [
    LivestockService,
    HousingMaterialsService,
    HousingVillagesService,
    HousingHousesService,
    HousingRepairsService,
    EmpowermentTailoringService,
    EducationMaterialsService,
    EducationInfrastructuresService,
    EducationStudentsService,
    HealthCentresService,
    OfficesService,
    SportsService,
    ITTrainingService,
    OtherProjectsService,
    EmpowermentMicroFinanceService,
    HousingToiletsService,
    ParkingService,
    WaterPumpsService,
    WorkersService,
  ],
})
export class SocioEconomicModule {}
