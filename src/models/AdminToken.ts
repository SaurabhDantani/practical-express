import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AdminLogins } from "./AdminLogin";

@Entity({ name: 'AdminTokens', synchronize: true })
export class AdminToken {
  @PrimaryGeneratedColumn()
  AdminTokenId: number;

  @ManyToOne(()=>AdminLogins,(user)=>user.AdminTokenId)
  @JoinColumn({name:'UserId'})
  UserId:AdminLogins[]

  @Column({ type: 'varchar', length: 255, nullable:true })
  Token: string;

  @Column({ type: 'datetime', nullable:true })
  LoginTime: Date;
}
