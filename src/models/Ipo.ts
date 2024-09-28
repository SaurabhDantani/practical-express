import { ExchangedEnum, IssueTypeEnum, TypeEnum } from "../utils/enumData";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Valuation } from "./Valuation";
import { IPOGMP } from "./IPOGMP";
import { IpoDetail } from "./IPODetail";
import { Payments } from "./Payments";
import { TimeLine } from "./TimeLine";
import { LotSize } from "./LotSize";
import { Reservation } from "./Reservation";
import { IpoSubscription } from "./IPOSubscription";
import { PromoterHoldings } from "./PromoterHolding";
import { RelationIpoLeadManagers } from "./RelationIpoLeadManagers";
import { RelationIpoMarketMakers } from "./RelationIpoMarketMakers";
import { NoReservations } from "./NoReservetion";

@Entity({ name: 'Ipos', synchronize: true })
export class Ipo {
  @PrimaryGeneratedColumn() // auto increment ids
  IpoId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  CompanyName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  DisplayName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  UrlName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Symbol: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CompanyLogo: string;

  @Column({ type: 'int', enum: TypeEnum, default:TypeEnum.SME})
  Type: number;

  @Column({ type: 'int', enum: ExchangedEnum, default:ExchangedEnum.BSE})
  Exchanged: number;

  @Column({ type: 'int', enum: IssueTypeEnum, default:IssueTypeEnum.IPO})
  IssueType: number;

  @Column({ type: 'int', nullable: true })
  BseId: number;

  @Column({ type: 'int', nullable: true })
  PremiumId: number;

  @Column({ type: 'int', nullable: true })
  ChitorId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ChitorName: string;

  @Column({ type: 'int', nullable: true })
  InvestorId: number;

  @Column({ type: 'int', nullable: true })
  FetchData: number;

  @Column({ type: 'int', default:1, nullable: true })
  RetailQuota: number;

  @Column({ type: 'bit', default:true})
  IsActive: boolean;

  @Column({ type: 'bit', default:false })
  IsDelete: boolean;
 
  @OneToMany(() => IPOGMP, (gmp) => gmp.IpoId)
  IPOGMPId: IPOGMP[]

  @OneToMany(() => Valuation, (valuation) => valuation.IpoId)
  ValuationId: Valuation[]

  @OneToMany(() => LotSize, (lotSize) => lotSize.IpoId)
  LotSizeId: LotSize[]

  @OneToOne(() => TimeLine, (timeline) => timeline.IpoId)
  TimeLine: TimeLine;

  @OneToOne(() => IpoDetail, (ipoDetail) => ipoDetail.IpoId)
  IpoDetail: IpoDetail;

  @OneToOne(() => IpoSubscription, (ipoSubscription) => ipoSubscription.IpoId)
  IpoSubscription: IpoSubscription;

  @OneToOne(() => Reservation, (reservation) => reservation.IpoId)
  Reservation: Reservation;

  @OneToOne(() => PromoterHoldings, (promoterHoldings) => promoterHoldings.IpoId)
  PromoterHoldings: IpoSubscription;
  
  @OneToOne(() => RelationIpoLeadManagers, (relationIpoLeadManagers) => relationIpoLeadManagers.IpoId)
  RelationIpoLeadManagers: RelationIpoLeadManagers;

  @OneToOne(() => RelationIpoMarketMakers, (relationIpoMarketMakers) => relationIpoMarketMakers.IpoId)
  RelationIpoMarketMakers: RelationIpoMarketMakers;

  @OneToOne(() => NoReservations, (noReservations) => noReservations.IpoId)
  NoReservations: NoReservations;
}
