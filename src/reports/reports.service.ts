import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateReportDto } from './dtos/create-report.dto'
import { GetEstimateDto } from './dtos/get-estimate.dto'
import { Report } from './report.entity'

import { User } from '../users/user.entity'

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto)

    return this.repo.save({
      ...report,
      user
    })
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id })
    if (!report) throw new NotFoundException('report not found')
    return this.repo.save({
      ...report,
      approved
    })
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne()
  }
}
