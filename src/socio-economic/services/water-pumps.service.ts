import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { WaterPumpsEntryData } from '../entities/water-pumps.entity';
import { CreateWaterPumpsDto } from '../dto/create-water-pumps.dto';
import { UpdateWaterPumpsDto } from '../dto/update-water-pumps.dto';

@Injectable()
export class WaterPumpsService {
  constructor(
    @InjectRepository(WaterPumpsEntryData)
    private readonly repo: Repository<WaterPumpsEntryData>,
  ) {}

  async create(dto: CreateWaterPumpsDto): Promise<WaterPumpsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<WaterPumpsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<WaterPumpsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<WaterPumpsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Water pump not found');
    return entity;
  }

  async update(
    id: string,
    dto: UpdateWaterPumpsDto,
  ): Promise<WaterPumpsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
