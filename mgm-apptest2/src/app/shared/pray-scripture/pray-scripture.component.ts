import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-pray-scripture',
  templateUrl: './pray-scripture.component.html',
  styleUrls: ['./pray-scripture.component.sass']
})
export class PrayScriptureComponent implements OnInit {
  @Input() uid : string;
  @Input() label : string;
  @Input() value : string;
  @Input() source : string;
  @Input() response : string;

  constructor() { }

  ngOnInit() {
  }

}
