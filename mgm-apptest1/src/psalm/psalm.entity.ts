import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Psalm {

  @PrimaryGeneratedColumn({type: 'bigint'}) id : number;
  @Column() slug : string;
  @Column() language : string;
  @Column() version : string;
  @Column({ nullable: true }) number : string;
  @Column({ nullable: true }) label : string;
  @Column() canticle : boolean;
  @Column({ nullable: true }) invitatory : boolean;
  @Column({ nullable: true }) localname : string;
  @Column({ nullable: true }) latinname : string;
  @Column({ nullable: true }) citation : string;

  @Column({ type: 'simple-json', nullable: true }) antiphon : {
    [x: string]: string;
  };
  @Column('simple-json') value : string[][][];

  @Column({ nullable: true }) omit_antiphon : boolean;
  @Column({ nullable: true }) omit_gloria : boolean;
  @Column({ nullable: true }) version_label : string;
}
