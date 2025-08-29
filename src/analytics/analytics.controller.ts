import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiQuery({
    name: 'category',
    required: true,
    enum: ['conservation', 'socio-economic'],
  })
  @ApiQuery({
    name: 'project',
    required: true,
    description: 'Project key, e.g. tree-planting, livestock',
  })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: false, description: '1-12' })
  getAnalytics(
    @Query('category') category: 'conservation' | 'socio-economic',
    @Query('project') project: string,
    @Query('year') year: string,
    @Query('month') month?: string,
  ) {
    const yearNum = Number(year);
    const monthNum = month ? Number(month) : undefined;
    return this.analyticsService.getAnalytics({
      category,
      project,
      year: yearNum,
      month: monthNum,
    });
  }
}
