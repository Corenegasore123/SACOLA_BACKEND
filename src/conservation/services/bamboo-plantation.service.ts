 import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { BambooPlantation } from '../entities/bamboo-plantation.entity';
import { CreateBambooPlantationDto } from '../dto/create-bamboo-plantation.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class BambooPlantationService {
  constructor(
    @InjectRepository(BambooPlantation)
    private readonly bambooPlantationRepository: Repository<BambooPlantation>,
  ) {}

  async create(createBambooPlantationDto: CreateBambooPlantationDto): Promise<BambooPlantation> {
    const partial = createBambooPlantationDto as unknown as DeepPartial<BambooPlantation>;
    const bambooPlantation: BambooPlantation = this.bambooPlantationRepository.create(partial);
    return this.bambooPlantationRepository.save(bambooPlantation);
  }

  async findAll(paginationDto: PaginationDto<BambooPlantation>) {
    const { page = 1, limit = 10, sortBy, sortOrder = 'DESC', ...filters } = paginationDto;
    
    const where: any = {};
    
    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          where[key] = value;
        }
      });
    }

    const [items, total] = await this.bambooPlantationRepository.findAndCount({
      where,
      order: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BambooPlantation> {
    const bambooPlantation = await this.bambooPlantationRepository.findOne({ 
      where: { id },
    });
    
    if (!bambooPlantation) {
      throw new NotFoundException(`Bamboo plantation with ID ${id} not found`);
    }
    
    return bambooPlantation;
  }

  async update(
    id: string,
    updateBambooPlantationDto: Partial<CreateBambooPlantationDto>,
  ): Promise<BambooPlantation> {
    const bambooPlantation = await this.findOne(id);
    Object.assign(bambooPlantation, updateBambooPlantationDto);
    return this.bambooPlantationRepository.save(bambooPlantation);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.bambooPlantationRepository.delete(id);
  }

  async getStatistics(): Promise<any> {
    const [total, totalDistance] = await Promise.all([
      this.bambooPlantationRepository.count(),
      this.bambooPlantationRepository
        .createQueryBuilder('bambooPlantation')
        .select('SUM(distanceCovered)', 'totalDistance')
        .getRawOne(),
    ]);

    return {
      totalProjects: total,
      totalDistanceCovered: totalDistance.totalDistance || 0,
    };
  }
}
