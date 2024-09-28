import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ipo } from "./Ipo";

@Entity({name:'TimeLines', synchronize:true})
export class TimeLine {
    @PrimaryGeneratedColumn()
    TimelineId:number

    @OneToOne(()=>Ipo, (ipo)=> ipo.IpoId)
    @JoinColumn({name:'IpoId'})
    IpoId: Ipo;

    @Column({ type: 'date', nullable: true })
    StartDate: Date;
  
    @Column({ type: 'date', nullable: true })
    EndDate: Date;
  
    @Column({ type: 'date', nullable: true })
    AllotmentDate: Date;
  
    @Column({ type: 'date', nullable: true })
    RefundDate: Date;
  
    @Column({ type: 'date', nullable: true })
    CreditShareDate: Date;
  
    @Column({ type: 'date', nullable: true })
    ListingDate: Date;
}