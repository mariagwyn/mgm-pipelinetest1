import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Collect {
  @PrimaryGeneratedColumn({type: 'bigint'}) id: number;
  @Column() slug: string;
  @Column() language: string;
  @Column() version: string;
  @Column('simple-json') value: string[];
}
