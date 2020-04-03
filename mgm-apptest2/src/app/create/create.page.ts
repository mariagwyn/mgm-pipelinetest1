import { Component, OnInit } from '@angular/core';

import { faPrayingHands, faBookReader, faMusic, faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'venite-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  faPrayingHands = faPrayingHands;
  faBookReader = faBookReader;
  faMusic = faMusic;
  faBook = faBook;

  constructor() { }

  ngOnInit() {
  }

}
