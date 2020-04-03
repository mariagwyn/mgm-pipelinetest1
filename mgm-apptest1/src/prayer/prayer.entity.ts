import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Prayer {
  @PrimaryGeneratedColumn({type: 'bigint'}) id : number;
  @Column() slug : string;
  @Column({ nullable: true }) category : string;
  @Column() type : string;
  @Column() language : string;
  @Column() version : string;
  @Column({ nullable: true }) label : string;
  @Column({ nullable: true }) version_label : string;
  @Column({ nullable: true }) citation : string;
  @Column('simple-json') value : any;
  @Column({ nullable: true}) response: string;
}
