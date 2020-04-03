import { LiturgyObject } from './liturgy.model';

export class SelectedTextEvent {
  text: string;
  fragment: string;
  citation: string;
  ids: string[];
}

export class SelectableCitation {
  book?: string;
  chapter?: string;
  verse?: string;
  label?: string;
  string?: string;
}
