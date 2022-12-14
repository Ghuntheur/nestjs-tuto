import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

import { UsersService } from './users.service'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find(email)
    if (users.length) throw new BadRequestException('email in use')

    // Hash and salt user password
    const salt = randomBytes(9).toString('hex')
    const hash = (await scrypt(password, salt, 32)) as Buffer
    const result = `${salt}.${hash.toString('hex')}`

    // create user
    const user = await this.usersService.create(email, result)
    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) throw new NotFoundException('invalid credentials')

    const [salt, storedHash] = user.password.split('.')
    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credentials')
    }

    return user
  }
}
