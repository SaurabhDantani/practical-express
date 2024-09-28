import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Ipo } from "./Ipo";

@Entity({ name: 'IpoSubscriptions', synchronize: true })
export class IpoSubscription {
  @PrimaryGeneratedColumn()
  IpoSubscriptionId: number;

  @OneToOne(() => Ipo,(ipo)=>ipo.IpoId)
  @JoinColumn({ name: 'IpoId' })
  IpoId:Ipo

  @Column({ type: 'bigint', nullable: true })
  RetailSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  NiiSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  BniiSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  SniiSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  QibSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  EmployeeSubscription: number;

  @Column({ type: 'bigint', nullable: true })
  ShareHolderSubscription: number;

  @Column({ type: 'datetime', nullable: true })
  LastUpdate: Date;

  @Column({ type: 'bigint', nullable: true })
  RetailApplication: number;

  @Column({ type: 'int', nullable: true })
  NiiApplication: number;

  @Column({ type: 'int', nullable: true })
  QibApplication: number;

  @Column({ type: 'int', nullable: true })
  EmployeeApplication: number;

  @Column({ type: 'int', nullable: true })
  ShareHolderApplication: number;

  @Column({ type: 'int', nullable: true })
  BniiApplication: number;

  @Column({ type: 'int', nullable: true })
  SniiApplication: number;
}
