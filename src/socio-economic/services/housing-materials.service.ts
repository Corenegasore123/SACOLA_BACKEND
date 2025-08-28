import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HousingMaterialsEntryData } from '../entities/housing-materials.entity';
import { CreateHousingMaterialsDto } from '../dto/create-housing-materials.dto';
import { UpdateHousingMaterialsDto } from '../dto/update-housing-materials.dto';

@Injectable()
export class HousingMaterialsService {
  constructor(
    @InjectRepository(HousingMaterialsEntryData)
    private readonly repo: Repository<HousingMaterialsEntryData>,
  ) {}

  async create(dto: CreateHousingMaterialsDto): Promise<HousingMaterialsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<HousingMaterialsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<HousingMaterialsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HousingMaterialsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Housing material not found');
    return entity;
  }

  async update(id: string, dto: UpdateHousingMaterialsDto): Promise<HousingMaterialsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


