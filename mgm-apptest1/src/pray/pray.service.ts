import { Injectable } from '@nestjs/common';
import { Liturgy, Section, Condition, ClientPreferences, PreferenceOption } from '../liturgy/liturgy.entity';
import { LiturgyService } from "../liturgy/liturgy.service";
import { PrayerService } from "../prayer/prayer.service";
import { Prayer } from "../prayer/prayer.entity";
import { LectionaryService } from "../lectionary/lectionary.service";
import { BibleService } from "../bible/bible.service";
import { BibleReading } from "../bible/bible.entity";
import { LiturgicalDay } from '../calendar/calendar.model';
import { Reading } from '../lectionary/lectionary.entity';
import { PsalmService } from '../psalm/psalm.service';
import { CollectService } from '../collect/collect.service';
import { Psalm } from '../psalm/psalm.entity';
import { Collect } from '../collect/collect.entity';
import { CompiledLiturgy, CompiledSection, CompiledOption, LiturgyObject } from './pray.model';
import { Not, In } from 'typeorm';

function rotate_by_day(date : Date, list : any[], increase_by : number = 0) {
  var day_diff_from_0 = Math.round((date.getTime()-(new Date(0)).getTime())/(1000*60*60*24));
  var offset = (day_diff_from_0 + increase_by) % list.length;
  return list[offset];
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

@Injectable()
export class PrayService {
  constructor(
    private readonly liturgyService : LiturgyService,
    private readonly prayerService : PrayerService,
    private readonly psalmService : PsalmService,
    private readonly lectionaryService : LectionaryService,
    private readonly bibleService : BibleService,
    private readonly collectService : CollectService
  ) {}

  async getPrayer(slug : string, language : string = 'en', version : string = 'bcp1979') : Promise<Prayer> {
    return this.prayerService.findOne({slug, language, version});
  }

  async getLiturgy(slug : string, language : string = 'en', version : string = 'Rite-II') : Promise<Liturgy> {
    let liturgy = await this.liturgyService.findOne({slug, language, version});
    if(!liturgy) {
      liturgy = await this.liturgyService.findOne({slug, language: 'en', version: 'Rite-II'});
    }
    return liturgy;
  }

  async getPsalm(slug : string, language: string, version : string[], date : Date) : Promise<LiturgyObject[]> {
    let number : string;
    if(slug.match(/Psalm \d+/g)) {
      number = slug.match(/\d+/)[0];
      slug = slug.split(':')[0].replace(' ', '_').toLowerCase();
    }

    let psalms : Psalm[] = await this.psalmService.find({slug, language, version: In(version)});
    if(!psalms || psalms.length == 0) {
      psalms = await this.psalmService.getPsalmMultiversion(number, version) || new Array();
    }

    return psalms.map(psalm => {
      let psalmObj : LiturgyObject = { type: "psalm" };
      Object.assign(psalmObj, psalm); // copy all attributes over

      psalmObj.version_label = psalmObj.version_label || psalmObj.version;

      // really only used for Magnificant antiphon object
      if(psalmObj.antiphon && psalmObj.antiphon instanceof Object) {
        let antiphonObj : Object = psalmObj.antiphon;
        let mmdd = `${date.getMonth()+1}/${date.getDate()}`;
        psalmObj.antiphon = antiphonObj[mmdd];
        return psalmObj;
      } else {
        return psalmObj;
      }
    });
  }

  async processPiece(piece : Condition, day : LiturgicalDay, season : string, date : Date, language : string, version : string[], addlVersions : string[] = []) : Promise<LiturgyObject[]> {
    // only include each property in query if defined
    const query = {
      ...piece.slug && { slug: piece.slug },
      ...piece.category && { category: piece.category },
      ...(season && !piece.category) && { category: season },
      language,
      version: In(version.concat(addlVersions))
    };

    let values : LiturgyObject[] = new Array();

    // access the appropriate service for a given type
    if(piece) {
      if(piece.type == "liturgy") {
        values = await this.prayerService.find(query);
      } else if(piece.type == "collect") {
        let collectObj : LiturgyObject = { type: "collect" },
            collect : Collect;
        if(!piece.slug) {
          collect = await this.collectService.findOne({slug: day.propers, language, version: In(version)});
          if(!collect) {
            collect = await this.collectService.findOne({slug: day.week.propers, language, version: In(version)});
          }
        } else {
          collect = await this.collectService.findOne({ slug: piece.slug, language, version: In(version) });
        }
        Object.assign(collectObj, collect);
        values = new Array(collectObj);
      } else if(piece.type == "psalm" || piece.type == "canticle" || piece.type == "invitatory") {
        let psalmObjs : LiturgyObject[] = await this.getPsalm(piece.slug, language, version.concat(piece.version || []), date);

        let antiphons = await this.prayerService.find({
          type: "antiphon",
          category: season,
          language: language,
          version: In(version)
        });
        let primaryVersionAntiphons = antiphons.filter(a => a.version == version[0]);
        let a = rotate_by_day(date, primaryVersionAntiphons.length > 0 ? primaryVersionAntiphons : antiphons);

        psalmObjs.forEach(psalmObj => {
          if(piece.citation) {
            psalmObj.citation = piece.citation;
          }
          if(piece.antiphon && !psalmObj.antiphon) {
            if(piece.antiphon == "seasonal") {
              psalmObj.antiphon = a ? a.value : undefined;
            } else {
              psalmObj.antiphon = piece.antiphon;
            }
          }
          if(piece.type == "canticle" && psalmObj.antiphon) {
            // this occurs w/ e.g., Nunc dimittis in Compline and Magnificant with O antiphons
            let a : LiturgyObject = { type: "antiphon", value: new Array(psalmObj.antiphon) };
            values = values.concat(new Array(a).concat(psalmObjs).concat(a));
          } else {
            values.push(psalmObj);
          }
        });
      }
      for(let value of values || []) {
        value.label = value.label || piece.label;
      }
    }

    return await values;
  }

  getPreferenceOption(property: string, value : string|{ preference: string; }, liturgy : Liturgy, prefs : ClientPreferences) : PreferenceOption {
    if(value instanceof Object) {
      return liturgy.preferences[value['preference']].options.find(opt => opt.value == prefs[value['preference']]);
    } else if (liturgy.preferences.hasOwnProperty(property)) {
      return liturgy.preferences[property].options.find(opt => opt.value == value);
    } else {
      return { value };
    }
  }

  async processReadings(piece : Condition, type: "psalter"|"lectionary", date : Date, day : LiturgicalDay, liturgy : Liturgy, prefs : ClientPreferences) : Promise<Reading[]> {
    let appointed : Reading[],
        lectionaryValue : any = piece[type],
        chosenLectionaryPref : PreferenceOption = this.getPreferenceOption(type, lectionaryValue, liturgy, prefs),
        whichReading : PreferenceOption = this.getPreferenceOption('reading', piece['reading'], liturgy, prefs);

    if(chosenLectionaryPref.value == 'rclsunday') {
      appointed = (await this.lectionaryService.rcl(date)).filter(reading => reading.type == whichReading.value);
    } else if(chosenLectionaryPref.value == 'episcopal,rcl') {
      const episcopal = await this.lectionaryService.find({
        lectionary: 'episcopal',
        day: day.propers,
        type: whichReading.value
      }),
            rcl = (await this.lectionaryService.rcl(date)).filter(reading => reading.type == whichReading.value);
      appointed = episcopal.concat(rcl);
    } else if(chosenLectionaryPref.whentype && chosenLectionaryPref.whentype == "date") {
      appointed = await this.lectionaryService.find({
        lectionary: chosenLectionaryPref.value,
        whentype: "date",
        when: date.getDate(),
        type: whichReading.value
      });
    } else {

      let when = whichReading.alternateYear ? Not(day.years[chosenLectionaryPref.value]) : day.years[chosenLectionaryPref.value];

      appointed = await this.lectionaryService.find({
        lectionary: chosenLectionaryPref.value,
        day: day.propers,
        whentype: "year",
        when,
        type: whichReading.value
      });
    }

    return appointed;
  }

  async processPsalter(piece : Condition, date : Date, day : LiturgicalDay, liturgy : Liturgy, prefs : ClientPreferences) : Promise<LiturgyObject[]> {
    let appointed : Reading[] = await this.processReadings(piece, 'psalter', date, day, liturgy, prefs);
    console.log('Appointed Psalms: ', appointed);
    let items : LiturgyObject[] = new Array();
    for(let psalm of appointed) {
      const psalms = await this.getPsalm(psalm.citation, liturgy.language, new Array(prefs.psalterVersion).concat(liturgy.liturgyversions), date),
            preferredVersion = psalms.find(p => p.version == prefs.psalterVersion),
            p = preferredVersion || psalms[0];
      if(p && !psalm.citation.match(/^Psalm \d+$/)) {
        p.citation = psalm.citation;
      }
      items.push(p);
    }
    console.log('Psalms = ', items);
    return items;
  }

  async originalText(citation : string, allGreek: boolean = false) : Promise<BibleReading> {
    return this.bibleService.getOriginal(citation, allGreek);
  }

  async processLectionary(piece : Condition, date : Date, day : LiturgicalDay, liturgy : Liturgy, prefs : ClientPreferences) : Promise<LiturgyObject[]> {
    const bibleVersion : string = prefs.bibleVersion || 'NRSV';
    let citations : string[] = piece.citation ? new Array(piece.citation) : undefined;

    if(!citations) {
      let readings : Reading[] = await this.processReadings(piece, 'lectionary', date, day, liturgy, prefs),
          reading : Reading = await readings[0];
      citations = readings.map(r => r.citation);
    }

    if(citations) {
      let returns : LiturgyObject[][] = new Array();
      returns = await Promise.all(citations.map(async citation => {
        let skeleton : BibleReading = await this.bibleService.getSkeleton(citation, bibleVersion),
            bookName : string = citation.split(' ')[0];
        if(piece.eucharistic_intro && ['Matt.', 'Matthew', 'Mark', 'Luke', 'John'].includes(bookName)) {
          skeleton.label = piece.label || `(${citation})`;
          skeleton.eucharistic_intro = true;
        }
        if(piece.labelled_reading) {
          skeleton.label = piece.label;
          skeleton.labelled_reading = true;
        }
        if(prefs['original'] && prefs['original'] !== 'none') {
          let original : BibleReading = await this.originalText(citation, prefs['original'] == 'allgreek');
          let readings = new Array({
            type: "reading",
            label: piece.label ? `${piece.label} (${piece.citation} ${bibleVersion})` : skeleton.label,
            version_label: bibleVersion,
            pending: true,
            ... skeleton
          });
          if(original && original.label && original.version && original.language && original.value) {
            readings.push({
              type: "reading",
              label: piece.label ? `${piece.label} (${piece.citation} ${bibleVersion})` : skeleton.label,
              version_label: original.label.match(/\(([^\)]*)\)/)[0].split(/\(([^\)]*)\)/)[1],
              pending: false,
              ... original
            });
          }
          return readings;
        } else {
          return new Array({
            type: "reading",
            label: piece.label ? `${piece.label} (${piece.citation} ${bibleVersion})` : skeleton.label,
            version_label: bibleVersion,
            pending: true,
            ... skeleton
          });
        }
      }));
      return returns.flat();
    } else {
      return new Array();
    }
  }

  includeCondition(piece : any, day : LiturgicalDay, liturgy : Liturgy, prefs : ClientPreferences) : boolean {
    let include : boolean = true;
    // handle conditionals
    if(piece.condition) {
      // array of conditions -- AND them
      if(Array.isArray(piece.condition)) {
        let conditions : boolean[] = piece.condition.map(c => this.includeCondition(c, day, liturgy, prefs));
        return conditions.reduce((a, b) => a && b);
      }

      // single conditions
      if(piece.condition == "fixed") {
        include = true;
      } else if(piece.condition == "day") {
        let d : string = day.slug;
        if(piece.except) {
          include = !piece.except.includes(d);
        } else if(piece.only) {
          include = piece.only.includes(d);
        }
      } else if(piece.condition == "seasonal") {
        let season : string = day.season,
            baseSeason : string = day.week.season || season;
        if(piece.except) {
          include = !piece.except.includes(baseSeason);
        } else if(piece.only) {
          include = piece.only.includes(baseSeason);
        }
      } else if(piece.condition == "feastDay" || piece.condition == "ferialDay") {
        let highestFeastRank : number = Math.max(...day.holy_days.filter(a => !!a).map(a => a && a.type && a.type.rank ? a.type.rank : 3)),
            isSunday : boolean = day.date.getDay() == 0,
            isFeast : boolean = highestFeastRank > 3 || isSunday;
        return piece.condition == "feastDay" ? isFeast : !isFeast;
      } else if(piece.condition == "weekday") {
        let dayOfWeek : number = day.date.getDay(),
            days : string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if(piece.except) {
          include = !piece.except.includes(days[dayOfWeek]);
        } else if(piece.only) {
          include = piece.only.includes(days[dayOfWeek]);
        }
      } else if(piece.condition == "preference") {

        include = prefs[piece.preference] == piece.value;
      } else if(piece.condition == "!preference") {
        include = prefs[piece.preference] !== piece.value;
      } else if(piece.condition == "date") {
        let liturgyDate = day.date,
            dateString = piece.lt || piece.lte || piece.gt || piece.gte,
            [month, date] = dateString.split('/'),
            conditionDate = new Date(liturgyDate.getFullYear(), parseInt(month) - 1, parseInt(date));
        if(piece.lt) {
          include = liturgyDate.getTime() < conditionDate.getTime();
        } else if(piece.lte) {
          include = liturgyDate.getTime() <= conditionDate.getTime();
        } else if(piece.gt) {
          include = liturgyDate.getTime() > conditionDate.getTime();
        } else if(piece.gte) {
          include = liturgyDate.getTime() >= conditionDate.getTime();
        }
      }
    }
    return include;
  }

  async compileOption(
    piece : Condition,
    date : Date,
    day : LiturgicalDay,
    liturgy : Liturgy,
    season : string,
    compiledPrefs : ClientPreferences,
    rotate : boolean
  ) : Promise<LiturgyObject[]> {
    if(this.includeCondition(piece, day, liturgy, compiledPrefs)) {
      // if it passes the condition and is not a list of options, continue to process
      let seasonSearch : string;
      let objs : LiturgyObject[];
      // handle seasonal rotation
      if((piece.rotate && piece.rotate == "seasonal") || (piece.antiphon && piece.antiphon == "seasonal")) {
        seasonSearch = season;
      }

      if(piece.rotate_among) {
        piece.slug = rotate_by_day(date, piece.rotate_among);
      }

      if(piece.psalter) {
        // psalms
        objs = await this.processPsalter(piece, date, day, liturgy, compiledPrefs);
      } else if (piece.lectionary) {
        // lectionary readings
        objs = await this.processLectionary(piece, date, day, liturgy, compiledPrefs);
      } else {
        // everything else
        objs = await this.processPiece(piece, day, seasonSearch, date, liturgy.language, liturgy.liturgyversions, piece.version || []);
      }

      // handle daily rotation
      if(piece.rotate && rotate) {
        objs = new Array(rotate_by_day(date, objs, piece.offset || 0));
      }

      return objs;
    } else {
      return new Array();
    }
  }

  async compileCondition(
    piece : Condition,
    date : Date,
    day : LiturgicalDay,
    liturgy : Liturgy,
    season : string,
    compiledPrefs : ClientPreferences,
    rotate : boolean
  ) : Promise<CompiledOption[]> {
    // conditions first
    let objs : LiturgyObject[] = new Array(),
        include : boolean = this.includeCondition(piece, day, liturgy, compiledPrefs); // add each Condition by default

    if((piece.options) && include) {
      for(let option of piece.options) {
        let compiledOption : LiturgyObject[] = await this.compileOption(option, date, day, liturgy, season, compiledPrefs, rotate);
        if(compiledOption) {
          for(let obj of compiledOption) {
            objs.push(obj);
          }
        }
      }
      return new Array({ type: "option", label: piece.label ? piece.label : undefined, value: objs });
    } else if(piece.type && piece.type == "collect" && include) {
      let objs = await this.compileOption(piece, date, day, liturgy, season, compiledPrefs, rotate),
          options = new Array();
          (objs[0].value || new Array()).forEach((text, ii) => {
            const opt : LiturgyObject = { type: "collect" };

            Object.assign(objs[0], opt);
            opt.slug = objs[0].slug;
            opt.id = objs[0].id;
            opt.language = objs[0].language;
            opt.version = objs[0].version;
            opt.label = objs[0].label;
            opt.version_label = (ii + 1).toString();
            opt.value = new Array(text);
            options.push(opt);
          });
      return new Array({ type: "option", label: piece.label ? piece.label : undefined, value: options });
    } else if(piece.hasOwnProperty('lectionary')) {
      let objs = await this.compileOption(piece, date, day, liturgy, season, compiledPrefs, rotate);
      let compiled = new CompiledOption();
      compiled.type = 'option';
      compiled.value = objs.filter(o => (o.value && o.value[0] != '') || (o.verses && o.verses[0][0] != '') || o.type == 'reading');
      return new Array(compiled);
    } else if(include) {
      const objs = (await this.compileOption(piece, date, day, liturgy, season, compiledPrefs, rotate)).filter(obj => !!obj),
            uniqueSlugs = objs.filter(obj => !!obj)
                              .map(obj => obj.slug)
                              .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []),
            uniqueCategories = objs.filter(obj => !!obj)
                              .map(obj => obj.category || obj.slug)
                              .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []);
      // items that all have the same slug, i.e., items returned from multiple liturgyversions
      if(uniqueSlugs.length == 1 || uniqueCategories.length == 1 || piece.keepoptions) {
        const preferredVersion : string = liturgy.liturgyversions[0];
        // pop the item with preferred liturgy version first
        objs.unshift(objs.splice(objs.map(o => o.version).indexOf(preferredVersion), 1)[0]);
        return new Array({ type: "option", label: piece.label ? piece.label : undefined, value: objs });
      } else {
        // multiple, unrelated objects—leave them unrolled
        let unrolledOptions : CompiledOption[] = new Array();

        for(let obj of objs || new Array()) {
          unrolledOptions.push({ type: "option", label: piece.label ? piece.label : undefined, value: new Array(obj)});
        }
        return unrolledOptions;
      }
    }
  }

  async compileSection(
    section: Section,
    date : Date,
    day : LiturgicalDay,
    liturgy : Liturgy,
    season : string,
    compiledPrefs : ClientPreferences,
    rotate : boolean
  ) : Promise<CompiledSection> {
    // iterate over conditions
    let value : CompiledOption[] = new Array();

    for(let piece of section.value) {
      let objs = await this.compileCondition(piece, date, day, liturgy, season, compiledPrefs, rotate);

      // push the compiled Condition (now a LiturgyObject)
      for(let o of objs || []) { // objs will be undefined if it did not meet its condition
        value.push(o);
      }
    }

    // push the compiled section
    return {
      type: "section",
      label: section.label,
      value: value
    };
  }

  addUniqueIDs(sections : CompiledSection[]) : CompiledSection[] {
    let howmany = {};

    sections.filter(o => !!o).forEach(section => {
      section.value.filter(o => !!o).forEach(option => {
        option.value.filter(o => !!o).forEach(object => {
          let base : string;
          if(object && object.hasOwnProperty('slug')) {
            base = object.slug;
          } else {
            base = object.type;
          }

          if(!howmany[base]) {
            howmany[base] = 1;
            object.uid = base;
          } else {
            howmany[base]++;
            object.uid = `${base}-${howmany[base]}`;
          }
        });
      });
    });

    return sections;
  }

  async compileLiturgy(date : Date, day : LiturgicalDay, liturgy : Liturgy, clientPreferences : ClientPreferences, rotate) : Promise<CompiledSection[]> {
    // merge default and client-submitted preferences
    let compiledPrefs : ClientPreferences = JSON.parse(JSON.stringify(clientPreferences));
    for(let key in liturgy.preferences) {
      let clientValue : string = clientPreferences[key];
      let defaultValue : string = liturgy.preferences[key].options.filter(o => o.default).map(o => o.value)[0];
      let firstValue : string = liturgy.preferences[key].options.map(o => o.value)[0];
      compiledPrefs[key] = clientValue || defaultValue || firstValue;
    }

    // process liturgy
    let objects : CompiledSection[] = new Array();
    let season : string = day.season || day.week.season;
    for(let section of liturgy.value) {
      if(section && section.type && section.type == "supplement") {
        if(this.includeCondition(section, day, liturgy, clientPreferences)) {
          let supplementLiturgy = await this.getLiturgy(section.slug, liturgy.language, liturgy.version);
          if(!supplementLiturgy) {
            console.log('Not found. Searching in en/Rite-II');
            supplementLiturgy = await this.getLiturgy(section.slug, 'en', 'Rite-II');
          }
          console.log('compiledPrefs = ', compiledPrefs);
          const supplementSections = await this.compileLiturgy(date, day, supplementLiturgy, compiledPrefs, rotate);
          objects = objects.concat(supplementSections);
        }
      } else {
        objects.push(await this.compileSection(section, date, day, liturgy, season, compiledPrefs, rotate));
      }
    }

    return this.addUniqueIDs(objects);
  }
}
