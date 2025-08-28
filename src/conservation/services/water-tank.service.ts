import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DeepPartial } from 'typeorm';
import { WaterTank } from '../entities/water-tank.entity';
import { CreateWaterTankDto } from '../dto/create-water-tank.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class WaterTankService {
  constructor(
    @InjectRepository(WaterTank)
    private readonly waterTankRepository: Repository<WaterTank>,
  ) {}

  async create(createWaterTankDto: CreateWaterTankDto): Promise<WaterTank> {
    const partial = createWaterTankDto as unknown as DeepPartial<WaterTank>;
    const waterTank: WaterTank = this.waterTankRepository.create(partial);
    return this.waterTankRepository.save(waterTank as WaterTank);
  }

  async findAll(query: Partial<PaginationDto<WaterTank>>): Promise<PaginationDto<WaterTank>> {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      startDate, 
      endDate 
    } = query as any;
    
    const skip = (page - 1) * limit;
    const where: any = {};

    if (location) where.location = location;
    if (startDate && endDate) {
      where.dateDonated = Between(startDate, endDate);
    }

    const [items, total] = await this.waterTankRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { dateDonated: 'DESC' },
    });

    return new PaginationDto({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string): Promise<WaterTank> {
    const waterTank = await this.waterTankRepository.findOne({ 
      where: { id }
    });
    
    if (!waterTank) {
      throw new NotFoundException(`Water tank with ID ${id} not found`);
    }
    
    return waterTank;
  }

  async update(
    id: string,
    updateWaterTankDto: Partial<CreateWaterTankDto>,
  ): Promise<WaterTank> {
    const waterTank = await this.findOne(id);
    Object.assign(waterTank, updateWaterTankDto);
    return this.waterTankRepository.save(waterTank);
  }

  async remove(id: string): Promise<void> {
    const result = await this.waterTankRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Water tank with ID ${id} not found`);
    }
  }

  async getStatistics() {
    const totalTanks = await this.waterTankRepository
      .createQueryBuilder('tank')
      .select('SUM(numberOfTanks)', 'totalTanks')
      .getRawOne();
    
    const totalBeneficiaries = await this.waterTankRepository
      .createQueryBuilder('tank')
      .select('SUM(currentBeneficiaries)', 'totalBeneficiaries')
      .getRawOne();
    
    return {
      totalTanks: parseInt(totalTanks.totalTanks) || 0,
      totalBeneficiaries: parseInt(totalBeneficiaries.totalBeneficiaries) || 0,
    };
  }
}
