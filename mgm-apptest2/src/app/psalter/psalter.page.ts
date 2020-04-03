import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router';
import { PsalmService } from '../services/psalm.service';
import { Psalm } from '../models/psalm.model';

@Component({
  selector: 'venite-psalter',
  templateUrl: './psalter.page.html',
  styleUrls: ['./psalter.page.sass'],
})
export class PsalterPage implements OnInit {
  versionLabels = {
    'bcp1979': '1979 BCP',
    'coverdale': 'Coverdale',
    'ip': 'Inclusive Psalter',
    'eow': 'Enriching Our Worship',
    'rite_i': 'Rite I'
  }
  psalmVersion : string;
  psalmNumber : string;
  psalmNumberOptions : string[] = [...Array(150).keys()].map(n => (n+1).toString());
  psalmVersionOptions : string[] = ['bcp1979', 'ip', 'coverdale'];
  psalm : Psalm[];

  constructor(
    private service : PsalmService,
    private route : ActivatedRoute,
    private title : Title
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.psalmVersion = params.version || 'bcp1979';
      this.psalmNumber = params.number || '1';
      this.setPsalm();
      this.title.setTitle(`Psalm ${this.psalmNumber} (${this.versionLabels[this.psalmVersion]}) - Venite`);
    });
  }

  setPsalm() {
    this.service.getPsalm(this.psalmNumber, this.psalmVersion)
      .subscribe(data => this.psalm = data.filter(p => !p.slug.match('_bracket')));
  }
}
