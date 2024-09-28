import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { RelationIpoLeadManagers } from "./RelationIpoLeadManagers";

@Entity({ name: 'LeadManagers', synchronize: true })
export class LeadManager {
  @PrimaryGeneratedColumn()
  LeadManagerId: number;

  @Column({ type: 'varchar', length: 100 })
  ManagerName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Website: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Fax: string;

  @Column({ type: 'bit', default:false })
  IsDelete: boolean;

  @OneToOne(() => RelationIpoLeadManagers, (relationIpoLeadManagers) => relationIpoLeadManagers.LeadManagerId)
  RelationIpoLeadManagers: RelationIpoLeadManagers;
}
