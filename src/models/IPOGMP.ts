import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Ipo } from "./Ipo"; // Assuming you have an `Ipo` entity defined

@Entity({ name: 'IPOGMPs', synchronize: true })
export class IPOGMP {
  @PrimaryGeneratedColumn() // Unique identifier and Primary Key
  GmpId: number;

  @ManyToOne(()=>Ipo, (ipo)=>ipo.IpoId)
  @JoinColumn({name:'IpoId'})
  IpoId: Ipo[];

  @Column({ type: 'date',nullable: true })
  GMPDate: Date;

  @Column({ type: 'int',nullable: true })
  GMPPrice: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Sub2SaudaRate: string;

  @Column({ type: 'datetime',nullable: true })
  LastUpdate: Date;
}
