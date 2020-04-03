export class BibleReading {
  id : number;
  citation : string;
  label : string;
  language : string;
  version : string;
  value : string[];
  verses : Verse[][];
  eucharistic_intro? : boolean;
  labelled_reading? : boolean;
}

export class Verse {
  book?: string;
  chapter?: string;
  verse?: string;
  text: string;
}
