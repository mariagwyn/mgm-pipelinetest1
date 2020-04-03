import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'venite-bulletin-tutorial',
  templateUrl: './bulletin-tutorial.component.html',
  styleUrls: ['./bulletin-tutorial.component.scss'],
})
export class BulletinTutorialComponent implements OnInit {

  constructor(private modal : ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modal.dismiss();
  }
}
