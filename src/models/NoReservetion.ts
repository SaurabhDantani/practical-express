import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Ipo } from "./Ipo";

@Entity({ name: 'NoReservations', synchronize: true })
export class NoReservations {
  @PrimaryGeneratedColumn()
  NoReservationId: number;

  @OneToOne(() => Ipo, (ipo) => ipo.IpoId)
  @JoinColumn({name:'IpoId'})
  IpoId: Ipo;

  @Column({ type: 'varchar', nullable:true })
  RetailSharesOffer: string;

  @Column({ type: 'varchar', nullable:true })
  NiiSharesOffer: string;

  @Column({ type: 'varchar',nullable:true })
  QibSharesOffer: string;
}
