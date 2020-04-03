import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CompiledLiturgy } from '../pray/pray.model';

export class DisplaySettings {
  dropcaps: 'decorated'|'plain'|'none';
  response: 'bold'|'italics';
  fontscale: 's'|'m'|'l'|'xl'|'xxl';
  font: 'garamond'|'gill-sans'
  voiceChoice: string;
  voiceRate: number = 0.75;
  voiceBackground: 'silence'|'seashore'|'garden'|'night';
  voiceBackgroundVolume: number = 0.5;
  psalmVerses: boolean = false;
  bibleVerses : boolean = false;
  meditationBell: 'silence'|'singing-bowl';
  displayMode: 'dark'|'light';

  constructor(
    dropcaps : 'decorated'|'plain'|'none' = 'decorated',
    response : 'bold'|'italics' = 'bold',
    fontscale : 's'|'m'|'l'|'xl'|'xxl' = 'm',
    font : 'garamond'|'gill-sans' = 'garamond',
    voiceRate: number = 0.85,
    voiceBackground: 'silence'|'seashore'|'garden'|'night' = 'silence',
    voiceBackgroundVolume: number = 0.5,
    psalmVerses: boolean = false,
    bibleVerses: boolean = false,
    meditationBell: 'silence'|'singing-bowl' = 'singing-bowl',
    displayMode: 'dark'|'light' = 'light'
  ) {
    this.dropcaps = dropcaps;
    this.response = response;
    this.fontscale = fontscale;
    this.font = font;
    this.voiceRate = voiceRate;
    this.voiceBackground = voiceBackground;
    this.voiceBackgroundVolume = voiceBackgroundVolume;
    this.psalmVerses = psalmVerses;
    this.bibleVerses = bibleVerses;
    this.meditationBell = meditationBell;
    this.displayMode = displayMode;
  }
}


@Entity()
export class Bulletin {
  @PrimaryGeneratedColumn({type: 'bigint'}) id : number;
  @Column({nullable: true}) owner? : string; // username
  @CreateDateColumn() date_added : Date;
  @UpdateDateColumn() date_modified? : Date;

  @Column({type: 'simple-json'}) settings : DisplaySettings;
  @Column({type: 'simple-json'}) liturgy : CompiledLiturgy;
  @Column({nullable: true}) uid? : string;
}
