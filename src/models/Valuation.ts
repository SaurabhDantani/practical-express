import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne } from "typeorm";
import { Ipo } from "./Ipo";

@Entity({ name: 'Valuations', synchronize: true })
export class Valuation {
  @PrimaryGeneratedColumn()
  ValuationId: number;

  @ManyToOne(()=>Ipo, (ipo)=> ipo.IpoId)
  @JoinColumn({name:'IpoId'})
  IpoId:Ipo[]

  @Column({ type: 'varchar', length: 90, nullable: true })
  StrKey: string;

  @Column({ type: 'varchar', length: 90, nullable: true })
  StrValue: string;
}
