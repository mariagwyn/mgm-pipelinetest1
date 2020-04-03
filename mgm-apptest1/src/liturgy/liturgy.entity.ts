import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export class Section {
  type: "section"|"supplement";
  slug?: string;
  label?: string;
  value: Condition[];
}

export class Condition {
  options?: Condition[];
  type?: string;
  slug?: string;
  label?: string;
  category?: string;
  rotate?: "daily"|"seasonal";
  rotate_among?: string[];
  condition?: "fixed"|"day"|"seasonal"|"lectionaryContains"|"feastDay"|"ferialDay"|"weekday"|"preference"|"date";
  only?: string[];
  except?: string[];
  lectionary?: string|{ preference: string; };
  reading?: string|{ preference: string; };
  antiphon?: string;
  psalter?: string|{ preference: string; }
  whentype?: "day"|"date"|"year";
  offset?: number;
  preference?: string;
  value?: string;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  eucharistic_intro?: boolean;
  labelled_reading?: boolean;
  citation?: string;
  keepoptions?: boolean;
  firstchoice: string;
  version: string[];
}

export class Preference {
  label: string;
  supplement?: boolean;
  description?: string;
  options: PreferenceOption[];
}

export class PreferenceOption {
  value: string;
  label?: string;
  default?: boolean;
  whentype?: string;
  alternateYear?: boolean;
}

export class Preferences {
  [x: string]: Preference;
}

export class ClientPreferences {
  [x: string]: string;
}

@Entity()
export class Liturgy {
  @PrimaryGeneratedColumn({type: 'bigint'}) id : number;
  @Column() slug : string;
  @Column() name : string;
  @Column() language : string;
  @Column() version : string;
  @Column({type: 'simple-json', nullable: true }) liturgyversions : string[];
  @Column({ nullable: true }) source : string;
  @Column('simple-json') preferences : Preferences;
  @Column() evening : boolean;
  @Column('simple-json') value? : Section[];
  @Column({ nullable: true }) supplement : boolean = false;
}
