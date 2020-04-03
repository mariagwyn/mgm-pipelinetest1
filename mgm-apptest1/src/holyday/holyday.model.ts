import { LiturgicalColor } from '../season/season.model';

export class HolyDayDB {
  [x: string]: HolyDay;
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
