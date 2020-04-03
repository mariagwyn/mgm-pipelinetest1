import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectedTextEvent, SelectableCitation } from '../models/selection.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  selection$ : Subject<SelectedTextEvent> = new Subject();
  selects : SelectData[] = new Array();
  undoneSelects : SelectData[] = new Array();
  canUndo$ : Subject<boolean> = new Subject();
  canRedo$ : Subject<boolean> = new Subject();

  constructor() { }

  next(selection : SelectedTextEvent) {
    this.selection$.next(selection);
  }

  selections() : Subject<SelectedTextEvent> {
    return this.selection$;
  }

  add(el : HTMLElement, citation : SelectableCitation, text : string) {
    let r = new Range();
    r.selectNodeContents(el);
    this.selects.push({citation, id: el.id, text, el});
    this.selects.sort(this.documentPositionComparator);
    this.updateSelection();
    this.canRedo$.next(this.undoneSelects.length > 0);
    this.canUndo$.next(this.selects.length > 0);
  }

  undo() {
    let undone = this.selects.pop();
    console.log('selects now = ', this.selects);
    this.undoneSelects.push(undone);
    this.canUndo$.next(this.selects.length > 0);
    this.canRedo$.next(this.undoneSelects.length > 0);
    this.updateSelection();
  }

  redo() {
    let redone = this.undoneSelects.pop();
    this.selects.push(redone);
    this.canRedo$.next(this.undoneSelects.length > 0);
    this.canUndo$.next(this.selects.length > 0);
    this.updateSelection();
  }

  undoable() : Subject<boolean> {
    return this.canUndo$;
  }

  redoable() : Subject<boolean> {
    return this.canRedo$;
  }

  getCitation(selects : SelectData[]) : string {
    let citations : SelectableCitation[] = selects.map(s => s.citation);

    let currentBook : string,
        startingChapter : string,
        startingVerse : string,
        compiledCitations : string[] = new Array(),
        bookFrags : string[] = new Array(),
        chapterFrags : string[] = new Array();
    citations.forEach((cite, index) => {
      if(!cite.hasOwnProperty('book')) {
        compiledCitations.push(cite.string || cite.label || null);

        if(bookFrags && chapterFrags && bookFrags.length > 0 && chapterFrags.length > 0) {
          bookFrags.push(`${startingChapter}:${chapterFrags.join(', ')}`);
          compiledCitations.push(`${currentBook} ${bookFrags.join('; ')}`);
        }

        currentBook = startingChapter = startingVerse = undefined;
        chapterFrags = new Array();
        bookFrags = new Array();
      } else {
        if(!currentBook) {
          currentBook = cite.book;
        }
        if(!startingChapter) {
          startingChapter = cite.chapter;
        }
        if(!startingVerse) {
          startingVerse = cite.verse;
        }

        if(cite.book !== currentBook) {
          bookFrags.push(`${startingChapter}:${chapterFrags.join(', ')}`);
          compiledCitations.push(`${currentBook} ${bookFrags.join('; ')}`);
          currentBook = cite.book;
          startingChapter = cite.chapter;
          startingVerse = cite.verse;
          chapterFrags = new Array();
          bookFrags = new Array();
        }
        if(cite.chapter !== startingChapter) {
          bookFrags.push(`${startingChapter}:${chapterFrags.join(', ')}`);
          console.log('bookFrags = ', bookFrags)
          startingVerse = cite.verse;
          startingChapter = cite.chapter;
          chapterFrags = new Array();
        }

        let range : string = cite.verse == startingVerse ? cite.verse : `${startingVerse}-${cite.verse}`;
        let nextVerse = citations[index + 1];
        if(!nextVerse) {
          chapterFrags.push(range);
          bookFrags.push(`${startingChapter}:${chapterFrags.join(', ')}`);
        } else if(parseInt(nextVerse.verse) - parseInt(cite.verse) > 1 || nextVerse.chapter !== startingChapter) {
          chapterFrags.push(range);
          startingVerse = undefined;
        }
      }
    });
    if(currentBook && bookFrags && bookFrags.length > 0) {
      compiledCitations.push(`${currentBook} ${bookFrags.join('; ')}`)
    }

    return compiledCitations
      .filter(s => !!s)
      .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], [])
      .join('; ');
  }

  updateSelection() {
    let ids = this.selects.map(s => s.id),
        text = this.selects.map(s => s.text).join(' '),
        fragment = this.selects.map(s => s.id).filter(s => !!s)[0],
        citation = this.getCitation(this.selects);

    Array.from(document.getElementsByClassName('venite-selected'))
      .forEach(el => {
        if(!ids.includes(el.id)) {
          el.classList.remove('venite-selected');
        }
      });
    this.selects.forEach(s => {
      s.el.classList.add('venite-selected')
    });

    this.next({text, fragment, citation, ids});
    console.log('[SelectionService] next()', {text, fragment, citation, ids});
  }

  clear() {
    Array.from(document.getElementsByClassName('venite-selected'))
      .forEach(el => {
        el.classList.remove('venite-selected');
      });
    this.selects = new Array();
    this.next(undefined);
  }

  documentPositionComparator(aSel : SelectData, bSel : SelectData) {
    let a = aSel.el, b = bSel.el;

    if (a === b) {
      return 0;
    }

    var position = a.compareDocumentPosition(b);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return -1;
    } else if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
      return 1;
    } else {
      return 0;
    }
  }
}

export class SelectData { citation: SelectableCitation; id: string; text: string; el: HTMLElement }
