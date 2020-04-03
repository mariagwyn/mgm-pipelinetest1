export class LectionaryDB {
  [x: string]: Lections;
}

export class Lections {
  year_one?: Year;
  year_two?: Year;
}

export class Year {
  first_reading?: ReadingOld;
  second_reading?: ReadingOld;
  gospel?: ReadingOld;
  morning_psalms?: string[];
  evening_psalms?: string[];
}

export class ReadingOld {
  citation: string;
  label: string;
  value: string[];
}
