import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LiturgyObject } from '../../models/liturgy.model';
import { BibleReading } from '../../models/bible-reading.model';

@Component({
  selector: 'venite-pray-object',
  templateUrl: './pray-object.component.html',
  styleUrls: ['./pray-object.component.sass']
})
export class PrayObjectComponent implements OnInit {
  @Input() obj : LiturgyObject;
  @Output() objChange : EventEmitter<LiturgyObject> = new EventEmitter();
  @Input() bulletinEditor : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  updateReading(event : BibleReading) {
    this.obj = { type: 'reading', ...event };
    this.objChange.emit(this.obj);
  }

}
