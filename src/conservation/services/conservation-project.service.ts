import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ConservationProject } from '../entities/conservation-project.entity';
import { CreateConservationProjectDto } from '../dto/create-conservation-project.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class ConservationProjectService {
  constructor(
    @InjectRepository(ConservationProject)
    private conservationProjectRepository: Repository<ConservationProject>,
  ) {}

  async create(createConservationProjectDto: CreateConservationProjectDto): Promise<ConservationProject> {
    const project = this.conservationProjectRepository.create(createConservationProjectDto);
    return this.conservationProjectRepository.save(project);
  }

  async findAll(query: Partial<PaginationDto<ConservationProject>>): Promise<PaginationDto<ConservationProject>> {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      startDate, 
      endDate, 
      status 
    } = query;
    
    const skip = (page - 1) * limit;
    const where: any = {};

    if (location) where.location = location;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.startDate = Between(new Date(startDate), new Date(endDate));
    }

    const [items, total] = await this.conservationProjectRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return new PaginationDto({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string): Promise<ConservationProject> {
    const project = await this.conservationProjectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Conservation project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateConservationProjectDto: Partial<CreateConservationProjectDto>,
  ): Promise<ConservationProject> {
    const project = await this.findOne(id);
    Object.assign(project, updateConservationProjectDto);
    return this.conservationProjectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.conservationProjectRepository.delete(id);
  }

  async getStatistics() {
    const totalProjects = await this.conservationProjectRepository.count();

    // Let callers filter by status instead of hardcoding values here
    // Optionally, you can add params to this method if needed
    return {
      totalProjects
    };
  }
}
