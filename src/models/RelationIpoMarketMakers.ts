import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Ipo } from "./Ipo";
import { MarketMaker } from "./MarketMaker";

@Entity({ name: 'RelationIpoMarketMakers', synchronize: false })
export class RelationIpoMarketMakers {
  @PrimaryGeneratedColumn()
  RelationIpoMarketMakerId: number;

  @OneToOne(() => Ipo,(ipo)=>ipo.IpoId)
  @JoinColumn({ name: 'IpoId' })
  IpoId:Ipo

  @OneToOne(() => MarketMaker,(marketMaker)=> marketMaker.RelationIpoMarketMakers)
  @JoinColumn({ name: 'MarketMakerId' })
  MarketMakerId:MarketMaker
}
