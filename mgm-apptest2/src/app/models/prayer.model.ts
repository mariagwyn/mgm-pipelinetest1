export class Prayer {
  id: number;
  slug : string;
  category? : string;
  type : string;
  language : string;
  version : string;
  label? : string;
  version_label? : string;
  citation? : string;
  response?: string;
  value : any;
}
