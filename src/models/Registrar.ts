import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { IpoDetail } from "./IPODetail";

@Entity({ name: 'Registrars', synchronize: true })
export class Registrar {
  @PrimaryGeneratedColumn()
  RegistrarId: number;

  @OneToOne(() => IpoDetail, (ipoDetail) => ipoDetail.RegistrarId)
  PromoterHoldings: IpoDetail;

  @Column({ type: 'varchar', length: 255 })
  RegistrarName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  RegistrarPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  RegistrarEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  RegistrarIpoEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  RegistrarWebsite: string;

  @Column({ type: 'bit', default:false })
  IsDelete: boolean;
  
}
