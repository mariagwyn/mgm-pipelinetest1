import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BibleReading {
  @PrimaryGeneratedColumn() id : number;
  @Column() citation : string;
  @Column() label : string;
  @Column() language : string;
  @Column() version : string;
  @Column({type: 'simple-json', nullable: true}) value : string[];
  @Column({type: 'simple-json', nullable: true}) verses : Verse[][];
  eucharistic_intro? : boolean;
  labelled_reading? : boolean;
}

export class Verse {
  book?: string;
  chapter?: string;
  verse?: string;
  text: string;
}
