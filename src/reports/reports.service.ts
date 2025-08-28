import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { GenerateReportDto } from './dto/generate-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async generateReport(userId: string, dto: GenerateReportDto): Promise<Report> {
    const report = this.reportRepository.create({
      title: `${dto.projectType} ${dto.reportType} Report`,
      projectCategory: dto.projectCategory,
      projectType: dto.projectType,
      reportType: dto.reportType,
      dateRangeStart: dto.dateRangeStart,
      dateRangeEnd: dto.dateRangeEnd,
      generatedBy: userId,
      status: 'In Progress',
    });
    const saved = await this.reportRepository.save(report);

    // Placeholder: real implementation would trigger async job to build file
    return saved;
  }

  getAllReports(userId: string): Promise<Report[]> {
    return this.reportRepository.find({ where: { generatedBy: userId }, order: { createdAt: 'DESC' } });
  }

  async getReportById(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async downloadReport(id: string): Promise<{ filePath: string }> {
    const report = await this.getReportById(id);
    if (!report.filePath) throw new NotFoundException('Report file not available');
    return { filePath: report.filePath };
  }
}


