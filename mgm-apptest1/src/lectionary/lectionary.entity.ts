import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reading {
  @PrimaryGeneratedColumn() id: number;
  @Column() lectionary: string;
  @Column() citation: string;
  @Column({ nullable: true }) day: string;
  @Column() type: string; //'first_reading'|'second_reading'|'gospel'|'morning_psalm'|'evening_psalm'
  @Column({ nullable: true }) whentype: string; //'year'|'date'|'time';
  @Column('int') when: number;
}
