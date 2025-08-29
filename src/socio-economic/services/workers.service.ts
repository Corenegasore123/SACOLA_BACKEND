import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { WorkersEntryData } from '../entities/workers.entity';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(WorkersEntryData)
    private readonly repo: Repository<WorkersEntryData>,
  ) {}

  async create(dto: CreateWorkerDto): Promise<WorkersEntryData> {
    const entity = this.repo.create(dto as DeepPartial<WorkersEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<WorkersEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<WorkersEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Worker not found');
    return entity;
  }

  async update(id: string, dto: UpdateWorkerDto): Promise<WorkersEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


