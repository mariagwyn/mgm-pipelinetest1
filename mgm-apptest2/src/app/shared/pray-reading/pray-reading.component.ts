import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Verse } from '../../models/bible-reading.model';
import { BibleService } from '../../services/bible.service';
import { BibleReading } from '../../models/bible-reading.model';

@Component({
  selector: 'venite-pray-reading',
  templateUrl: './pray-reading.component.html',
  styleUrls: ['./pray-reading.component.sass']
})
export class PrayReadingComponent implements OnInit {
  @Input() uid : string;
  @Input() language : string;
  @Input() value : string[];
  @Input() verses : Verse[][];
  @Input() citation : string;
  @Input() version : string = 'NRSV';
  @Input() eucharistic_intro : boolean = false;
  @Input() labelled_reading : boolean = false;
  @Input() bulletinEditor = false;
  @Input() label : string;
  @Output() readingLoaded : EventEmitter<BibleReading> = new EventEmitter();
  dir : string = 'ltr';
  compiledValue : string[][];
  changingReading : boolean = false;
  bookName : string;
  fullBookName : string;

  constructor(private bible : BibleService, private toast : ToastController) { }

  async ngOnInit() {
    if(this.citation && !(this.verses || this.value)) {
      console.log(`loading ${this.citation} (${this.version}) remotely`);
      this.getText();
    }
    this.bookName = this.citation.split(' ')[0];
    this.fullBookName = this.bible.bookNameFromAbbrev(this.bookName);
    this.setUpReading();
  }

  getText() {
    this.bible.getText(this.citation, this.version)
      .subscribe(
        data => {
          console.log('bible reading: ', data);
          this.verses = data.verses;
          this.value = data.value;
          this.language = data.language;
          data.eucharistic_intro = this.eucharistic_intro;
          data.labelled_reading = this.labelled_reading;
          data.label = this.label || data.label;
          this.readingLoaded.emit(data);
          this.setUpReading();
        },
        async error => {
          const toast = await this.toast.create({
            message: `We had difficulty trying to load ${this.citation} (${this.version}) from our Bible API.`,
            duration: 5000,
            color: 'danger'
          });
          toast.present();
        }
      );
  }

  setLabel() {
    // move this into Bible service and refactor from SpeechService
    //let updatedLabel : string;
    //try {
    //  let citation : BCV = this.bible.parseCitation(obj.label);
    //  let bookName : string = this.bible.bookNameFromAbbrev(citation.book),
    //      chapterNth : string = this.ordinal_suffix_of(citation.chapter),
    //      verseNth : string = this.ordinal_suffix_of(citation.verse);
    //  updatedLabel = `A Reading from ${bookName}, the ${chapterNth} chapter, beginning at the ${verseNth} verse.`;
    //} catch(e) {
    //  console.error(e);
    //  updatedLabel = obj.label;
    //}
  }

  setUpReading() {
    if(this.language == 'he') {
      this.dir = 'rtl';
    }

    if(!this.verses && this.value) {
      this.compiledValue = this.value
        .map((s, index) => s.match(/[\w‘’“”\n ]+([^\w‘’“”\n ])/g));
    }
  }

  readingMenu() {
    this.changingReading = true;
  }

  changeReading(event) {
    this.citation = event.detail.value;
    this.verses = undefined;
    this.value = undefined;
    this.getText();
  }

}
