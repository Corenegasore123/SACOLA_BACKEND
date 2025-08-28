import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, DeepPartial } from 'typeorm';
import { OtherProject } from '../entities/other-project.entity';
import { CreateOtherProjectDto } from '../dto/create-other-project.dto';
import { UpdateOtherProjectDto } from '../dto/update-other-project.dto';

@Injectable()
export class OtherProjectsService {
  constructor(
    @InjectRepository(OtherProject)
    private readonly repo: Repository<OtherProject>,
  ) {}

  async create(dto: CreateOtherProjectDto): Promise<OtherProject> {
    const entity = this.repo.create(dto as DeepPartial<OtherProject>);
    return this.repo.save(entity);
  }

  findAll(category?: string): Promise<OtherProject[]> {
    const where: FindOptionsWhere<OtherProject> | undefined = category ? { category } : undefined;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<OtherProject> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Other project not found');
    return entity;
  }

  async update(id: string, dto: UpdateOtherProjectDto): Promise<OtherProject> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}


