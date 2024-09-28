import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AdminToken } from "./AdminToken";

@Entity({ name: 'AdminLogins', synchronize: true })
export class AdminLogins {
  
  @PrimaryGeneratedColumn()
  LoginId: number;

  @Column({ type: 'varchar', length: 100, nullable:true })
  CompanyName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  FirstName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  LastName: string;

  
  @Column({ type: 'varchar', length: 100, nullable:true })
  EmailAddress: string;

  @Column({ type: 'varchar', length: 255, nullable:true })
  Password: string;

  @Column({ type: 'tinyint', default: 1, nullable:true })
  IsActive: number;

  @Column({ type: 'tinyint', default: 0, nullable:true })
  IsDelete: number;

  @OneToMany(() => AdminToken, (adminToken) => adminToken.AdminTokenId)
  AdminTokenId: AdminToken[]

  @BeforeInsert()
  async hashPassword() {
    if(this.Password) {
      const saltRounds = 10;
      this.Password = await bcrypt.hash(this.Password, saltRounds)
    }
  }
}
