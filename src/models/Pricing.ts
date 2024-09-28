import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'Pricings', synchronize: true })
export class Pricing {
  @PrimaryGeneratedColumn()
  PricingId: number;

  @Column({ type: 'varchar', length: 100,nullable:true })
  Name: string;

  @Column({ type: 'varchar', length: 100,nullable:true })
  Price: string;

  @Column({ type: 'varchar', length: 100,nullable:true })
  OfferPrice: string;

  @Column({ type: 'int',nullable:true })
  OfferDays: number;

  @Column({ type: 'tinyint', default: 1,nullable:true })
  IsActive: number;

  @Column({ type: 'tinyint', default: 0, nullable:true })
  IsDelete: number;
}
