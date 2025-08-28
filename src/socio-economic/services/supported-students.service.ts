import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { EducationStudentsEntryData } from '../entities/supported-student.entity';
import { CreateSupportedStudentDto } from '../dto/create-supported-student.dto';
import { UpdateSupportedStudentDto } from '../dto/update-supported-student.dto';

@Injectable()
export class EducationStudentsService {
  constructor(
    @InjectRepository(EducationStudentsEntryData)
    private readonly repo: Repository<EducationStudentsEntryData>,
  ) {}

  async create(dto: CreateSupportedStudentDto): Promise<EducationStudentsEntryData> {
    const entity = this.repo.create(dto as DeepPartial<EducationStudentsEntryData>);
    return this.repo.save(entity);
  }

  findAll(): Promise<EducationStudentsEntryData[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<EducationStudentsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Supported student not found');
    return entity;
  }

  async update(id: string, dto: UpdateSupportedStudentDto): Promise<EducationStudentsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


