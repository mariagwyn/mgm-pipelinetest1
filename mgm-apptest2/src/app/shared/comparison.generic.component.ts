import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';

import { switchMap } from 'rxjs/operators';

export class GenericComparisonComponent<T extends LangVer> implements OnInit {
  from : T;
  to : T;

  fromSlug : string;
  fromLanguage : string;
  fromVersion : string;
  toLanguage : string;
  toVersion : string;
  remainingSlugs: string[];

  constructor(
    public route : ActivatedRoute,
    public service : CrudService<T, number>,
    public router : Router,
    private urlChunk : string,
    private blank : T
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fromSlug = params.slug;
      this.fromLanguage = params.fromLanguage;
      this.fromVersion = params.fromVersion;
      this.toLanguage = params.toLanguage;
      this.toVersion = params.toVersion;

      this.service.query({
        slug: this.fromSlug,
        language: this.fromLanguage,
        version: this.fromVersion
      })
        .subscribe(data => this.from = data[0] || this.blank);
      this.service.query({
        slug: this.fromSlug,
        language: this.toLanguage,
        version: this.toVersion
      })
        .subscribe(data => {
          if(data[0]) {
            this.to = data[0]
          } else {
            let t = JSON.parse(JSON.stringify(this.blank));
            t.slug = this.fromSlug;
            t.language = this.toLanguage;
            t.version = this.toVersion;
            this.to = t;
          }
        });

      this.service.querySelect({language: this.fromLanguage, version: this.fromVersion}, 'slug,label')
        .subscribe(data => {
          let slugs : string[] = data.map(o => o.slug),
              thisOne : number = slugs.indexOf(this.fromSlug);
          console.log(data, slugs, thisOne);
          this.remainingSlugs = slugs.slice(thisOne + 1, slugs.length);
        });
    })
  }

  saved() {
    this.router.navigate([
      'translate',
      this.urlChunk,
      this.remainingSlugs[0],
      this.from.language,
      this.from.version,
      this.to.language,
      this.to.version
    ]);
  }
}

interface LangVer {
  language: string;
  version: string;
  slug: string;
}
