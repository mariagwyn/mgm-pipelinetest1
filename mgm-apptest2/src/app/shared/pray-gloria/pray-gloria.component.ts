import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-pray-gloria',
  templateUrl: './pray-gloria.component.html',
  styleUrls: ['./pray-gloria.component.sass']
})
export class PrayGloriaComponent implements OnInit {
  @Input() uid : string;
  @Input() value : string[];
  citation : string[];

  constructor() { }

  ngOnInit() {
  }

  // fires whenever Input() changes
   ngOnChanges() {
    this.citation = this.value.map(s => s.replace(/&nbsp;/g, ' '));
  }

}
