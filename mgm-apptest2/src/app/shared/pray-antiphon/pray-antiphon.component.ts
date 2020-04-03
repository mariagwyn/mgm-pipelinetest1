import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-pray-antiphon',
  templateUrl: './pray-antiphon.component.html',
  styleUrls: ['./pray-antiphon.component.sass']
})
export class PrayAntiphonComponent implements OnInit {
  @Input() uid : string;
  @Input() value : string[];

  constructor() { }

  ngOnInit() {
  }

}
