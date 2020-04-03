import { LiturgicalWeek, LiturgicalColor } from '../season/season.model';
import { HolyDay } from '../holyday/holyday.model';

export class LiturgicalDay {
  date: Date;
  slug: string;
  propers: string;
  evening: boolean;
  week: LiturgicalWeek;
  years: { [x: string]: number };
  holy_days?: HolyDay[];
  season: string;
  omit_the?: boolean;
  color?: LiturgicalColor;
}
