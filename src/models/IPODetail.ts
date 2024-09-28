import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Ipo } from "./Ipo"; // Assuming you have an `Ipo` entity defined
import { Registrar } from "./Registrar";
import { MarketMaker } from "./MarketMaker";
import { IpoTypeEnum } from "../utils/enumData";

@Entity({ name: 'IpoDetails', synchronize: true })
export class IpoDetail {
  @PrimaryGeneratedColumn()
  IpoDetailId: number;

  @OneToOne(() => Ipo, (ipo)=>ipo.IpoId)
  @JoinColumn({ name: 'IpoId' })
  IpoId: Ipo;

  @OneToOne(() => Registrar, (registrar)=>registrar.RegistrarId)
  @JoinColumn({ name: 'RegistrarId' })
  RegistrarId: Registrar;

  @Column({ type: 'nvarchar', length:100, nullable: true })
  RegistrarEmail:string

  @Column({ type: 'int', nullable: true })
  MinimumPrice: number;

  @Column({ type: 'int', nullable: true })
  MaximumPrice: number;

  @Column({ type: 'int', enum:IpoTypeEnum,default:IpoTypeEnum.BOOK_BUILT_ISSUE,nullable: true })
  IpoType: number;

  @Column({ type: 'int', nullable: true })
  FaceValue: number;

  @Column({ type: 'int', nullable: true })
  LotSize: number;

  @Column({ type: 'int', nullable: true })
  ShareHoldingPreIssue: number;

  @Column({ type: 'int', nullable: true })
  ShareHoldingPostIssue: number;

  @Column({ type: 'int', nullable: true })
  TotalIssueShares: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  TotalIssuePrice: string;

  @Column({ type: 'int', nullable: true })
  FreshIssueShares: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  FreshIssuePrice: string;

  @Column({ type: 'int', nullable: true })
  OfsIssueShares: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  OfsIssuePrice: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  FinancialInformation: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  About: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Strength: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Risk: string;

  @Column({ type: 'nvarchar', length: 2000, nullable: true })
  Objectives: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  CompanyAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  DRHPLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  RHPLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  AnchorListLink: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  BasicOfAllotment: string;
}
