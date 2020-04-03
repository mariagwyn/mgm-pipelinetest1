import { CompiledLiturgy } from './liturgy.model';
import { DisplaySettings } from './display-settings.model';

export class Bulletin {
  id : number;
  uid? : string;
  date_added? : Date;
  date_modified? : Date;
  owner? : string; // username
  settings : DisplaySettings;
  liturgy : CompiledLiturgy;
}
