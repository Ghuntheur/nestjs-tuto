import { Module, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CurrentUserMiddleware } from './middlewares/current-user.middleware'

import { AuthService } from './auth.service'
import { UsersService } from './users.service'

import { UsersController } from './users.controller'
import { User } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
