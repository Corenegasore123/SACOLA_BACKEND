import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { EducationMaterialsEntryData } from '../entities/education-materials.entity';
import { CreateEducationMaterialsDto } from '../dto/create-education-materials.dto';
import { UpdateEducationMaterialsDto } from '../dto/update-education-materials.dto';

@Injectable()
export class EducationMaterialsService {
  constructor(
    @InjectRepository(EducationMaterialsEntryData)
    private readonly repo: Repository<EducationMaterialsEntryData>,
  ) {}

  async create(dto: CreateEducationMaterialsDto): Promise<EducationMaterialsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<EducationMaterialsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<EducationMaterialsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<EducationMaterialsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Education material not found');
    return entity;
  }

  async update(id: string, dto: UpdateEducationMaterialsDto): Promise<EducationMaterialsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


