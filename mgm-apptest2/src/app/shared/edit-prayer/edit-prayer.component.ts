import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Prayer } from '../../models/prayer.model';
import { PrayerService } from '../../services/prayer.service';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'venite-edit-prayer',
  templateUrl: './edit-prayer.component.html',
  styleUrls: ['./edit-prayer.component.scss'],
})
export class EditPrayerComponent implements OnInit {
  @Input() prayer : Prayer;
  @Input() canTranslate : boolean = false;
  @Output() translate : EventEmitter<Prayer> = new EventEmitter();
  @Output() saved : EventEmitter<boolean> = new EventEmitter();
  saving : boolean = false;

  faLanguage = faLanguage;

  constructor(
    private service : PrayerService,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    if(!this.prayer) {
      this.prayer = new Prayer();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.prayer = data);
      }
    });
  }

  save(prayer : Prayer) {
    console.log('Saving: ', prayer);
    this.saving = true;
    // if has id, then update existing
    if(prayer.id) {
      this.service.update(prayer.id, prayer).subscribe(r => {
        this.saving = false;
        console.log('Saved: ', r)
      });
    } else {
      // if no id, create new
      this.service.save(prayer).subscribe(r => {
        this.saving = false;
        this.prayer = r;
      });
    }

  }

  appendAfter(ii : number, list : any[], insert: any) {
    if(!list) {
      list = new Array();
    }
    list.splice(ii+1, 0, insert);
  }

  remove(ii : number, list : any[]) {
    list.splice(ii, 1);
  }

  replaceNewline(text : string, index : number) {
    this.prayer.value[index] = text.replace(/\n/g, ' ');
  }

  trackByIndex(index, item) {
    return index; // or item.id
  }

  isPreces() : boolean {
    return this.prayer.value && this.prayer.value[0].hasOwnProperty('label');
  }
  isLitany() : boolean {
    return (this.prayer.type == 'litany' || this.prayer.type == 'responsive') &&
           this.prayer.value &&
           (!!this.prayer.response || Array.isArray(this.prayer.value[0]));
  }

  initLitany() {
    let blank = this.prayer.response ? new Array('line') : new Array('line', 'response');
    this.prayer.value = new Array(blank);
  }
  addLitanyLine(index : number, list : any[]) {
    let blank = this.prayer.response ? new Array('line') : new Array('line', 'response');
    this.appendAfter(index, list, blank);
  }
  addPrecesLine(index : number, list : any[]) {
    this.appendAfter(index, list, {"label": "", "text": ""});
  }
  initPreces() {
    this.prayer.value = new Array({"label":"V:","text":""}, {"label":"R:","text":""})
  }
  initValue() {
    this.prayer.value = new Array('');
  }

  emit(prayer : Prayer) {
    this.translate.emit(prayer);
  }
}
