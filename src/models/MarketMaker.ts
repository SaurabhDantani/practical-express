import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RelationIpoMarketMakers } from "./RelationIpoMarketMakers";

@Entity({name:'MarketMakers', synchronize:true})
export class MarketMaker {
    @PrimaryGeneratedColumn()
    MarketMakerId:number

    @Column({type:'varchar', length:100,nullable:true})
    MarketMakerName:string

    @Column({ type: 'bit', default:false })
    IsDelete: boolean;

    @OneToOne(() => RelationIpoMarketMakers, (relationIpoMarketMakers) => relationIpoMarketMakers.IpoId)
    RelationIpoMarketMakers: RelationIpoMarketMakers;
}