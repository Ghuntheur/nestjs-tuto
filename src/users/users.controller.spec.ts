import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'password'
        } as User),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'password' } as User])
      // remove: (id: number) => {},
      // update: (id: number, attrs: Partial<User>) => {}
    }
    fakeAuthService = {
      //   signup: (email: string, password: string) => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User)
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService }
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should findAllUsers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('test@test.com')

    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('test@test.com')
  })

  it('should findUsers returns a single user with given id', async () => {
    const user = await controller.findUser('1')

    expect(user).toBeDefined()
  })

  it('shloud findUser throws an error when given id not found', async () => {
    fakeUsersService.findOne = () => null

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('should signin update session object and returns user', async () => {
    const session = { userId: null }
    const user = await controller.signin(
      { email: 'mail@mail.com', password: 'pass' } as User,
      session
    )

    expect(user).toBeDefined()

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
})
