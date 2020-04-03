import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Collect } from '../../models/collect.model';
import { CollectService } from '../../services/collect.service';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'venite-edit-collect',
  templateUrl: './edit-collect.component.html',
  styleUrls: ['./edit-collect.component.scss'],
})
export class EditCollectComponent implements OnInit {
  @Input() collect : Collect;
  @Input() canTranslate : boolean = false;
  @Output() saved : EventEmitter<boolean> = new EventEmitter();
  @Input() autofocus : boolean;

  saving : boolean = false;

  faLanguage = faLanguage;

  constructor(
    private service : CollectService,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    if(!this.collect) {
      this.collect = new Collect();
    }
    if(!this.collect.value || (Array.isArray(this.collect.value) && this.collect.value.length == 0)) {
      this.collect.value = new Array('');
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.collect = data);
      }
    });
  }

  save(collect : Collect) {
    console.log('Saving: ', collect);
    this.saving = true;
    // if has id, then update existing
    if(collect.id) {
      this.service.update(collect.id, collect).subscribe(r => {
        this.saving = false;
        this.saved.emit(true);
      });
    } else {
      // if no id, create new
      this.service.save(collect).subscribe(r => {
        this.saving = false;
        this.saved.emit(true);
        this.collect = r;
      });
    }
  }

  replaceNewline() {
    this.collect.value.forEach((text, index) => {
      this.collect.value[index] = text.replace(/\n/g, ' ')
        .replace(/\'/g, '’')
        .replace(/\s+/g, ' ')
        .replace(/\s*Amen\.\s*/g, '')
        .trim();
    });
  }

  appendAfter(ii : number, list : any[], insert: any) {
    list.splice(ii+1, 0, insert);
  }
  remove(ii : number, list : any[]) {
    list.splice(ii, 1);
  }

}
