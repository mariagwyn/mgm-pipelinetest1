import { Injectable } from '@nestjs/common';
import { LiturgicalWeek, LiturgicalColor } from './season.model';

@Injectable()
export class SeasonService {

  easterCycle(ii : number) : LiturgicalWeek {
    return easterCycle[ii];
  }

  adventCycle(ii : number) : LiturgicalWeek {
    console.log("advent week: ", ii);
    return adventCycle[ii];
  }

  christmasCycle(ii : number) : LiturgicalWeek {
    return christmasCycle[ii];
  }

  epiphanyCycle(ii : number) : LiturgicalWeek {
    return epiphanyCycle[ii];
  }

  color(color : string) : LiturgicalColor {
    return COLORS[color];
  }
}

export const COLORS = {
  Green: {
    name: "green",
    hex: "#409940"
  },
  Gold: {
    name: "gold",
    hex: "#a8943f",
    image: "https://modeoflife.files.wordpress.com/2012/03/holy-cross-justice-icon-of-the-resurrection.jpg"
  },
  White: {
    name: "white",
    hex: "#eeeee0",
    image: "http://1.bp.blogspot.com/-Dpw16o5gvMY/VnqoSSEa5GI/AAAAAAAA-10/ROsUY7D2scU/s1600/Nativity%2BIcon%2B7%2BEthiopian.jpg"
  },
  Purple: {
    name: "purple",
    hex: "#800080"
  },
  Blue: {
    name: "blue",
    hex: "#213a5e",
    image: "http://biltrix.files.wordpress.com/2013/04/352473166_4e136b3fc5.jpg?w=474"
  },
  Red: {
    name: "red",
    hex: "#ff1133"
  }
}

const adventCycle = {
    0: {
        week: 0,
        id: "last-after-pentecost",
        season: "OrdinaryTime",
        name: "Last Sunday after Pentecost",
        color: COLORS.Green
    },
    1: {
        week: 1,
        id: "first-advent",
        season: "Advent",
        name: "First Sunday of Advent",
        color: COLORS.Blue
    },
    2: {
        week: 2,
        id: "second-advent",
        season: "Advent",
        name: "Second Sunday of Advent",
        color: COLORS.Blue
    },
    3: {
        week: 3,
        id: "third-advent",
        season: "Advent",
        name: "Third Sunday of Advent",
        color: COLORS.Blue
    },
    4: {
        week: 4,
        id: "fourth-advent",
        season: "Advent",
        name: "Fourth Sunday of Advent",
        color: COLORS.Blue
    }
}

const christmasCycle = {
    0: {
        week: 0,
        id: "christmas",
        season: "Christmas",
        name: "Christmas",
        omit_the: true,
        color: COLORS.Gold
    },
    1: {
        week: 1,
        id: "1st-sunday-after-christmas",
        season: "Christmas",
        name: "First Sunday after Christmas",
        color: COLORS.Gold
    },
    2: {
        week: 2,
        id: "2nd-sunday-after-christmas",
        season: "Christmas",
        name: "Second Sunday after Christmas",
        color: COLORS.Gold
    }
}

const epiphanyCycle = {
    0: {
        week: 0,
        id: "epiphany",
        season: "Epiphany",
        name: "Epiphany",
        color: COLORS.Green
    },
    1: {
        week: 1,
        id: "1st-epiphany",
        season: "Epiphany",
        name: "First Sunday after the Epiphany",
        color: COLORS.Green
    },
    2: {
        week: 2,
        id: "2nd-epiphany",
        season: "Epiphany",
        name: "Second Sunday after the Epiphany",
        color: COLORS.Green
    },
    3: {
        week: 3,
        id: "3rd-epiphany",
        season: "Epiphany",
        name: "Third Sunday after the Epiphany",
        color: COLORS.Green
    },
    4: {
        week: 4,
        id: "4th-epiphany",
        season: "Epiphany",
        name: "Fourth Sunday after the Epiphany",
        color: COLORS.Green
    },
    5: {
        week: 5,
        id: "5th-epiphany",
        season: "OrdinaryTime",
        name: "Fifth Sunday after the Epiphany",
        color: COLORS.Green
    },
    6: {
        week: 6,
        id: "6th-epiphany",
        season: "OrdinaryTime",
        name: "Sixth Sunday after the Epiphany",
        color: COLORS.Green
    },
    7: {
        week: 7,
        id: "7th-epiphany",
        season: "OrdinaryTime",
        name: "Seventh Sunday after the Epiphany",
        color: COLORS.Green
    },
    8: {
        week: 8,
        id: "8th-epiphany",
        season: "OrdinaryTime",
        name: "Eighth Sunday after the Epiphany",
        color: COLORS.Green
    }
}

const easterCycle = {
    0: {
        week: 0,
        id: "last-epiphany",
        season: "OrdinaryTime",
        name: "Last Sunday after the Epiphany",
        color: COLORS.Green
    },
    1: {
        week: 1,
        id: "1st-lent",
        season: "Lent",
        name: "First Sunday in Lent",
        color: COLORS.Purple
    },
    2: {
        week: 2,
        id: "2nd-lent",
        season: "Lent",
        name: "Second Sunday in Lent",
        color: COLORS.Purple
    },
    3: {
        week: 3,
        id: "3rd-lent",
        season: "Lent",
        name: "Third Sunday in Lent",
        color: COLORS.Purple
    },
    4: {
        week: 4,
        id: "4th-lent",
        season: "Lent",
        name: "Fourth Sunday in Lent",
        color: COLORS.Purple
    },
    5: {
        week: 5,
        id: "5th-lent",
        season: "Lent",
        name: "Fifth Sunday in Lent",
        color: COLORS.Purple
    },
    6: {
        week: 6,
        id: "holy-week",
        season: "HolyWeek",
        name: "Palm Sunday",
        omit_the: true,
        color: COLORS.Red
    },
    7: {
        week: 7,
        id: "easter",
        season: "Easter",
        name: "Easter Day",
        omit_the: true,
        color: COLORS.Gold
    },
    8: {
        week: 8,
        id: "2nd-easter",
        season: "Easter",
        name: "Second Sunday of Easter",
        color: COLORS.Gold
    },
    9: {
        week: 9,
        id: "3rd-easter",
        season: "Easter",
        name: "Third Sunday of Easter",
        color: COLORS.Gold
    },
    10: {
        week: 10,
        id: "4th-easter",
        season: "Easter",
        name: "Fourth Sunday of Easter",
        color: COLORS.Gold
    },
    11: {
        week: 11,
        id: "5th-easter",
        season: "Easter",
        name: "Fifth Sunday of Easter",
        color: COLORS.Gold
    },
    12: {
        week: 12,
        id: "6th-easter",
        season: "Easter",
        name: "Sixth Sunday of Easter",
        color: COLORS.Gold
    },
    13: {
        week: 13,
        id: "7th-easter",
        season: "Easter",
        name: "Seventh Sunday of Easter",
        color: COLORS.Gold
    },
    14: {
        week: 14,
        id: "pentecost",
        season: "OrdinaryTime",
        name: "Pentecost",
        omit_the: true,
        color: COLORS.Green
    },
    15: {
        week: 15,
        id: "trinity-sunday",
        season: "OrdinaryTime",
        name: "First Sunday after Pentecost",
        color: COLORS.Green
    },
    16: {
        week: 16,
        id: "2nd-pentecost",
        season: "OrdinaryTime",
        name: "Second Sunday after Pentecost",
        color: COLORS.Green
    },
    17: {
        week: 17,
        id: "3rd-pentecost",
        season: "OrdinaryTime",
        name: "Third Sunday after Pentecost",
        color: COLORS.Green
    },
    18: {
        week: 18,
        id: "4th-pentecost",
        season: "OrdinaryTime",
        name: "Fourth Sunday after Pentecost",
        color: COLORS.Green
    },
    19: {
        week: 19,
        id: "5th-pentecost",
        season: "OrdinaryTime",
        name: "Fifth Sunday after Pentecost",
        color: COLORS.Green
    },
    20: {
        week: 20,
        id: "6th-pentecost",
        season: "OrdinaryTime",
        name: "Sixth Sunday after Pentecost",
        color: COLORS.Green
    },
    21: {
        week: 21,
        id: "7th-pentecost",
        season: "OrdinaryTime",
        name: "Seventh Sunday after Pentecost",
        color: COLORS.Green
    },
    22: {
        week: 22,
        id: "8th-pentecost",
        season: "OrdinaryTime",
        name: "Eighth Sunday after Pentecost",
        color: COLORS.Green
    },
    23: {
        week: 23,
        id: "9th-pentecost",
        season: "OrdinaryTime",
        name: "Ninth Sunday after Pentecost",
        color: COLORS.Green
    },
    24: {
        week: 24,
        id: "10th-pentecost",
        season: "OrdinaryTime",
        name: "Tenth Sunday after Pentecost",
        color: COLORS.Green
    },
    25: {
        week: 25,
        id: "11th-pentecost",
        season: "OrdinaryTime",
        name: "Eleventh Sunday after Pentecost",
        color: COLORS.Green
    },
    26: {
        week: 26,
        id: "12th-pentecost",
        season: "OrdinaryTime",
        name: "Twelfth Sunday after Pentecost",
        color: COLORS.Green
    },
    27: {
        week: 27,
        id: "13th-pentecost",
        season: "OrdinaryTime",
        name: "Thirteenth Sunday after Pentecost",
        color: COLORS.Green
    },
    28: {
        week: 28,
        id: "14th-pentecost",
        season: "OrdinaryTime",
        name: "Fourteenth Sunday after Pentecost",
        color: COLORS.Green
    },
    29: {
        week: 29,
        id: "15th-pentecost",
        season: "OrdinaryTime",
        name: "Fifteenth Sunday after Pentecost",
        color: COLORS.Green
    },
    30: {
        week: 30,
        id: "16th-pentecost",
        season: "OrdinaryTime",
        name: "Sixteenth Sunday after Pentecost",
        color: COLORS.Green
    },
    31: {
        week: 31,
        id: "17th-pentecost",
        season: "OrdinaryTime",
        name: "Seventeenth Sunday after Pentecost",
        color: COLORS.Green
    },
    32: {
        week: 32,
        id: "18th-pentecost",
        season: "OrdinaryTime",
        name: "Eighteenth Sunday after Pentecost",
        color: COLORS.Green
    },
    33: {
        week: 33,
        id: "19th-pentecost",
        season: "OrdinaryTime",
        name: "Nineteenth Sunday after Pentecost",
        color: COLORS.Green
    },
    34: {
        week: 34,
        id: "20th-pentecost",
        season: "OrdinaryTime",
        name: "Twentieth Sunday after Pentecost",
        color: COLORS.Green
    },
    35: {
        week: 35,
        id: "21st-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-First Sunday after Pentecost",
        color: COLORS.Green
    },
    36: {
        week: 36,
        id: "22nd-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-Second Sunday after Pentecost",
        color: COLORS.Green
    },
    37: {
        week: 37,
        id: "23rd-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-Third Sunday after Pentecost",
        color: COLORS.Green
    },
    38: {
        week: 38,
        id: "24th-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-Fourth Sunday after Pentecost",
        color: COLORS.Green
    },
    39: {
        week: 39,
        id: "25th-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-Fifth Sunday after Pentecost",
        color: COLORS.Green
    },
    40: {
        week: 40,
        id: "26th-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-Sixth Sunday after Pentecost",
        color: COLORS.Green
    },
    41: {
        week: 41,
        id: "27th-pentecost",
        season: "OrdinaryTime",
        name: "Twenty-Seventh Sunday after Pentecost",
        color: COLORS.Green
    },
}
