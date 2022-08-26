import { Test } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { AuthService } from './auth.service'
import { UsersService } from './users.service'

import { User } from './user.entity'

describe('AuthService', () => {
  let service: AuthService
  let fakeUserService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []
    fakeUserService = {
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password
        } as User
        users.push(user)

        return Promise.resolve(user)
      }
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService
        }
      ]
    }).compile()

    service = module.get(AuthService)
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('testuser@a.com', 'password')
    expect(user.password).not.toEqual('password')

    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throw an error if user sign up with email that is in use', async () => {
    await service.signup('as@a.com', 'password')

    await expect(service.signup('as@a.com', 'password')).rejects.toThrow(
      BadRequestException
    )
  })

  it('throws if signin is called with unused email', async () => {
    await expect(service.signin('dsdsd@sdds.com', 'password')).rejects.toThrow(
      NotFoundException
    )
  })

  it('throws if an invalid password is provided', async () => {
    await service.signup('email@test.com', 'password')

    await expect(service.signin('email@test.com', 'qbdnf')).rejects.toThrow(
      BadRequestException
    )
  })

  it('returns a user if credentials are correct', async () => {
    await service.signup('fromTest@a.com', 'password')

    const user = await service.signin('fromTest@a.com', 'password')
    expect(user).toBeDefined()
  })
})
