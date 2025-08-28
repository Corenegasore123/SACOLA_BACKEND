import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { LivestockEntryData } from '../entities/livestock.entity';
import { CreateLivestockDto } from '../dto/create-livestock.dto';
import { UpdateLivestockDto } from '../dto/update-livestock.dto';

@Injectable()
export class LivestockService {
  constructor(
    @InjectRepository(LivestockEntryData)
    private readonly repo: Repository<LivestockEntryData>,
  ) {}

  async create(dto: CreateLivestockDto): Promise<LivestockEntryData> {
    const entity = this.repo.create(dto as DeepPartial<LivestockEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<LivestockEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<LivestockEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Livestock not found');
    return entity;
  }

  async update(id: string, dto: UpdateLivestockDto): Promise<LivestockEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


