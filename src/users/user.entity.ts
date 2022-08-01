import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  AfterUpdate
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

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
