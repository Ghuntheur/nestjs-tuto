import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  AfterUpdate,
  OneToMany
} from 'typeorm'

import { Report } from './../reports/report.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @Column({ default: false })
  admin: boolean

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @AfterInsert()
  logInsert() {
    console.log('inserted user with id ', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('remove user with id ', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('update user with id ', this.id)
  }
}
