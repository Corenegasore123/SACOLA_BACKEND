import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto<T> {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: keyof T;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  // Allow additional filter properties dynamically
  [key: string]: any;

  constructor(partial: Partial<PaginationDto<T>> = {}) {
    Object.assign(this, partial);
  }

  // Helper method to get the skip value for TypeORM
  getSkip(): number {
    return (this.page - 1) * this.limit;
  }

  // Helper method to get the take value for TypeORM
  getTake(): number {
    return this.limit;
  }

  // Helper method to get the order for TypeORM
  getOrder(): { [P in keyof T]?: 'ASC' | 'DESC' } | undefined {
    if (!this.sortBy) return undefined;
    return { [this.sortBy]: this.sortOrder } as { [P in keyof T]: 'ASC' | 'DESC' };
  }

  // Helper method to get the where clause without pagination/sorting properties
  getFilters(): Omit<this, keyof PaginationDto<T>> {
    const { page, limit, sortBy, sortOrder, ...filters } = this as any;
    return filters as Omit<this, keyof PaginationDto<T>>;
  }
}
