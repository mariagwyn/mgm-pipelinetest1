import { HolyDay } from '../holyday/holyday.model';

export class LiturgicalWeek {
  id: string;
  week: number;
  season: string;
  name: string;
  color: LiturgicalColor;
  slug: string;
  propers: string;
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
