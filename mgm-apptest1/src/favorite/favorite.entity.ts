import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from "typeorm";

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn({type: 'bigint'}) id : number;
  @CreateDateColumn() dateAdded : Date;
  @Column() user : string;
  @Column() url : string;
  @Column() fragment : string;
  @Column({ nullable: true }) citation : string;
  @Column() text : string;
  @Column({ nullable: true }) note : string;
  @Column('simple-array') tags : string[];
}
