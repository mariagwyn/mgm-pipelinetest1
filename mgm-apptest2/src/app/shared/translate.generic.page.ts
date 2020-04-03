import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CrudService } from '../services/crud.service';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';

import isoLangs from '../models/language-codes.json'; // @author Phil Teare using wikipedia data

export class GenericTranslatePage<T> implements OnInit {
  from : LanguageVersion = { language: 'en', version: 'bcp1979' };
  to : LanguageVersion = { language: 'en', version: 'rite_i' };

  froms : any[] = new Array();
  tos : any[] = new Array();
  objects : FromTo[] = new Array();

  faLanguage = faLanguage;

  constructor(
    public service : CrudService<T, number>,
    public router : Router
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.objects = new Array();

    this.service.querySelect({language: this.from.language, version: this.from.version}, 'slug,label')
    .subscribe(data => {
      this.froms = data;
    });

    this.service.querySelect({language: this.to.language, version: this.to.version}, 'slug,label')
    .subscribe(data => {
      this.tos = data;
      this.weave();
    });
  }

  weave() {
    // weave together froms and tos
    this.froms.forEach((from, ii) => {
      this.objects.push({ from, to: this.getPartner(from) });
    });
  }

  languages() : string[] {
    return Object.keys(isoLangs);
  }

  languagelocalname(code : string) : string {
    return isoLangs[code]['name'].split(',')[0];
  }

  getPartner(psalm : IdSlug) : IdSlug {
    return this.tos.find(p => p.slug == psalm.slug);
  }

  filter(event) {
    let filter : string = event.detail.value.toLowerCase();
    this.objects.forEach(object => {
      object.hide = !(object.from.slug.toLowerCase().includes(filter)
        || (object.from.label && object.from.label.toLowerCase().includes(filter))
        || (object.to && object.to.slug.toLowerCase().includes(filter))
        || (object.to && object.to.label && object.to.label.toLowerCase().includes(filter)));
    });
  }
}

class LanguageVersion {
  language: string;
  version: string;
}

class FromTo {
  from: IdSlug;
  to: IdSlug;
  hide?: boolean;
}

class IdSlug {
  id: number;
  slug: string;
  label: string;
}
