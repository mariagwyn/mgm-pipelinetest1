import { LiturgicalDay } from "../calendar/calendar.model";
import { Verse } from "../bible/bible.entity";

export class CompiledLiturgy {
  date: Date;
  name: string;
  day: LiturgicalDay;
  language: string;
  version: string;
  liturgyversions : string[];
  liturgy: CompiledSection[];
}

export class CompiledSection {
  type: "section";
  label?: string;
  value: CompiledOption[];
}

export class CompiledOption {
  type: "option";
  label?: string;
  selected?: number;
  hidden? : boolean = false;
  value: LiturgyObject[];
}

export interface LiturgyObject {
  type: string;
  value?: any;
  uid?: string;
  [x: string]: any;
}
