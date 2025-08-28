import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  generate(@Req() req: any, @Body() dto: GenerateReportDto) {
    return this.reportsService.generateReport(req.user.id, dto);
  }

  @Get()
  list(@Req() req: any) {
    return this.reportsService.getAllReports(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.reportsService.getReportById(id);
  }

  @Get(':id/download')
  async download(@Param('id') id: string) {
    return this.reportsService.downloadReport(id);
  }
}


