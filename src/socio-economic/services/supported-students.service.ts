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

  async create(
    dto: CreateSupportedStudentDto,
  ): Promise<EducationStudentsEntryData> {
    const entity = this.repo.create(
      dto as DeepPartial<EducationStudentsEntryData>,
    );
    return this.repo.save(entity);
  }

  findAll(): Promise<EducationStudentsEntryData[]> {
    return this.repo.find({
      where: { isArchived: false },
      order: { createdAt: 'DESC' },
    });
  }

  findAllArchived(): Promise<EducationStudentsEntryData[]> {
    return this.repo.find({
      where: { isArchived: true },
      order: { archivedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EducationStudentsEntryData> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Supported student not found');
    return entity;
  }

  async update(
    id: string,
    dto: UpdateSupportedStudentDto,
  ): Promise<EducationStudentsEntryData> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<EducationStudentsEntryData> {
    const entity = await this.findOne(id);
    entity.isArchived = true;
    entity.archivedAt = new Date();
    return this.repo.save(entity);
  }

  async unarchive(id: string): Promise<EducationStudentsEntryData> {
    const entity = await this.findOne(id);
    entity.isArchived = false;
    entity.archivedAt = null;
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
  }
}
