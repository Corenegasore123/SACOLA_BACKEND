import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { OfficesEntryData } from '../entities/office.entity';
import { CreateOfficeDto } from '../dto/create-office.dto';
import { UpdateOfficeDto } from '../dto/update-office.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(OfficesEntryData)
    private readonly repo: Repository<OfficesEntryData>,
  ) {}

  async create(dto: CreateOfficeDto): Promise<OfficesEntryData> {
    const entity = this.repo.create(dto as DeepPartial<OfficesEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<OfficesEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<OfficesEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Office not found');
    return entity;
  }

  async update(id: string, dto: UpdateOfficeDto): Promise<OfficesEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


