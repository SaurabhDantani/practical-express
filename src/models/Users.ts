import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({ name: 'Users', synchronize: true })
export class Users {
  
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, nullable:true })
  FirstName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  LastName: string;

  
  @Column({ type: 'varchar', length: 100, nullable:true })
  EmailAddress: string;

  @Column({ type: 'varchar', length: 255, nullable:true })
  Password: string;

  @BeforeInsert()
  async hashPassword() {
    if(this.Password) {
      const saltRounds = 10;
      this.Password = await bcrypt.hash(this.Password, saltRounds)
    }
  }
}
