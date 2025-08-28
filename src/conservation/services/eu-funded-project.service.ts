import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { EUFundedProject } from '../entities/eu-funded-project.entity';
import { CreateEUFundedProjectDto } from '../dto/create-eu-funded-project.dto';
import { UpdateEUFundedProjectDto } from '../dto/update-eu-project.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class EUFundedProjectService {
  constructor(
    @InjectRepository(EUFundedProject)
    private readonly euFundedProjectRepository: Repository<EUFundedProject>,
  ) {}

  async create(createEUFundedProjectDto: CreateEUFundedProjectDto): Promise<EUFundedProject> {
    const partial = createEUFundedProjectDto as unknown as DeepPartial<EUFundedProject>;
    const euFundedProject = this.euFundedProjectRepository.create(partial) as EUFundedProject;
    return this.euFundedProjectRepository.save(euFundedProject as EUFundedProject);
  }

  async findAll(paginationDto: PaginationDto<EUFundedProject>) {
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

    const [items, total] = await this.euFundedProjectRepository.findAndCount({
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

  async findOne(id: string): Promise<EUFundedProject> {
    const euFundedProject = await this.euFundedProjectRepository.findOne({ 
      where: { id },
    });
    
    if (!euFundedProject) {
      throw new NotFoundException(`EU funded project with ID ${id} not found`);
    }
    
    return euFundedProject;
  }

  async update(
    id: string,
    updateEUFundedProjectDto: UpdateEUFundedProjectDto,
  ): Promise<EUFundedProject> {
    const euFundedProject = await this.findOne(id);
    Object.assign(euFundedProject, updateEUFundedProjectDto);
    return this.euFundedProjectRepository.save(euFundedProject);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.euFundedProjectRepository.delete(id);
  }

  async getStatistics(): Promise<any> {
    const [total, totalTrees, totalBeneficiaries] = await Promise.all([
      this.euFundedProjectRepository.count(),
      this.euFundedProjectRepository.sum('numberOfTrees'),
      this.euFundedProjectRepository.sum('currentBeneficiaries'),
    ]);

    return {
      totalProjects: total,
      totalTreesPlanted: totalTrees || 0,
      totalBeneficiaries: totalBeneficiaries || 0,
    };
  }
}
