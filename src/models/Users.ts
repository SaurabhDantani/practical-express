import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Pricing } from "./Pricing";
import { Payments } from "./Payments";
import { AdminToken } from "./AdminToken";

@Entity({ name: 'Users', synchronize: true })
export class Users {
  @PrimaryGeneratedColumn()
  Id: string;

  @OneToOne(()=>Pricing, (pricing)=>pricing.PricingId)
  @JoinColumn({name:'PricingId'})

  @Column({ type: 'varchar', length: 100, nullable:true })
  CompanyName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  FirstName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  LastName: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  EmailAddress: string;

  @Column({ type: 'varchar', length: 100, nullable:true })
  Phone: number;

  @Column({ type: 'date' })
  SubscriptionStartDate: Date;

  @Column({ type: 'date' })
  SubscriptionEndDate: Date;
  
  @Column({ type: 'varchar', length: 255, nullable:true })
  APIKey: string;

  @Column({ type: 'varchar', length: 255, nullable:true })
  APISecret: string;

  @Column({ type: 'tinyint', default: 1, nullable:true })
  IsActive: number;

  @Column({ type: 'tinyint', default: 0, nullable:true })
  IsDelete: number;


  @OneToMany(() => Payments, (payments) => payments.PaymentId)
  PaymentId: Payments[]
  
}
