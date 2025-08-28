import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HousingVillagesEntryData } from '../entities/village-housing.entity';
import { CreateVillageHousingDto } from '../dto/create-village-housing.dto';
import { UpdateVillageHousingDto } from '../dto/update-village-housing.dto';

@Injectable()
export class HousingVillagesService {
  constructor(
    @InjectRepository(HousingVillagesEntryData)
    private readonly repo: Repository<HousingVillagesEntryData>,
  ) {}

  async create(dto: CreateVillageHousingDto): Promise<HousingVillagesEntryData> {
    const entity = this.repo.create(dto as DeepPartial<HousingVillagesEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<HousingVillagesEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HousingVillagesEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Village housing not found');
    return entity;
  }

  async update(id: string, dto: UpdateVillageHousingDto): Promise<HousingVillagesEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


