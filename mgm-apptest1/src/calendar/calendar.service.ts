import { Injectable } from '@nestjs/common';
import { SeasonService } from '../season/season.service';
import { HolydayService } from '../holyday/holyday.service';
import { LiturgicalWeek } from '../season/season.model';
import { HolyDay } from '../holyday/holyday.model';
import { LiturgicalDay } from './calendar.model';

const ONE_WEEK : number = 7*24*60*60*1000;

@Injectable()
export class CalendarService {
  constructor(
    private readonly seasonService: SeasonService,
    private readonly holydayService : HolydayService
  ) {}

  // main functions: get a liturgical day and week from date
  liturgicalDay(date : Date, evening : boolean = false, vigil : boolean = false) : LiturgicalDay {
    let week = this.liturgicalWeek(date),
        weekdayName = WEEKDAYS[date.getDay()],
        slug = `${weekdayName.toLowerCase()}-${week.id}`,
        propersSlug = week.proper ? `${weekdayName.toLowerCase()}-${week.proper.slug}` : slug,
        special = this.holydayService.specialDay(slug),
        feast = this.holydayService.feastDate(date);

    if(feast && feast.evening && evening == true) {
      feast = feast.evening;
    } else if(feast && feast.eve && evening == true) {
      feast = feast;
    } else if(feast && feast.eve && evening != true) {
      feast = null;
    }
    if(special && special.evening && evening == true) {
      special = special.evening;
    } else if(special && special.eve && evening == true) {
      special = special;
    } else if(special && special.eve && evening != true) {
      special = null;
    }

    let observed = this.observedDay(date, week, special, feast);

    if(vigil) {
      console.log('vigil', vigil);
      const DAY = 60 * 60 * 24 * 1000,
            tomorrowDate = new Date(date.getTime() + DAY),
            tomorrowWeek = this.liturgicalWeek(tomorrowDate),
            tomorrowWeekday = WEEKDAYS[tomorrowDate.getDay()],
            tomorrowSlug = `${tomorrowWeekday.toLowerCase()}-${tomorrowWeek.id}`,
            tomorrowSpecial = this.holydayService.specialDay(slug),
            tomorrowFeast = this.holydayService.feastDate(date);
      console.log(tomorrowDate, tomorrowWeek, tomorrowSlug);
      observed = this.observedDay(tomorrowDate, tomorrowWeek, tomorrowSpecial, tomorrowFeast);
      console.log('observed = ', observed);
      observed.slug = observed.slug || tomorrowSlug;
      week.propers = tomorrowWeek.propers;
    }

    const observedSlug = (observed && observed.slug) ? observed.slug : slug;

    if(observedSlug !== slug) {
      console.log(`overriding propersSlug '${propersSlug}' with observedSlug '${observedSlug}'`);
      propersSlug = observedSlug;
    }

    let color = observed.color;
    if(observed.image) {
      color.image = observed.image;
    }
    if(observed.imageUrl) {
      color.imageUrl = observed.imageUrl;
    }

    let officeYear = this.dailyOfficeYear(date, week);

    return {
      date,
      evening,
      slug: observedSlug,
      propers: propersSlug,
      week,
      years: { "bcp1979_daily_office": officeYear, "bcp1979_daily_psalms": officeYear },
      holy_days: [special, feast],
      season: observed.season,
      omit_the: week.omit_the,
      color
    }
  }

  observedDay(date : Date, week : LiturgicalWeek, special : HolyDay, feast : HolyDay) : LiturgicalWeek|HolyDay {
    // rank: Principal Feast (5), Sunday (4), Holy Day (3), weekday (2)
    if(date.getDay() == 0) {
      week.type = { name: "Sunday", rank: 4 }
    } else {
      week.type = { name: "Weekday", rank: 1}
    }

    let sorted = [week, special, feast].sort((a, b) => {
      let aRank = (a && a.type && a.type.rank) ? a.type.rank : 3;
      let bRank = (b && b.type && b.type.rank) ? b.type.rank : 3;
      return bRank - aRank;
    });

    return sorted[0] ? sorted[0] : week;
  }

  dailyOfficeYear(date : Date, week : LiturgicalWeek) {
    // The Daily Office Lectionary is arranged in a two-year cycle. Year One
    // begins on the First Sunday of Advent preceding odd-numbered years, and
    // Year Two begins on the First Sunday of Advent preceding even-numbered
    // years.  (Thus, on the First Sunday of Advent, 1976, the Lectionary for
    // Year One is begun.)
    var D = [1, 2],
        year;
    // if Advent or December, use this year
    if(week.season === "Advent" || date.getMonth()+1 == 12) {
      year = date.getFullYear();
    } else {
      year = date.getFullYear()-1;
    }
    return D[year % 2];
  }

  liturgicalWeek(d : Date) : LiturgicalWeek {
    let date = new Date(d.getTime()); // avoid overwriting existing Date passed in
    let year : number = date.getFullYear(),
        easter : Date = this.easterInYear(year),
        christmas : Date = this.christmasInYear(year),
        christmasEve : Date = new Date(year, 11, 24),
        last_epiphany : Date = this.sundayBefore(new Date(easter.getTime()-6.9*ONE_WEEK)),
        fourth_advent : Date = this.sundayBefore(christmasEve),
        first_advent : Date = this.sundayBefore(new Date(fourth_advent.getTime()-2.9*ONE_WEEK)),
        last_pentecost : Date = this.sundayBefore(new Date(fourth_advent.getTime()-3.9*ONE_WEEK));

    let week : LiturgicalWeek;

    if(date >= last_pentecost || date < last_epiphany) {
      week = this.christmasCycleWeek(date);
    } else {
      week = this.easterCycleWeek(date);
    }

    //week.collect = week.proper ? collects[week.proper.slug] : collects[week.id]; <= TODO

    return week;
  }

  easterCycleWeek(date : Date) : LiturgicalWeek {
    let weeks : number = Math.round(this.weeksFromEaster(this.sundayBefore(date))+7);
    let w = this.seasonService.easterCycle(weeks);
    console.log(w);
    // If we're after Pentecost, use Proper ___
    if(weeks >= 14) {
       w = this.addProper(date, w);
    };
    console.log(w);
    w.propers = w.proper ? w.proper.slug : w.id;
    return w;
  }

  christmasCycleWeek(date : Date) : LiturgicalWeek {
    // For dates in January, Christmas year was a year earlier
    date = this.dateOnly(date);

    let xmasYear : number = date.getMonth() >= 10 ? date.getFullYear() : date.getFullYear()-1,
        xmas : Date = new Date(xmasYear, 11, 25),
        xmasEve : Date = new Date(xmasYear, 11, 24),
        epiphany : Date = new Date(xmasYear+1, 0, 6);

    let week : LiturgicalWeek;

    // If in Advent...
    if(date <= xmasEve) {
      // Have to calculate from Christmas Eve in case Christmas is a Sunday
      let fourthAdv = this.sundayBefore(xmasEve),
          weeksFromFourthAdv = (this.sundayBefore(date).getTime()-fourthAdv.getTime())/ONE_WEEK;
      week = this.seasonService.adventCycle(Math.round(weeksFromFourthAdv)+4);
      if(week.id == "last-after-pentecost") {
        week = this.addProper(date, week);
        week.propers = week.id;
      }
    } else if(date > xmasEve && date < epiphany) {
      // Christmas, between Christmas and Epiphany
      let weeksFromXmas = (date.getTime()-this.sundayBefore(xmas).getTime())/ONE_WEEK;
      week = this.seasonService.christmasCycle(Math.floor(weeksFromXmas))
    } else {
      // Epiphany
      let weeksFromEpiphany = (date.getTime()-this.sundayBefore(epiphany).getTime())/ONE_WEEK;
      week = this.seasonService.epiphanyCycle(Math.floor(weeksFromEpiphany));
    }
    week.propers = week.proper ? week.proper.slug : week.id;
    return week;
  }

  // propers for weeks after Pentecost
  addProper(date : Date, w: LiturgicalWeek) : LiturgicalWeek {
  	let lastSunday : Date = this.sundayBefore(date);
  	let p;
  	for(let ii = 0; ii < PROPERS.length-1; ii++) {
  		if(this.closerThan(lastSunday, PROPERS[ii], PROPERS[ii+1])) {
  			p = ii + 1;
  			break;
  		}
  	}

  	// set propers from p
    w.proper = { proper: p, slug: `proper-${p}`, label: `Proper ${p}` };
    w.propers = w.proper.slug;
    return w;
  }

  closerThan(date : Date, mmdd1 : string, mmdd2 : string) : boolean {
    // mmdd1 and mmdd2 are format "May 11" : string
    let [mm1, dd1] = mmdd1.split("/"),
        [mm2, dd2] = mmdd2.split("/"),
        d1 = this.dateFromYMD(date.getFullYear().toString(), mm1, dd1),
        d2 = this.dateFromYMD(date.getFullYear().toString(), mm2, dd2);
    // is mmdd1 closer than mmdd2 to date?
    return (Math.abs(date.getTime() - d1.getTime()) < Math.abs(date.getTime() - d2.getTime()));
  }

  // strip away everything but year, month, day
  dateOnly(d : Date) : Date {
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }

  // return date from year, month (1-12), and day
  // defaults to today if any of fields are undefined
  dateFromYMD(year : string, month : string, day : string) : Date {
    let d : Date = new Date();
    d = this.dateOnly(d);
    if(year && month && day) {
      d.setFullYear(parseInt(year));
      d.setMonth(parseInt(month)-1, parseInt(day));
    }
    return d;
  }

  // returns date of the Sunday before the given date
  sundayBefore(date : Date) : Date {
    let s : Date = date;
    s.setDate(date.getDate() - date.getDay());
    s.setHours(0);
    s.setMinutes(0);
    s.setSeconds(0);
    s.setMilliseconds(0);
    return s;
  }

  // return dates for Christmas and Easter
  easterInYear(Y : number) : Date {
    // Computus - Meeus/Jones/Butcher algorithm
    let a = Y % 19,
        b = Math.floor(Y/100),
        c = Y % 100,
        d = Math.floor(b/4),
        e = b % 4,
        f = Math.floor((b+8)/25),
        g = Math.floor((b-f+1)/3),
        h = (19*a+b-d-g+15) % 30,
        i = Math.floor(c/4),
        k = c % 4,
        L = (32 + 2*e + 2*i - h - k) % 7,
        m = Math.floor((a+11*h+22*L)/451),
        month = Math.floor((h+L-7*m+114)/31),
        day = ((h+L-7*m+114) % 31) + 1;
    return new Date(Y, month-1, day);
  }

  christmasInYear(Y : number) : Date {
    return new Date(Y, 11, 25);
  }

  weeksFromEaster(date : Date) : number {
    return (date.getTime()-this.easterInYear(date.getFullYear()).getTime())/ONE_WEEK;
  }
}

const PROPERS : string[] = [
	"5/11",
	"5/18",
	"5/25",
	"6/1",
	"6/8",
	"6/15",
	"6/22",
	"6/29",
	"7/6",
	"7/13",
	"7/20",
	"7/27",
	"8/3",
	"8/10",
	"8/17",
	"8/24",
	"8/31",
	"9/7",
	"9/14",
	"9/21",
	"9/28",
	"10/5",
	"10/12",
	"10/19",
	"10/26",
	"11/2",
	"11/9",
	"11/16",
	"11/23"
]
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
