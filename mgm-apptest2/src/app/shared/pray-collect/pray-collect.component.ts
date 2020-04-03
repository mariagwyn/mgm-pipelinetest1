import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-pray-collect',
  templateUrl: './pray-collect.component.html',
  styleUrls: ['./pray-collect.component.sass']
})
export class PrayCollectComponent implements OnInit {
  @Input() uid : string;
  @Input() label : string;
  @Input() value : string[];
  @Input() response : string;

  compiledValue : string[][] = new Array();

  constructor() { }

  ngOnInit() {
    this.compiledValue = this.value
      .map((s, index) => s.match(/[\w‘’“”\n ]+([^\w‘’“”\n ])/g));
  }

}
