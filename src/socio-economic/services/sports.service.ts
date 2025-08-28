import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { SportsEntryData } from '../entities/sports-infrastructure.entity';
import { CreateSportsDto } from '../dto/create-sports.dto';
import { UpdateSportsDto } from '../dto/update-sports.dto';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(SportsEntryData)
    private readonly repo: Repository<SportsEntryData>,
  ) {}

  async create(dto: CreateSportsDto): Promise<SportsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<SportsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<SportsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SportsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Sports infrastructure not found');
    return entity;
  }

  async update(id: string, dto: UpdateSportsDto): Promise<SportsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


