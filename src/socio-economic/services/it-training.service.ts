import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ITTrainingEntryData } from '../entities/it-training-center.entity';
import { CreateITTrainingDto } from '../dto/create-it-training.dto';
import { UpdateITTrainingDto } from '../dto/update-it-training.dto';

@Injectable()
export class ITTrainingService {
  constructor(
    @InjectRepository(ITTrainingEntryData)
    private readonly repo: Repository<ITTrainingEntryData>,
  ) {}

  async create(dto: CreateITTrainingDto): Promise<ITTrainingEntryData> {
    const entity = this.repo.create(dto as DeepPartial<ITTrainingEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<ITTrainingEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ITTrainingEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('IT training center not found');
    return entity;
  }

  async update(id: string, dto: UpdateITTrainingDto): Promise<ITTrainingEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


