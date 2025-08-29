import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreePlanting } from '../conservation/entities/tree-planting.entity';
import { WaterTank } from '../conservation/entities/water-tank.entity';
import { EUFundedProject } from '../conservation/entities/eu-funded-project.entity';
import { BambooPlantation } from '../conservation/entities/bamboo-plantation.entity';
import { BuffaloWall } from '../conservation/entities/buffalo-wall.entity';
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

type Category = 'conservation' | 'socio-economic';

interface AnalyticsParams {
  category: Category;
  project: string;
  year: number;
  month?: number; // 1-12
}

@Injectable()
export class AnalyticsService {
  constructor(
    // Conservation repos
    @InjectRepository(TreePlanting)
    private readonly treeRepo: Repository<TreePlanting>,
    @InjectRepository(WaterTank)
    private readonly tankRepo: Repository<WaterTank>,
    @InjectRepository(EUFundedProject)
    private readonly euRepo: Repository<EUFundedProject>,
    @InjectRepository(BambooPlantation)
    private readonly bambooRepo: Repository<BambooPlantation>,
    @InjectRepository(BuffaloWall)
    private readonly wallRepo: Repository<BuffaloWall>,
    // Socio-economic repos
    @InjectRepository(LivestockEntryData)
    private readonly livestockRepo: Repository<LivestockEntryData>,
    @InjectRepository(HousingMaterialsEntryData)
    private readonly housingMaterialsRepo: Repository<HousingMaterialsEntryData>,
    @InjectRepository(HousingToiletsEntryData)
    private readonly housingToiletsRepo: Repository<HousingToiletsEntryData>,
    @InjectRepository(ITTrainingEntryData)
    private readonly itTrainingRepo: Repository<ITTrainingEntryData>,
    @InjectRepository(ParkingEntryData)
    private readonly parkingRepo: Repository<ParkingEntryData>,
    @InjectRepository(HousingHousesEntryData)
    private readonly housingHousesRepo: Repository<HousingHousesEntryData>,
    @InjectRepository(HousingVillagesEntryData)
    private readonly housingVillagesRepo: Repository<HousingVillagesEntryData>,
    @InjectRepository(HousingRepairmentsEntryData)
    private readonly housingRepairsRepo: Repository<HousingRepairmentsEntryData>,
    @InjectRepository(EmpowermentTailoringEntryData)
    private readonly empTailorRepo: Repository<EmpowermentTailoringEntryData>,
    @InjectRepository(EmpowermentMicroFinanceEntryData)
    private readonly empMicroRepo: Repository<EmpowermentMicroFinanceEntryData>,
    @InjectRepository(EducationMaterialsEntryData)
    private readonly eduMaterialsRepo: Repository<EducationMaterialsEntryData>,
    @InjectRepository(EducationInfrastructuresEntryData)
    private readonly eduInfraRepo: Repository<EducationInfrastructuresEntryData>,
    @InjectRepository(EducationStudentsEntryData)
    private readonly eduStudentsRepo: Repository<EducationStudentsEntryData>,
    @InjectRepository(HealthCentresEntryData)
    private readonly healthRepo: Repository<HealthCentresEntryData>,
    @InjectRepository(SportsEntryData)
    private readonly sportsRepo: Repository<SportsEntryData>,
    @InjectRepository(WaterPumpsEntryData)
    private readonly waterPumpsRepo: Repository<WaterPumpsEntryData>,
    @InjectRepository(OfficesEntryData)
    private readonly officesRepo: Repository<OfficesEntryData>,
    @InjectRepository(WorkersEntryData)
    private readonly workersRepo: Repository<WorkersEntryData>,
  ) {}

  async getAnalytics(params: AnalyticsParams) {
    const { category, project, year, month } = params;
    const mappings = this.getMappings();
    const key = `${category}:${project}`;
    const mapping = mappings[key];
    if (!mapping) {
      throw new BadRequestException('Unsupported category/project');
    }

    // Build period filter
    const yearStr = String(year).padStart(4, '0');
    const monthStr = month ? String(month).padStart(2, '0') : undefined;

    // Query for the requested period (year or specific month)
    const periodQb = mapping.repo.createQueryBuilder('e');
    if (monthStr) {
      periodQb.where(`substring(e.${mapping.dateColumn} from 1 for 7) = :ym`, {
        ym: `${yearStr}-${monthStr}`,
      });
    } else {
      periodQb.where(`substring(e.${mapping.dateColumn} from 1 for 4) = :y`, {
        y: yearStr,
      });
    }
    const rows = await periodQb.getMany();

    // Always compute monthly breakdown from the entire year's data
    const yearQb = mapping.repo
      .createQueryBuilder('e')
      .where(`substring(e.${mapping.dateColumn} from 1 for 4) = :y`, {
        y: yearStr,
      });
    const yearRows = await yearQb.getMany();

    // Aggregate metrics defined for this mapping
    const totals: Record<string, number> = {};
    for (const metric of mapping.metrics) totals[metric] = 0;

    for (const row of rows as any[]) {
      for (const metric of mapping.metrics) {
        const value = Number(row[metric] ?? 0);
        if (!Number.isNaN(value)) totals[metric] += value;
      }
    }

    // Monthly breakdown for the year (1..12), independent of selected month
    const monthly: Array<{ month: number; [k: string]: number }> = [];
    for (let m = 1; m <= 12; m++) {
      const mm = String(m).padStart(2, '0');
      const perMonthRows = yearRows.filter((r: any) =>
        String(r[mapping.dateColumn]).startsWith(`${yearStr}-${mm}`),
      );
      const monthTotals: Record<string, number> = {};
      for (const metric of mapping.metrics) monthTotals[metric] = 0;
      for (const r of perMonthRows as any[]) {
        for (const metric of mapping.metrics) {
          const value = Number(r[metric] ?? 0);
          if (!Number.isNaN(value)) monthTotals[metric] += value;
        }
      }
      monthly.push({ month: m, ...monthTotals });
    }

    // Compute totals for beneficiaries and pie chart parts when applicable
    const hasCurrent = mapping.metrics.includes('currentBeneficiaries');
    const hasTarget = mapping.metrics.includes('targetBeneficiaries');

    // Total beneficiaries across the requested period (year or month)
    const totalBeneficiaries = hasCurrent
      ? rows.reduce(
          (sum: number, r: any) => sum + Number(r.currentBeneficiaries || 0),
          0,
        )
      : null;

    // Selected month current and target
    let pie: {
      current: number;
      target: number;
      remaining: number;
      percentCurrent?: number;
      percentRemaining?: number;
      exceeded?: boolean;
    } | null = null;
    let pieAlt: { slices: Array<{ label: string; value: number }> } | null =
      null;
    if (typeof month !== 'undefined' && hasCurrent && hasTarget) {
      const mm = String(month).padStart(2, '0');
      const monthRows = yearRows.filter((r: any) =>
        String(r[mapping.dateColumn]).startsWith(`${yearStr}-${mm}`),
      );
      const monthCurrent = monthRows.reduce(
        (sum: number, r: any) => sum + Number(r.currentBeneficiaries || 0),
        0,
      );
      const monthTarget = monthRows.reduce(
        (sum: number, r: any) => sum + Number(r.targetBeneficiaries || 0),
        0,
      );
      const remaining = Math.max(0, monthTarget - monthCurrent);
      const rawPercent =
        monthTarget > 0 ? (monthCurrent / monthTarget) * 100 : 0;
      const exceeded = rawPercent > 100;
      const percentCurrent = exceeded ? 100 : Math.max(0, rawPercent);
      const percentRemaining = exceeded ? 0 : Math.max(0, 100 - percentCurrent);
      pie = {
        current: monthCurrent,
        target: monthTarget,
        remaining,
        percentCurrent,
        percentRemaining,
        exceeded,
      };
    }

    // Alternative pies for non-beneficiary entities
    const projectKey = `${category}:${project}`;
    if (projectKey === 'socio-economic:housing-villages') {
      const scopeRows =
        typeof month !== 'undefined'
          ? yearRows.filter((r: any) =>
              String(r[mapping.dateColumn]).startsWith(
                `${yearStr}-${String(month).padStart(2, '0')}`,
              ),
            )
          : yearRows;
      const good = scopeRows.reduce(
        (sum: number, r: any) => sum + Number(r.goodCondition || 0),
        0,
      );
      const bad = scopeRows.reduce(
        (sum: number, r: any) => sum + Number(r.badCondition || 0),
        0,
      );
      pieAlt = {
        slices: [
          { label: 'Good', value: good },
          { label: 'Bad', value: bad },
        ],
      };
    }

    // Chart hints (parking: no charts)
    const chartHints =
      projectKey === 'socio-economic:parking'
        ? { showPie: false, showBar: false }
        : { showPie: Boolean(pie || pieAlt), showBar: true };
    if (projectKey === 'socio-economic:parking') {
      pie = null;
      pieAlt = null;
    }

    return {
      category,
      project,
      year,
      month: month ?? null,
      totals,
      monthly,
      totalBeneficiaries,
      pie,
      pieAlt,
      chartHints,
    };
  }

  private getMappings(): Record<
    string,
    {
      repo: Repository<any>;
      dateColumn: string; // string date column name in entity
      metrics: string[]; // numeric columns to sum
    }
  > {
    return {
      // Conservation
      'conservation:tree-planting': {
        repo: this.treeRepo,
        dateColumn: 'datePlanted',
        metrics: [
          'numberOfTrees',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'conservation:water-tanks': {
        repo: this.tankRepo,
        dateColumn: 'dateDonated',
        metrics: [
          'numberOfTanks',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'conservation:eu-funded-project': {
        repo: this.euRepo,
        dateColumn: 'datePlanted',
        metrics: [
          'numberOfTrees',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'conservation:bamboo': {
        repo: this.bambooRepo,
        dateColumn: 'datePlanted',
        metrics: ['distanceCovered'],
      },
      'conservation:buffalo-wall': {
        repo: this.wallRepo,
        dateColumn: 'dateRepaired',
        metrics: ['cost'],
      },

      // Socio-economic
      'socio-economic:livestock': {
        repo: this.livestockRepo,
        dateColumn: 'dateDonated',
        metrics: [
          'distributedAnimals',
          'born',
          'deaths',
          'soldAnimals',
          'transferredAnimals',
          'currentlyOwned',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'socio-economic:housing-materials': {
        repo: this.housingMaterialsRepo,
        dateColumn: 'dateDonated',
        metrics: [
          'distributedMaterials',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'socio-economic:housing-toilets': {
        repo: this.housingToiletsRepo,
        dateColumn: 'dateDonated',
        metrics: [
          'toiletsBuilt',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'socio-economic:housing-houses': {
        repo: this.housingHousesRepo,
        dateColumn: 'dateBuilt',
        metrics: [],
      },
      'socio-economic:housing-villages': {
        repo: this.housingVillagesRepo,
        dateColumn: 'dateBuilt',
        metrics: ['totalHouses', 'goodCondition', 'badCondition'],
      },
      'socio-economic:housing-repairs': {
        repo: this.housingRepairsRepo,
        dateColumn: 'dateRepaired',
        metrics: [],
      },
      'socio-economic:it-centre': {
        repo: this.itTrainingRepo,
        dateColumn: 'date',
        metrics: ['numPeople', 'trainingDuration'],
      },
      'socio-economic:empowerment-tailoring': {
        repo: this.empTailorRepo,
        dateColumn: 'date',
        metrics: ['people', 'trainingDuration'],
      },
      'socio-economic:empowerment-microfinances': {
        repo: this.empMicroRepo,
        dateColumn: 'createdAt',
        metrics: [],
      },
      'socio-economic:education-materials': {
        repo: this.eduMaterialsRepo,
        dateColumn: 'dateDonated',
        metrics: [
          'distributedMaterials',
          'targetBeneficiaries',
          'currentBeneficiaries',
        ],
      },
      'socio-economic:education-infrastructure': {
        repo: this.eduInfraRepo,
        dateColumn: 'dateDonated',
        metrics: [],
      },
      'socio-economic:education-students': {
        repo: this.eduStudentsRepo,
        dateColumn: 'date',
        metrics: ['fundingYears'],
      },
      'socio-economic:parking': {
        repo: this.parkingRepo,
        dateColumn: 'dateBuilt',
        metrics: ['carsSupported'],
      },
      'socio-economic:health-centers': {
        repo: this.healthRepo,
        dateColumn: 'dateBuilt',
        metrics: [],
      },
      'socio-economic:sports': {
        repo: this.sportsRepo,
        dateColumn: 'dateBuilt',
        metrics: [],
      },
      'socio-economic:water-pumps': {
        repo: this.waterPumpsRepo,
        dateColumn: 'dateBuilt',
        metrics: [],
      },
      'socio-economic:offices': {
        repo: this.officesRepo,
        dateColumn: 'dateBuilt',
        metrics: [],
      },
      'socio-economic:workers': {
        repo: this.workersRepo,
        dateColumn: 'dateEmployed',
        metrics: [],
      },
    };
  }
}
