import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
// Conservation entities
import { TreePlanting } from '../conservation/entities/tree-planting.entity';
import { WaterTank } from '../conservation/entities/water-tank.entity';
import { EUFundedProject } from '../conservation/entities/eu-funded-project.entity';
import { BambooPlantation } from '../conservation/entities/bamboo-plantation.entity';
import { BuffaloWall } from '../conservation/entities/buffalo-wall.entity';
// Socio-economic entities
import { LivestockEntryData } from '../socio-economic/entities/livestock.entity';
import { HousingMaterialsEntryData } from '../socio-economic/entities/housing-materials.entity';
import { HousingToiletsEntryData } from '../socio-economic/entities/housing-toilets.entity';
import { ITTrainingEntryData } from '../socio-economic/entities/it-training-center.entity';
import { ParkingEntryData } from '../socio-economic/entities/parking.entity';
import { HousingHousesEntryData } from '../socio-economic/entities/house.entity';
import { HousingVillagesEntryData } from '../socio-economic/entities/village-housing.entity';
import { HousingRepairmentsEntryData } from '../socio-economic/entities/house-repair.entity';
import { EmpowermentTailoringEntryData } from '../socio-economic/entities/empowerment-project.entity';
import { EmpowermentMicroFinanceEntryData } from '../socio-economic/entities/empowerment-microfinance.entity';
import { EducationMaterialsEntryData } from '../socio-economic/entities/education-materials.entity';
import { EducationInfrastructuresEntryData } from '../socio-economic/entities/education-infrastructure.entity';
import { EducationStudentsEntryData } from '../socio-economic/entities/supported-student.entity';
import { HealthCentresEntryData } from '../socio-economic/entities/health-center.entity';
import { SportsEntryData } from '../socio-economic/entities/sports-infrastructure.entity';
import { WaterPumpsEntryData } from '../socio-economic/entities/water-pumps.entity';
import { OfficesEntryData } from '../socio-economic/entities/office.entity';
import { WorkersEntryData } from '../socio-economic/entities/workers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Conservation
      TreePlanting,
      WaterTank,
      EUFundedProject,
      BambooPlantation,
      BuffaloWall,
      // Socio-economic
      LivestockEntryData,
      HousingMaterialsEntryData,
      HousingToiletsEntryData,
      ITTrainingEntryData,
      ParkingEntryData,
      HousingHousesEntryData,
      HousingVillagesEntryData,
      HousingRepairmentsEntryData,
      EmpowermentTailoringEntryData,
      EmpowermentMicroFinanceEntryData,
      EducationMaterialsEntryData,
      EducationInfrastructuresEntryData,
      EducationStudentsEntryData,
      HealthCentresEntryData,
      SportsEntryData,
      WaterPumpsEntryData,
      OfficesEntryData,
      WorkersEntryData,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
