import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Ipo } from "./Ipo"; // Adjust the path as necessary

@Entity({ name: 'LotSizes', synchronize: true })
export class LotSize {
  @PrimaryGeneratedColumn()
  LotSizeId: number;

  @ManyToOne(() => Ipo,(ipo)=> ipo.IpoId)
  @JoinColumn({ name: 'IpoId' })
  IpoId:Ipo

  @Column({ type: 'int', nullable: true })
  RetailMinLot: number;

  @Column({ type: 'int', nullable: true })
  RetailMinShare: number;

  @Column({ type: 'int', nullable: true })
  RetailMaxLot: number;

  @Column({ type: 'int', nullable: true })
  RetailMaxShare: number;

  @Column({ type: 'int', nullable: true })
  ShniMinLot: number;

  @Column({ type: 'int', nullable: true })
  ShniMinShare: number;

  @Column({ type: 'int', nullable: true })
  ShniMaxLot: number;

  @Column({ type: 'int', nullable: true })
  ShniMaxShare: number;

  @Column({ type: 'int', nullable: true })
  BhniMinLot: number;

  @Column({ type: 'int', nullable: true })
  BhniMinShare: number;
}
