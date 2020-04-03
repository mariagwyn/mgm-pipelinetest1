import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Psalm } from '../models/psalm.model';

import { Observable } from 'rxjs';

import { bcv_parser } from 'bible-passage-reference-parser/js/en_bcv_parser';
import bookNames from '../models/bible-book-names.json';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  bcv = new bcv_parser;

  constructor(private http : HttpClient) {
    this.bcv.include_apocrypha(true);
    this.bcv.set_options(
      {
        "osis_compaction_strategy": "bcv",
        "consecutive_combination_strategy": "separate"
      }
    );
  }

  getPsalm(citation : string, version : string = 'BCP') : Observable<Psalm> {
    try {
      return this.http.get<Psalm>(`${environment.apiUrl}/bible/psalm/`, { params: { citation, version} });
    } catch(err) {
      return Observable.throw(err);
    }
  }

  getText(citation : string, version : string = 'NRSV') : Observable<any> {
    try {
      return this.http.get<Psalm>(`${environment.apiUrl}/bible/`, { params: { citation, version} });
    } catch(err) {
      return Observable.throw(err);
    }
  }

  parseCitation(text : string) : BCV {
    let [book, chapter, verse] = this.bcv.parse(text).osis().split(/[\-\,]/g)[0].split('.');
    return { book, chapter: parseInt(chapter), verse: parseInt(verse) };
  }

  bookNameFromAbbrev(a : string, lang : string = 'en') : string {
    let abbrev = a.replace(/\./g, ''),
        langNames = bookNames[lang],
        searchResult = langNames.find(book => book.name == abbrev || book.aliases.includes(abbrev) || book.name.includes(abbrev));
    console.log('found ', searchResult);
    return searchResult ? searchResult.name : abbrev;
  }

  getCitationText(s : string) {
    let updatedLabel;
    try {
      let citation : BCV = this.parseCitation(s);
      let bookName : string = this.bookNameFromAbbrev(citation.book),
          chapterNth : string = this.ordinal_suffix_of(citation.chapter),
          verseNth : string = this.ordinal_suffix_of(citation.verse);
      updatedLabel = `A Reading from ${bookName}, the ${chapterNth} chapter, beginning at the ${verseNth} verse.`;
    } catch(e) {
      console.error(e);
      updatedLabel = s;
    }
    return updatedLabel;
  }

  ordinal_suffix_of(i : number) : string {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return i + "st";
      }
      if (j == 2 && k != 12) {
          return i + "nd";
      }
      if (j == 3 && k != 13) {
          return i + "rd";
      }
      return i + "th";
  }
}

export class BCV {
  book: string;
  chapter: number;
  verse: number;
}
