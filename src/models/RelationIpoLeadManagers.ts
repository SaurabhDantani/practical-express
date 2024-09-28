import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Ipo } from "./Ipo";
import { LeadManager } from "./LeadManager";

@Entity({ name: 'RelationIpoLeadManagers', synchronize: false })
export class RelationIpoLeadManagers {
  @PrimaryGeneratedColumn()
  RelationIpoLeadManagerId: number;

  @OneToOne(() => Ipo,(ipo)=>ipo.IpoId)
  @JoinColumn({ name: 'IpoId' })
  IpoId:Ipo

  @OneToOne(() => LeadManager,(leadManager)=>leadManager.LeadManagerId)
  @JoinColumn({ name: 'LeadManagerId' })
  LeadManagerId:LeadManager
}
