import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonSelect, IonInput, LoadingController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

import { CompiledOption, LiturgyObject } from "../../models/liturgy.model";
import { PsalmService } from "../../services/psalm.service";
import { Psalm } from "../../models/psalm.model";
import { BibleService } from '../../services/bible.service';
import { BibleReading } from '../../models/bible-reading.model';

const VERSIONS = {
  'ip': 'IP',
  'bcp1979': '1979',
  'eow': 'EOW',
  'coverdale': 'Coverdale',
  'rite_i': 'Rite I'
}

@Component({
  selector: 'venite-pray-option',
  templateUrl: './pray-option.component.html',
  styleUrls: ['./pray-option.component.sass']
})
export class PrayOptionComponent implements OnInit {
  @Input() opt : CompiledOption;
  @Output() optChange : EventEmitter<CompiledOption> = new EventEmitter();
  options : SelectOption[];
  optionsAreLong : boolean = false;
  label : string;
  hasLabel : boolean;
  omitLabel : boolean;

  @Input() language : string;
  @Input() liturgyversions : string[];
  @Input() bulletinEditor : boolean = false;

  canticleOptions : Psalm[] = new Array();
  @ViewChild('canticleSelect') canticleSel: IonSelect;

  isPsalm : boolean = false;
  psalmOptions : string[];
  psalterVersion : string;
  @ViewChild('psalmSelect') psalmSel: IonSelect;

  changingReading : boolean = false;
  @Input() hidden : boolean = false;

  @ViewChild('scriptureInput') scriptureInput: IonInput;
  changeScripture : boolean = false;
  scriptureCitation : string;

  toggleHide() {
    this.hidden = !this.hidden;
    this.opt.hidden = !this.opt.hidden;
    console.log('(toggleHide) opt is now hidden = ', this.opt.hidden);
    this.optChange.emit(this.opt);
  }

  toggleChangeScripture() {
    this.scriptureCitation = this.opt.value[this.opt.selected].citation;
    this.changeScripture = !this.changeScripture;
  }

  async setScripture(citation : string) {
    const bibleVersion = this.liturgyversions.includes('rite_i') ? 'KJV' : 'NRSV';
    this.bible.getText(citation, bibleVersion)
      .subscribe(
        data => {
          const value = data.verses.flat().map(v => v.text).join('');
          console.log(value);
          const newObj = { type: 'scripture', value, citation };
          this.opt.value.unshift(newObj);
          this.opt.selected = 0;
        },
        error => {
          this.toggleChangeScripture();
        }
      );
    //this.addOption($event, 'scripture');
  }

  setOmitLabel() : boolean {
    return this.opt.value && this.opt.value[0] && (
      this.opt.value[0].canticle || // omit label for canticles
      this.opt.value[0].localname ||   // and psalms
      this.opt.value[0].eucharistic_intro || // and the gospel
      this.opt.value[0].labelled_reading
    );
  }

  doesHaveLabel() : boolean {
    if(this.opt.label) {
      return true;
    } else {
      if(!this.opt.value) { this.opt.value = new Array(); }
      const copy = JSON.parse(JSON.stringify(this.opt.value));
      copy.unshift(this.opt.value[this.opt.selected]);
      return copy.filter(o => !!(o && o.label)).length > 0;
    }
  }

  getLabel() : string {
    if(this.opt.label) {
      return this.opt.label;
    } else {
      if(!this.opt.value) { this.opt.value = new Array(); }
      const copy = JSON.parse(JSON.stringify(this.opt.value));
      copy.unshift(this.opt.value[this.opt.selected]);
      console.log('(getLabel)', copy);
      return copy.filter(o => !!(o && o.label)).map(o => o.label)[0];
    }
  }

  hasOptions() : boolean {
    if(!this.opt.value) { this.opt.value = new Array(); }
    return this.opt.value.length > 1;
  }

  getOptions() : SelectOption[] {
    if(this.hasOptions()) {
      let options : SelectOption[] = new Array(),
          uniqueVersions = this.opt.value.map(o => o.version)
                              .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], [])
                              .length,
          uniqueLabels = this.opt.value.map(o => o.label)
                              .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], [])
                              .length;

      for (let index = 0; index < this.opt.value.length; index++) {
        let option = this.opt.value[index];

        let label : string;
        if(option.type == 'psalm' && option.slug.match(/psalm_/) && uniqueVersions == 1) {
          label = `Psalm ${option.number}`;
        } else if(option.type == 'reading') {
          label = option.citation;
        } else if(option.localname && option.version && uniqueVersions > 1) {
          label = `${option.localname} (${VERSIONS[option.version]})`;
        } else if(option.version_label && option.version_label !== 'bcp1979') {
          label = option.version_label;
        } else if(option.label && uniqueLabels > 1) {
          label = option.label;
        } else if(option.localname && (!option.version_label || option.version_label == 'bcp1979')) {
          label = option.localname;
        } else if((VERSIONS[option.version] && uniqueVersions > 1) || option.version_label == 'bcp1979') {
          label = VERSIONS[option.version || option.version_label];
        } else {
          label = option.citation || `“${JSON.stringify(option.value).replace(/[\[\]\{\}\"\'\:\n\\]/g, ' ').trim()}”`;
        }
        console.log(label);
        label = label.length > 30 ? label.substring(0, 30) + '...' : label;

        options.push({
          index,
          label,
          selected: (index == 0),
          default: (index == 0)
        });
      }

      // if all options are longish, just make it a dropdown menu instead of segment buttons
      if(options && options.length > 0) {
        this.optionsAreLong = options
          .map(o => o.label && o.label.length && o.label.length > 15)
          .reduce((a, b) => a || b);
      }

      return options;
    } else {
      return undefined;
    }
  }

  async addOption(event, type : string) {
    if(type == 'canticle') {
      let canticleId : string = event.detail.value,
          canticle : Psalm = this.canticleOptions.find(c => c.id == parseInt(canticleId)),
          canticleObj : LiturgyObject = { type: "psalm" };
      Object.assign(canticleObj, canticle);
      if(!this.opt.value.find(opt => opt.id == canticleId)) {
        this.opt.value[this.opt.selected] = canticleObj;
        this.opt.selected = this.opt.selected;
        this.options = this.getOptions();
        this.hasLabel = this.doesHaveLabel();
        this.label = this.getLabel();
        this.omitLabel = this.setOmitLabel();
      }
      this.optChange.emit(this.opt);
    } else if(type == 'psalm') {
      let number : string = event.detail.value,
          selected = this.opt.value[this.opt.selected],
          psalms : Psalm[] = await (this.psalmService.getPsalm(number, selected.version).toPromise()),
          psalmObjs : LiturgyObject[] = new Array();
      psalms.forEach(psalm => {
        let psalmTpl : LiturgyObject = { type: 'psalm' };
        Object.assign(psalmTpl, psalm);
        psalmObjs.push(psalmTpl);
      });
      console.log(psalms);
      this.opt.value[this.opt.selected] = psalmObjs[0];
      this.opt.value = this.opt.value.concat(psalmObjs.slice(1));
      this.options = this.getOptions();
      this.hasLabel = this.doesHaveLabel();
      this.label = this.getLabel();
      this.omitLabel = this.setOmitLabel();
      this.optChange.emit(this.opt);
    }
  }

  async canticleMenu() {
    let liturgyversions : string[] = this.liturgyversions;
    if(liturgyversions.includes('bcp1979') && !(liturgyversions.includes('eow'))) {
      liturgyversions.push('eow');
    }
    if(liturgyversions.includes('rite_i') && !(liturgyversions.includes('bcp1979'))) {
      liturgyversions.push('bcp1979');
    }

    const loading = await this.loading.create();
    await loading.present();
    this.psalmService.getCanticles(this.language, this.liturgyversions).subscribe(data => {
      this.canticleOptions = data.sort((a, b) => (a.number > b.number) ? 1 : -1).sort((a, b) => {
        try {
          return (parseInt(a.number) > parseInt(b.number)) ? 1 : -1;
        } catch(e) {
          return (a.number > b.number) ? 1 : -1;
        }
      });
      this.canticleOptions.forEach(canticle => canticle.version_label = canticle.version_label || VERSIONS[canticle.version]);
      setTimeout(() => {
        this.canticleSel.open();
      }, 1);
      loading.dismiss();
    });
  }

  async psalmMenu() {
    this.psalterVersion = this.opt.value[this.opt.selected || 0].version;
    this.psalmOptions = [...Array(150).keys()].map(n => (n+1).toString());

    setTimeout(() => {
      this.psalmSel.open();
    }, 1);
    //this.psalmOptions = [...Array(150).keys()].map(n => (n+1).toString());
  }

  updateObj(ii : number, obj : LiturgyObject) {
    this.opt.value[ii] = obj;
    this.label = this.getLabel();
    console.log('\n\nNEW LABEL\n\n', this.label);
    this.optChange.emit(this.opt);
  }

  selectedChange() {
    this.optChange.emit(this.opt);
  }

  constructor(
    private psalmService : PsalmService,
    private loading : LoadingController,
    private popover : PopoverController,
    private bible : BibleService
  ) { }

  ngOnInit() {
    this.opt.selected = this.opt.selected || 0;
    this.options = this.getOptions();
    this.hasLabel = this.doesHaveLabel();
    this.label = this.getLabel();
    this.omitLabel = this.setOmitLabel();

    const selected = this.opt.value[this.opt.selected || 0],
          others = this.opt.value.map(o => o.slug);
    if(selected && selected.type == 'psalm' && selected.slug.match(/psalm_/) && !others.includes('venite')) {
      this.isPsalm = true;
    }
  }
}

class SelectOption {
  index: number;
  label: string;
  selected: boolean;
  default: boolean;
}
