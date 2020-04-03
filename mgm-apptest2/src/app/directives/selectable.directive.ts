import { Directive, EventEmitter, Output, HostListener, Input } from '@angular/core';
import { SelectionService } from '../services/selection.service';
import { SelectableCitation } from '../models/selection.model';

@Directive({
  selector: '[venite-selectable]'
})
export class SelectableDirective {
  @Input() citation : SelectableCitation;

  constructor(
    private selectionService : SelectionService
  ) { }

  @HostListener('click', ['$event.target'])
  clicked(target : HTMLElement) {
    let text : string = target.innerText.replace(/^(\w)\n(\w+)/, '$1$2'); // replace is for dropcaps
    this.selectionService.add(target, this.citation, text);
    // do something meaningful with it
  }
}
