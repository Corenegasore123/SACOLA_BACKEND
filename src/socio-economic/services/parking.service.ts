import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ParkingEntryData } from '../entities/parking.entity';
import { CreateParkingDto } from '../dto/create-parking.dto';
import { UpdateParkingDto } from '../dto/update-parking.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingEntryData)
    private readonly repo: Repository<ParkingEntryData>,
  ) {}

  async create(dto: CreateParkingDto): Promise<ParkingEntryData> {
    const entity = this.repo.create(dto as DeepPartial<ParkingEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<ParkingEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ParkingEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Parking entry not found');
    return entity;
  }

  async update(id: string, dto: UpdateParkingDto): Promise<ParkingEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
