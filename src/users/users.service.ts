import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password })
    return this.repo.save(user)
  }

  findOne(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id })
  }

  find(email: string): Promise<User[] | null> {
    return this.repo.findBy({ email })
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    return this.repo.update(user.id, { ...user, ...attrs })
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return this.repo.delete(user.id)
  }
}
