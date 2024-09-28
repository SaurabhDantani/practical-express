import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Ipo } from "./Ipo";
import { Users } from "./Users";

@Entity({ name: 'Payments', synchronize: true })
export class Payments {
  @PrimaryGeneratedColumn()
  PaymentId: number;

  @ManyToOne(()=>Users,(user)=>user.PaymentId)
  @JoinColumn({name:'UserId'})
  UserId:Users[]

  @Column({ type: 'varchar', length: 255, nullable:true })
  TransactionId: string;

  @Column({ type: 'datetime', nullable:true })
  TransactionDate: Date;

  @Column({ type: 'int', nullable:true})
  Price: string;

  @Column({ type: 'int', nullable:true})
  OfferDays: number;
}
