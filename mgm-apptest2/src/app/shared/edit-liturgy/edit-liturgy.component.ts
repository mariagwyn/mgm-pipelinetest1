import { Component, Input, Output, OnInit, EventEmitter, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Liturgy, Preference, Preferences } from '../../models/liturgy.model';
import { LiturgyService } from '../../services/liturgy.service';

@Component({
  selector: 'venite-edit-liturgy',
  templateUrl: './edit-liturgy.component.html',
  styleUrls: ['./edit-liturgy.component.scss'],
})
export class EditLiturgyComponent implements OnInit {
  @Input() liturgy : Liturgy;
  @Input() canTranslate : boolean = false;
  @Output() saved : EventEmitter<boolean> = new EventEmitter();
  @Input() autofocus : boolean;

  prefsMap : { key: string; preference: Preference }[] = new Array();

  preferencesError : string;
  valueError : string;

  saving : boolean = false;

  constructor(
    private service : LiturgyService,
    private route : ActivatedRoute,
    private zone : NgZone
  ) { }

  ngOnInit() {
    if(!this.liturgy) {
      this.liturgy = new Liturgy();
      this.liturgy.liturgyversions = new Array();
      this.liturgy.preferences = new Preferences();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => {
          this.liturgy = data;
          console.log(this.liturgy.liturgyversions)
          if(!this.liturgy.liturgyversions) {
            this.liturgy.liturgyversions = new Array();
            console.log(this.liturgy.liturgyversions)
          }
          this.setPrefsMap();
        });
      }
    });

  }

  addLiturgyVersion(lv) {
    if(!this.liturgy.liturgyversions) {
      this.liturgy.liturgyversions = new Array();
    }
    this.zone.run(() => this.appendAfter(this.liturgy.liturgyversions.length-1, this.liturgy.liturgyversions, ''));
    console.log(this.liturgy.liturgyversions);
  }

  setPrefsMap() {
    if(!this.liturgy.preferences) {
      this.liturgy.preferences = new Preferences();
    }
    if(this.liturgy.preferences) {
      this.prefsMap = Object.keys(this.liturgy.preferences).map(key => {
        return { key, preference: this.liturgy.preferences[key] }
      });
    }
  }

  save(liturgy : Liturgy) {
    console.log('Saving: ', liturgy);
    this.saving = true;
    // if has id, then update existing
    if(liturgy.id) {
      this.service.update(liturgy.id, liturgy).subscribe(r => {
        this.saving = false;
        this.saved.emit(true);
      });
    } else {
      // if no id, create new
      this.service.save(liturgy).subscribe(r => {
        this.saving = false;
        this.saved.emit(true);
        this.liturgy = r;
      });
    }
  }

  appendAfter(ii : number, list : any[], insert: any) {
    list.splice(ii+1, 0, insert);
  }

  remove(ii : number, list : any[]) {
    list.splice(ii, 1);
  }

  trackByIndex(index, item) {
    return index; // or item.id
  }

  addPreference() {
    this.appendAfter(this.prefsMap.length-1, this.prefsMap, { key: '', preference: new Preference() });
    this.setPrefsMap();
  }

  setPreferences(event) {
    this.preferencesError = undefined;
    try {
      this.liturgy.preferences = JSON.parse(event.detail.value);
    } catch(e) {
      this.preferencesError = e.toString();
    }
  }

  setValue(event) {
    this.valueError = undefined;
    try {
      this.liturgy.value = JSON.parse(event.detail.value);
    } catch(e) {
      this.valueError = e.toString();
    }
  }

}
