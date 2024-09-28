import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { Ipo } from "./Ipo";

@Entity({ name: 'PromoterHoldings', synchronize: true })
export class PromoterHoldings {
  @PrimaryGeneratedColumn()
  PromoterHoldingId: number;

  @OneToOne(()=>Ipo, (ipo)=> ipo.IpoId)
  @JoinColumn({name:'IpoId'})
  IpoId:Ipo

  @Column({ type: 'varchar', length: 45, nullable: true })
  PreIssue: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  PostIssue: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  PromoterNames: string;
}
