import { DisplaySettings } from './display-settings.model';

export class Liturgy {
  id : number;
  slug : string;
  name : string;
  language : string;
  version : string;
  liturgyversions : string[];
  source : string;
  preferences : Preferences;
  evening : boolean;
  value? : Section[];
  supplement: boolean;
  special_day? : boolean;
}

export class Section {
  type: "section";
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
  condition?: "fixed"|"seasonal"|"lectionaryContains"|"feastDay"|"ferialDay"|"weekday"|"preference";
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
}


export class CompiledLiturgy {
  date: Date;
  name: string;
  language: string;
  version: string;
  day: LiturgicalDay;
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
  selected: number = 0;
  hidden : boolean = false;
  value: LiturgyObject[];
}

export interface LiturgyObject {
  type: string;
  uid?: string;
  pending?: boolean;
  [x: string]: any;
}

export class LiturgicalDay {
  date: Date;
  slug: string;
  evening: boolean;
  week: LiturgicalWeek;
  years: { [x: string]: number };
  holy_days?: HolyDay[];
  season: string;
  omit_the?: boolean;
  color?: LiturgicalColor;
  proper?: any;
}

export class HolyDay {
  slug: string;
  mmdd?: string;
  readings?: string;
  name?: string;
  season?: string;
  eve?: boolean;
  type?: {
    name: string;
    rank: number;
  }
  color?: LiturgicalColor;
  image?: string;
  imageUrl?: string;
  collect?: string;
  collectOptions?: string[];
  stops_at_sunday?: string;
  morning?: HolyDay;
  evening?: HolyDay;
}

export class LiturgicalWeek {
  id: string;
  week: number;
  season: string;
  name: string;
  color: LiturgicalColor;
  slug?: string;
  omit_the?: boolean;
  readings_slug?: string;
  proper?: Proper;
  rank?: number;
  type?: {
    name: string;
    rank: number;
  }
  image?: string;
  imageUrl?: string;
}

export class LiturgicalColor {
  name: string;
  hex: string;
  image?: string;
  imageUrl?: string;
}

export class Proper {
  slug: string;
  label: string;
  proper: number;
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
  whenType?: string;
}

export class Preferences {
  [x: string]: Preference;
}

export class ClientPreferences {
  [x: string]: string;
}

export class UserPreferences {
  defaultLanguage: string;
  defaultVersion: string;
  displaySettings?: DisplaySettings;
  preferences: {
    [language: string]: {
      [version: string]: {
        [liturgy: string]: ClientPreferences;
      }
    }
  }

  constructor() {
    this.defaultLanguage = 'en';
    this.defaultVersion = 'Rite-II';
    this.preferences = {};
    this.displaySettings = new DisplaySettings();
  }
}

export class User {
  firstName?: string;
  lastName?: string;
  login: string;
  preferences?: UserPreferences;
}
