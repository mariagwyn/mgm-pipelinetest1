import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {
  @Input() message : string = 'loading';

  constructor() { }

  ngOnInit() {
  }

}
