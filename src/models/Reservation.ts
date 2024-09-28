import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { Ipo } from "./Ipo";

@Entity({ name: 'Reservations', synchronize: true })
export class Reservation {
  @PrimaryGeneratedColumn()
  ReservationId: number;

  @OneToOne(() => Ipo,(ipo)=>ipo.IpoId)
  @JoinColumn({ name: 'IpoId' })
  IpoId:Ipo

  @Column({ type: 'int', nullable: true })
  AnchorInvestorSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  MarketMakersSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  RetailSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  NiiSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  BniiSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  SniiSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  QibSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  EmployeeSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  ShareHolderSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  TotalSharesOffer: number;

  @Column({ type: 'int', nullable: true })
  BniiMaximumAllotment: number;

  @Column({ type: 'int', nullable: true })
  SniiMaximumAllotment: number;

  @Column({ type: 'int', nullable: true })
  RetailMaximumAllotment: number;

  @Column({ type: 'int', nullable: true })
  NiiMaximumAllotment: number;
}
