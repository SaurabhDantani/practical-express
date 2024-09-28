import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({ name: 'Users', synchronize: true })
export class Users {
  
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, })
  FirstName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  LastName: string;

  
  @Column({ type: 'varchar', length: 100, unique:true })
  Email: string;

  @Column({ type: 'varchar', length: 255, })
  Password: string;

  @Column({ type: 'varchar', length: 100, })
  Role: string;

  @Column({ type: 'bit', default: 0, nullable:true})
  IsVerify: number;

  @BeforeInsert()
  async hashPassword() {
    if(this.Password) {
      const saltRounds = 10;
      this.Password = await bcrypt.hash(this.Password, saltRounds)
    }
  }
}
