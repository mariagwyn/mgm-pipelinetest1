import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LiturgyObject, CompiledSection, CompiledOption } from '../../models/liturgy.model';

@Component({
  selector: 'venite-pray-section',
  templateUrl: './pray-section.component.html',
  styleUrls: ['./pray-section.component.sass']
})
export class PraySectionComponent implements OnInit {
  @Input() label : string;
  @Input() toggle : boolean;
  @Input() show : boolean;
  @Input() value : CompiledOption[];
  @Output() onChange : EventEmitter<CompiledSection> = new EventEmitter();
  @Input() language : string;
  @Input() liturgyversions : string[];
  @Input() bulletinEditor : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleSection() : void {
    this.show = !this.show;
  }

  optChanged(ii : number, event : CompiledOption) {
    this.value[ii] = event;
    console.log('(optChanged) updated obj = ', event);
    this.onChange.emit({
      type: 'section',
      label: this.label,
      value: this.value
    });
  }
}
