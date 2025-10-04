import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.services';
import { RequestDto } from 'src/core/dtos/request.dto';
import { UserGuard } from 'src/core/guards/guards';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  async getAdminDashboardData() {
    return this.dashboardService.getAdminDashboardData();
  }

  @Get('student')
  @UseGuards(UserGuard)
  async getStudentDashboardData(@Req() req: RequestDto) {
    return this.dashboardService.getStudentDashboardData(req.userId);
  }
}
