import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HousingHousesEntryData } from '../entities/house.entity';
import { CreateHouseDto } from '../dto/create-house.dto';
import { UpdateHouseDto } from '../dto/update-house.dto';

@Injectable()
export class HousingHousesService {
  constructor(
    @InjectRepository(HousingHousesEntryData)
    private readonly repo: Repository<HousingHousesEntryData>,
  ) {}

  async create(dto: CreateHouseDto): Promise<HousingHousesEntryData> {
    const entity = this.repo.create(dto as DeepPartial<HousingHousesEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<HousingHousesEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HousingHousesEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('House not found');
    return entity;
  }

  async update(id: string, dto: UpdateHouseDto): Promise<HousingHousesEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


