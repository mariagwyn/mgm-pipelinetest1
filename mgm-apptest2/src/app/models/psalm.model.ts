export class Psalm {

  id : number;
  slug : string;
  language : string;
  version : string;
  number : string;
  label : string;
  canticle : boolean;
  invitatory : boolean;
  localname : string;
  latinname : string;
  citation : string;

  antiphon : {
    [x: string]: string;
  };
  value : string[][][]|{label: string; verses: string[][]}[];

  omit_antiphon : boolean;
  omit_gloria : boolean;

  version_label : string;

  translating? : boolean;
}
