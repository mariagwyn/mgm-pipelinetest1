import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibleReading, Verse } from './bible.entity';
import { Psalm } from '../psalm/psalm.entity';
import { parse, HTMLElement } from 'node-html-parser';
import { bcv_parser } from 'bible-passage-reference-parser/js/en_bcv_parser';

const NT_BOOKS = ['Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', 'Cor', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Thess', '1Thess', '2Thess', 'Tim', 'Tit', 'Heb', 'James', 'Pet', 'Jude', 'Rev'];
const OT_BOOKS = ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Jud', 'Ruth', 'Sam', 'King', 'Chron', 'Ezra', 'Neh', 'Est', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Ezek', 'Dan', 'Hos', 'Amos', 'Ob', 'Jon', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal'];

@Injectable()
export class BibleService {
  bcv = new bcv_parser;

  constructor(
    @InjectRepository(BibleReading)
    private readonly repo : Repository<BibleReading>,
    private readonly httpService : HttpService
  ) {
    this.bcv.include_apocrypha(true);
    this.bcv.set_options(
    {
      "osis_compaction_strategy": "bcv",
      "consecutive_combination_strategy": "separate"
    }
    );
  }


  // General repo methods
  create(reading : BibleReading) : Promise<BibleReading> {
    return this.repo.save(reading);
  }

  query(query : Object) : Promise<BibleReading[]> {
    return this.repo.find(query);
  }

  async getSkeleton(citation : string, version : string) {
    let skeleton = new BibleReading();
    skeleton.citation = citation;
    skeleton.version = version;
    return skeleton;
  }

  // Master function to find a text
  async get(citation : string, version : string) : Promise<BibleReading> {
    let cached : BibleReading = await this.repo.findOne({citation: citation, version: version});
    let delivered : BibleReading;
    if(cached && cached.verses && cached.verses.length > 0) {
      delivered = cached;
    } else if(version == 'ESV') {
      delivered = await this.getESV(citation);
    } else if(['KJV', 'NRSV', 'BCP', 'CW', 'LP'].includes(version.toUpperCase())) {
      delivered = await this.getOremus(citation, version);
    } else if(['ASV', 'DOUAYRHEIMS', 'BASICENGLISH', 'BHS', 'TEXT', 'LXX'].includes(version.toUpperCase())) {
      delivered = await this.getBibleNet(citation, version);
    } else if(cached) {
      delivered = cached;
    }
    if(!delivered) {
      delivered = await this.getOremus(citation, 'NRSV');

      if(!delivered || (delivered.value && delivered.value.length == 0) || (delivered.verses && delivered.verses[0].length == 0)) {
        console.error(`Yikes — seems like we couldn’t find ${citation} in ${version}`);
        delivered = new BibleReading();
        delivered.value = new Array(`[Yikes — seems like we couldn’t find ${citation} in ${version}!]`);
      }
    }
    return delivered;
  }

  async getOriginal(citation : string, allGreek : boolean = false) : Promise<BibleReading> {
    try {
      let [bookPart, versePart] = citation.split(':');
      versePart = versePart.replace(/[a-z]/g, '');
      citation = `${bookPart}:${versePart}`;
      let [book, chapter, verse] = this.bcv.parse(citation).osis().split(/[\-\,]/g)[0].split('.');
      if(NT_BOOKS.find(bookName => bookName.includes(book) || book.includes(bookName))) {
        return this.getBibleNet(citation, 'text');
      } else if(!allGreek) {
        return this.getBibleNet(citation, 'bhs');
      } else {
        return this.getBibleNet(citation, 'lxx');
      }
    } catch(e) {
      console.error(e);
      return undefined;
    }
  }

  // Access APIs for different versions
  async getESV(citation : string) : Promise<BibleReading> {
    // ESV access example
    // > curl -H 'Authorization: Token {{ YOUR_KEY }}' 'https://api.esv.org/v3/passage/text/?q=John+11:35'
    // https://api.esv.org/docs/passage-text/
    const ACCESS_TOKEN = '0944246351810bab2585914629c992f61f1c427f';

    // create BibleReading entity to a) save in DB cache and b) return
    let reading = new BibleReading();
    reading.citation = citation;
    reading.label = `A Reading from ${citation} (ESV)`;
    reading.language = 'en';
    reading.version = 'ESV';

    let resp = await this.httpService.get(`https://api.esv.org/v3/passage/text/`,
      {
        params: {
          'q': citation,
          'include-passage-references': false,
          'include-verse-numbers': true,
          'include-first-verse-numbers': true,
          'include-footnotes': false,
          'include-headings': false
        },
        headers: { 'Authorization': `Token ${ACCESS_TOKEN}` }
      }).toPromise();

    if(resp.status === 200 && resp.data.passages.length > 0) {

      // 'verses' field
      let [book, chapter, verse] = this.bcv.parse(citation).osis().split(/[\-\,]/g)[0].split('.');
      let verses : string[][] = resp.data.passages.map(passage => passage.match(/(\[\d+\])([^\[]*)/g));
      reading.verses = new Array();
      let lastVerse : Verse;
      verses.forEach((set, setIndex) => {
        let setVerses = new Array();
        set.forEach((line, lineIndex) => {
          let verse = line.match(/\[(\d+)\]/g)[0].replace(/[\[\]]/g, ''),
              text = line.replace(/\[(\d+)\]\s+/g, '').replace('(ESV)', '');

          if(lineIndex == 0 && setIndex > 0) {
            lastVerse = reading.verses[setIndex - 1][reading.verses[setIndex - 1].length - 1];
          } else if(lineIndex > 0) {
            lastVerse = setVerses[lineIndex - 1];
          }

          if(lastVerse && parseInt(lastVerse.verse) > parseInt(verse)) {
            chapter = (parseInt(lastVerse.chapter)+1).toString();
          }

          setVerses.push({ book, chapter, verse, text });
        });
        reading.verses.push(setVerses);
      });

      resp = await this.httpService.get(`https://api.esv.org/v3/passage/text/`,
        {
          params: {
            'q': citation,
            'include-passage-references': false,
            'include-verse-numbers': true,
            'include-first-verse-numbers': false,
            'include-footnotes': false,
            'include-headings': false
          },
          headers: { 'Authorization': `Token ${ACCESS_TOKEN}`}
        }).toPromise();

      // 'value' field
      reading.value = resp.data.passages
        .map(passage => passage.split(/\n\s*\n/g))
        .flat()
        .map(passage => passage.replace(/\n  /g, '\n')
                          .replace(/  /g, '\t')
                          .replace(/\n\t/g, '\n')
                          .replace('(ESV)', ''));
      this.repo.save(reading);
      return reading;
    } else {
      console.log(resp);
      return undefined;
    }
  }

  async getBibleNet(citation : string, version : string) : Promise<BibleReading> {
    // https://getbible.net/api
    let labels = {'KJV': 'KJV', 'ASV': 'ASV', 'DOUAYRHEIMS': 'Douay-Rheims', 'BASICENGLISH': 'BBE', 'BHS': 'Hebrew', 'TEXT': 'Greek', 'LXX': 'Septuagint'}
    let reading = new BibleReading();
    reading.citation = citation;
    reading.label = `A Reading from ${citation} (${labels[version.toUpperCase()]})`;
    if(version.toUpperCase() == 'BHS') {
      reading.language = 'he';
    } else if(['LXX', 'TEXT'].includes(version.toUpperCase())) {
      reading.language = 'el';
    } else {
      reading.language = 'en';
    }
    reading.version = version.toUpperCase();
    reading.verses = new Array(new Array());

    let resp = await this.httpService.get(`http://getbible.net/json`,
      {
        params: {
          'passage': citation,
          'version': version.toLowerCase()
        },
      }).toPromise();

    // getbible.net returns a JSONp object like ({ ... });

    if(resp.status === 200) {
      try {
        let text : string[] = new Array();
        let dto = JSON.parse(resp.data.slice(1, -2)),
            book = dto['book'];

        for(let chapterNum in book) {
          let chapter = book[chapterNum];
          for(let verseNum in chapter['chapter']) {
            let verse = chapter['chapter'][verseNum];
            text.push(verse['verse']);
            reading.verses[0].push({
              book: dto['book_name'],
              chapter: chapter['chapter_nr'].toString(),
              verse: verse['verse_nr'].toString(),
              text: verse['verse'].replace('\r\n', ' ')
            })
          }
        }
        reading.value = new Array(text.map(string => string.replace('\r\n', ' ')).join(''));
        //this.repo.save(reading);
        return reading;
      } catch(e) {
        console.error(e);
        return undefined;
      }
    } else {
      console.log(resp);
      return undefined;
    }
  }

  async getOremus(citation : string, version : string) : Promise<BibleReading> {
    // API: https://bible.oremus.org/api.html
//    let resp = await this.httpService.get(`http://bible.oremus.org/`,
//      {
//        params: {
//          'passage': citation,
//          'version': version.toUpperCase(),
//          'vnum': 'NO',
//          'fnote': 'NO',
//          'show_ref': 'NO',
//          'headings': 'NO'
//        },
//      }).toPromise();

//    let tree = parse(resp.data);
//    let text : string;

//    if(tree instanceof HTMLElement) {
//      let textEl = tree.querySelector('div.bibletext');
//      if(textEl) {
//        text = textEl.structuredText.replace(/\d+/g, '');
//      } else {
//        let nrsvaeResp = await this.httpService.get(`http://bible.oremus.org/`,
//          {
//            params: {
//              'passage': citation,
//              'version': 'NRSVAE',
//              'vnum': 'NO',
//              'fnote': 'NO',
//              'show_ref': 'NO',
//              'headings': 'NO'
//            },
//          }).toPromise();
//        tree = parse(nrsvaeResp.data);
//        if(tree instanceof HTMLElement) {
//          textEl = tree.querySelector('div.bibletext');
//          if(textEl) {
//            text = textEl.structuredText.replace(/\d+/g, '');
//          } else {
//            return undefined;
//          }
//        }
//      }
//    }
//

    let reading = new BibleReading();
    reading.citation = citation;
    reading.label = `A Reading from ${citation} (${version})`;
    reading.language = 'en';
    reading.version = version.toUpperCase();
    //console.log(reading);
//    reading.value = new Array(text);

    // verses
    let verseResp = await this.httpService.get(`http://bible.oremus.org/`,
      {
        params: {
          'passage': citation,
          'version': version.toUpperCase() == 'KJV' ? 'AV' : version.toUpperCase(),
          'fnote': 'NO',
          'show_ref': 'NO',
          'headings': 'NO'
        },
      }).toPromise();
    let verseTree = parse(verseResp.data);

    console.log(verseTree);

    if(verseTree instanceof HTMLElement) {
      let textEl = verseTree.querySelector('div.bibletext')

      if(!textEl) {
        let nrsvaeResp = await this.httpService.get(`http://bible.oremus.org/`,
          {
            params: {
              'passage': citation,
              'version': 'NRSVAE',
              'fnote': 'NO',
              'show_ref': 'NO',
              'headings': 'NO'
            },
          }).toPromise();
        verseTree = parse(nrsvaeResp.data);
        if(verseTree instanceof HTMLElement) {
          textEl = verseTree.querySelector('div.bibletext');
          if(!textEl) {
            return undefined;
          }
        }
      }

      let nodes = textEl.childNodes;

      let [book, chapter, verse] = this.bcv.parse(citation).osis().split(/[\-\,]/g)[0].split('.');
      let lastVerseNum : number;
      let verses : Verse[][] = new Array();

      nodes.forEach((paragraph, sectionIndex) => {
        if(!verses[sectionIndex]) {
          verses[sectionIndex] = new Array();
        }
        let verseTexts : string[] = new Array();
        paragraph.childNodes.forEach((child, childIndex) => {
          if(child instanceof HTMLElement && child.classNames.includes('cc')) {
            verses[sectionIndex].push({book, chapter, verse, text: verseTexts.join('')});
            verseTexts = new Array();
            chapter = child.text
            console.log('NEW CHAPTER: ', child.text);
            verse = "1";
          } else if(child instanceof HTMLElement && (child.classNames.includes('ww') || child.classNames.includes('ii') || child.classNames.includes('vnumVis'))) {
            verses[sectionIndex].push({book, chapter, verse, text: verseTexts.join('')});
            verseTexts = new Array();
            verse = child.text;
          } else if(child instanceof HTMLElement && child.classNames.includes('sectVis')) {
          } else if(child instanceof HTMLElement && child.tagName == 'a') {
          } else if(child instanceof HTMLElement && child.classNames.includes('sc')) {
            verseTexts.push(child.text.replace(/\n$/, ' ').toUpperCase());
          } else {
            console.log(child.text);
            verseTexts.push(child.text.replace(/\n$/, ' '));
          }
        });
        verses[sectionIndex].push({book, chapter, verse, text: verseTexts.join('')});
        verseTexts = new Array();
        verses[sectionIndex] = verses[sectionIndex].filter(v => !v.text.match(/^\s*$/));
      });
      reading.verses = verses.filter(section => section && section.length > 0 && !section[0].text.match(/^\s*$/));

    }

    //reading.value = reading.verses.map(section => section.map(verse => verse.text).join(''));

    this.repo.save(reading);

    return reading;
  }

  async getOremusPsalm(citation : string, version : string) : Promise<Psalm> {
    // API: https://bible.oremus.org/api.html
    let labels = {'BCP': 'coverdale'};
    if(version == 'coverdale') {
      version = 'BCP';
    }
    let resp = await this.httpService.get(`http://bible.oremus.org/`,
      {
        params: {
          'passage': citation,
          'version': version.toUpperCase(),
          'vnum': 'YES',
          'fnote': 'NO',
          'show_ref': 'YES',
          'headings': 'NO'
        },
      }).toPromise();

    let tree = parse(resp.data);

    let verses : string[][] = new Array();

    if(tree instanceof HTMLElement) {
      let nodes = tree.querySelector('div.bibletext p').childNodes;
      let currentVerseNumber : string,
          currentHalfVerse : string = '',
          currentVerse : string[] = new Array();
      nodes.forEach((child, childIndex) => {
        if(child instanceof HTMLElement && child.classNames.includes('cwvnum')) {
          // verse number has class 'cwvnum'
          if(currentVerse.length > 0) { // don't do it if this is the first verse
            // first, save current verse
            currentVerse.push(currentHalfVerse.trim());
            verses.push(currentVerse);
            // then, clear verse
            currentHalfVerse = '';
            currentVerse = new Array();
          }
          // finally, increment verse number and continue
          currentVerseNumber = child.text;
          currentVerse.push(currentVerseNumber);
        } else if(child.text.includes('*') || childIndex == nodes.length) {
          currentHalfVerse = currentHalfVerse.concat(child.text);
          currentVerse.push(currentHalfVerse.trim());
          currentHalfVerse = '';
        } else {
          currentHalfVerse = currentHalfVerse.concat(child.text);
        }
      });
      currentVerse.push(currentHalfVerse.trim());
      verses.push(currentVerse);
    }

    let p = new Psalm();
    p.slug = citation.replace(' ', '_').toLowerCase();
    p.language = 'en';
    p.version = labels[version];
    p.canticle = false;
    p.value = new Array(verses);

    //this.repo.save(p);

    return p;
  }
}
