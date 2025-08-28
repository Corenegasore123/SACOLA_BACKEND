import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HousingRepairmentsEntryData } from '../entities/house-repair.entity';
import { CreateHouseRepairDto } from '../dto/create-house-repair.dto';
import { UpdateHouseRepairDto } from '../dto/update-house-repair.dto';

@Injectable()
export class HousingRepairsService {
  constructor(
    @InjectRepository(HousingRepairmentsEntryData)
    private readonly repo: Repository<HousingRepairmentsEntryData>,
  ) {}

  async create(dto: CreateHouseRepairDto): Promise<HousingRepairmentsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<HousingRepairmentsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<HousingRepairmentsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HousingRepairmentsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('House repair not found');
    return entity;
  }

  async update(id: string, dto: UpdateHouseRepairDto): Promise<HousingRepairmentsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


