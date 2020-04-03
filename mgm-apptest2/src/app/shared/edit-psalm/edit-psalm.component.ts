import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Psalm } from '../../models/psalm.model';
import { PsalmService } from '../../services/psalm.service';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'venite-edit-psalm',
  templateUrl: './edit-psalm.component.html',
  styleUrls: ['./edit-psalm.component.scss'],
})
export class EditPsalmComponent implements OnInit {
  @Input() psalm : Psalm;
  @Input() canTranslate : boolean = false;
  @Output() translate : EventEmitter<{psalm: Psalm; citation: string}> = new EventEmitter();
  @Output() saved : EventEmitter<boolean> = new EventEmitter();
  @Input() autofocus : boolean = false;
  citation : string;

  saving : boolean = false;

  faLanguage = faLanguage;

  constructor(
    private service : PsalmService,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.psalm) {
      if(this.psalm.citation) {
        this.citation = this.psalm.citation;
      } else if(new RegExp('^psalm_[0-9]+$').test(this.psalm.slug)) {
        let psalmNumber : string = this.psalm.slug.match(/psalm_(\d+)/)[1];
        this.citation = `Psalm ${psalmNumber}`;
      } else if (this.psalm.value && this.psalm.value[0][0].length == 3) {
        let psalmNumber : string = this.psalm.slug.match(/psalm_(\d+)/)[1],
            firstNumber : string = this.psalm.value[0][0][0],
            sections : number = this.psalm.value.length,
            lastSectionVerses : number = this.lastSectionVerses(this.psalm),
            lastNumber : string = this.psalm.value[sections - 1][lastSectionVerses - 1][0];
        this.citation = `Psalm ${psalmNumber}:${firstNumber}-${lastNumber}`;
      } else {
      }

      if(this.canTranslate) {
        //this.emit(this.psalm, this.citation);
      }
    }

    if(!this.psalm) {
      this.psalm = new Psalm();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.psalm = data);
      }
    });
  }

  lastSectionVerses(psalm : Psalm) : number {
    let lastSection = psalm.value[psalm.value.length - 1];
    if(Array.isArray(lastSection)) {
      return lastSection.length;
    } else if(lastSection.hasOwnProperty('verses')) {
      return lastSection.verses.length;
    } else {
      return undefined;
    }
  }

  emit(psalm : Psalm, citation : string) {
    this.translate.emit({psalm, citation});
  }

  save(psalm : Psalm) {
    console.log('Saving: ', psalm);
    this.saving = true;
    // if has id, then update existing
    if(psalm.id) {
      this.service.update(psalm.id, psalm).subscribe(r => {
        this.saving = false;
        this.saved.emit(true);
      });
    } else {
      // if no id, create new
      this.service.save(psalm).subscribe(r => {
        this.saving = false;
        this.saved.emit(true);
        this.psalm = r;
      });
    }
  }

  appendAfter(ii : number, list : any[], insert: any) {
    list.splice(ii+1, 0, insert);
  }

  remove(ii : number, list : any[]) {
    list.splice(ii, 1);
  }

  psalmWithSections(psalm : Psalm) : boolean {
    if(psalm && psalm.value && psalm.value[0] && psalm.value[0].hasOwnProperty('label')) {
      return true;
    } else {
      return false;
    }
  }
}
