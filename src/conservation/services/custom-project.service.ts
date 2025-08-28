import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CustomProject } from '../entities/custom-project.entity';
import { CustomProjectEntry } from '../entities/custom-project-entry.entity';
import { CreateCustomProjectDto } from '../dto/create-custom-project.dto';
import { CreateProjectEntryDto } from '../dto/create-project-entry.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class CustomProjectService {
  constructor(
    @InjectRepository(CustomProject)
    private customProjectRepository: Repository<CustomProject>,
    @InjectRepository(CustomProjectEntry)
    private projectEntryRepository: Repository<CustomProjectEntry>,
  ) {}

  async createProject(createCustomProjectDto: CreateCustomProjectDto): Promise<CustomProject> {
    const { entries, ...projectData } = createCustomProjectDto;
    
    const project = this.customProjectRepository.create(projectData);
    const savedProject = await this.customProjectRepository.save(project);

    // Create entries if provided
    if (entries && entries.length > 0) {
      const projectEntries = entries.map(entry => 
        this.projectEntryRepository.create({
          ...entry,
          projectId: savedProject.id,
        })
      );
      await this.projectEntryRepository.save(projectEntries);
    }

    return this.getProjectById(savedProject.id);
  }

  async getProjects(query: Partial<PaginationDto<CustomProject>>): Promise<PaginationDto<CustomProject>> {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      startDate, 
      endDate 
    } = query;
    
    const skip = (page - 1) * limit;
    const where: any = {};

    if (location) where.location = location;
    if (startDate && endDate) {
      where.startingDate = Between(new Date(startDate), new Date(endDate));
    }

    const [items, total] = await this.customProjectRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { startingDate: 'DESC' },
      relations: ['entries'],
    });

    return new PaginationDto({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async getProjectById(id: string): Promise<CustomProject> {
    const project = await this.customProjectRepository.findOne({ 
      where: { id },
      relations: ['entries']
    });
    
    if (!project) {
      throw new NotFoundException(`Custom project with ID ${id} not found`);
    }
    
    return project;
  }

  async updateProject(
    id: string,
    updateProjectDto: Partial<CreateCustomProjectDto>,
  ): Promise<CustomProject> {
    const project = await this.getProjectById(id);
    Object.assign(project, updateProjectDto);
    return this.customProjectRepository.save(project);
  }

  async deleteProject(id: string): Promise<void> {
    await this.getProjectById(id);
    await this.customProjectRepository.delete(id);
  }

  async addEntry(projectId: string, createEntryDto: CreateProjectEntryDto): Promise<CustomProjectEntry> {
    await this.getProjectById(projectId); // Verify project exists
    
    const entry = this.projectEntryRepository.create({
      ...createEntryDto,
      projectId,
    });
    
    return this.projectEntryRepository.save(entry);
  }

  async updateEntry(
    projectId: string,
    entryId: string,
    updateEntryDto: Partial<CreateProjectEntryDto>,
  ): Promise<CustomProjectEntry> {
    await this.getProjectById(projectId); // Verify project exists
    
    const entry = await this.projectEntryRepository.findOne({
      where: { id: entryId, projectId }
    });
    
    if (!entry) {
      throw new NotFoundException(`Project entry with ID ${entryId} not found`);
    }
    
    Object.assign(entry, updateEntryDto);
    return this.projectEntryRepository.save(entry);
  }

  async deleteEntry(projectId: string, entryId: string): Promise<void> {
    await this.getProjectById(projectId); // Verify project exists
    
    const result = await this.projectEntryRepository.delete({
      id: entryId,
      projectId
    });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Project entry with ID ${entryId} not found`);
    }
  }

  async getStatistics() {
    const totalProjects = await this.customProjectRepository.count();
    
    const totalEntries = await this.projectEntryRepository
      .createQueryBuilder('entry')
      .select('SUM(entry.number)', 'totalEntries')
      .getRawOne();
    
    return {
      totalProjects,
      totalEntries: parseInt(totalEntries.totalEntries) || 0,
    };
  }
}

