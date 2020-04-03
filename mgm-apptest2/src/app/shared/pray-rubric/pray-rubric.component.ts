import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-pray-rubric',
  templateUrl: './pray-rubric.component.html',
  styleUrls: ['./pray-rubric.component.sass']
})
export class PrayRubricComponent implements OnInit {
  @Input() uid : string;
  @Input() value : string[];

  constructor() { }

  ngOnInit() {
  }

}
