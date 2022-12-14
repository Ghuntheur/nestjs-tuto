import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'

import { CurrentUser } from '../users/decorators/current-user.decorator'
import { Serialize } from '../interceptors/serialize.interceptor'

import { AdminGuard } from '../guards/admin.guard'
import { AuthGuard } from '../guards/auth.guards'

import { CreateReportDto } from './dtos/create-report.dto'
import { ReportDto } from './dtos/report.dto'
import { ApprovedReportDto } from './dtos/approved-report.dto'
import { GetEstimateDto } from './dtos/get-estimate.dto'

import { ReportsService } from './reports.service'

import { User } from './../users/user.entity'

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query)
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user)
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approvedReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
    return this.reportsService.changeApproval(+id, body.approved)
  }
}
