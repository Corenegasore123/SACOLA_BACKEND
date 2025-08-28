import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DeepPartial } from 'typeorm';
import { BuffaloWall } from '../entities/buffalo-wall.entity';
import { CreateBuffaloWallDto } from '../dto/create-buffalo-wall.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class BuffaloWallService {
  constructor(
    @InjectRepository(BuffaloWall)
    private buffaloWallRepository: Repository<BuffaloWall>,
  ) {}

  async create(createBuffaloWallDto: CreateBuffaloWallDto): Promise<BuffaloWall> {
    const partial = createBuffaloWallDto as unknown as DeepPartial<BuffaloWall>;
    const buffaloWall: BuffaloWall = this.buffaloWallRepository.create(partial);
    return this.buffaloWallRepository.save(buffaloWall as BuffaloWall);
  }

  async findAll(query: Partial<PaginationDto<BuffaloWall>>): Promise<PaginationDto<BuffaloWall>> {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      startDate, 
      endDate 
    } = query as any;
    
    const skip = (page - 1) * limit;
    const where: any = {};

    if (startDate && endDate) {
      where.dateRepaired = Between(startDate, endDate);
    }

    const [items, total] = await this.buffaloWallRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { dateRepaired: 'DESC' },
    });

    return new PaginationDto({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string): Promise<BuffaloWall> {
    const buffaloWall = await this.buffaloWallRepository.findOne({ 
      where: { id } 
    });
    
    if (!buffaloWall) {
      throw new NotFoundException(`Buffalo wall with ID ${id} not found`);
    }
    
    return buffaloWall;
  }

  async update(
    id: string,
    updateBuffaloWallDto: Partial<CreateBuffaloWallDto>,
  ): Promise<BuffaloWall> {
    const buffaloWall = await this.findOne(id);
    Object.assign(buffaloWall, updateBuffaloWallDto);
    return this.buffaloWallRepository.save(buffaloWall);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.buffaloWallRepository.delete(id);
  }

  async getStatistics() {
    const totalWalls = await this.buffaloWallRepository.count();
    const totalCost = await this.buffaloWallRepository
      .createQueryBuilder('buffaloWall')
      .select('SUM(cost)', 'totalCost')
      .getRawOne();
    
    return {
      totalWalls,
      totalCost: parseFloat(totalCost.totalCost) || 0,
    };
  }
}
