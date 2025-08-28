import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { HousingToiletsEntryData } from '../entities/housing-toilets.entity';
import { CreateHousingToiletsDto } from '../dto/create-housing-toilets.dto';
import { UpdateHousingToiletsDto } from '../dto/update-housing-toilets.dto';

@Injectable()
export class HousingToiletsService {
  constructor(
    @InjectRepository(HousingToiletsEntryData)
    private readonly repo: Repository<HousingToiletsEntryData>,
  ) {}

  async create(dto: CreateHousingToiletsDto): Promise<HousingToiletsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<HousingToiletsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<HousingToiletsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<HousingToiletsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Toilet record not found');
    return entity;
  }

  async update(id: string, dto: UpdateHousingToiletsDto): Promise<HousingToiletsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


