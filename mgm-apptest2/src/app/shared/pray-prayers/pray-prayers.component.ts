import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MeditatePage } from '../../meditate/meditate.page';

class Prayer {
  number : string;
  label : string;
  text : string;
}

class Section {
  label : string;
  show : boolean;
  value : Prayer[];
}

class Category {
  label : string;
  show : boolean;
  value : Section[];
}

interface ShowInterface {
  show : boolean;
}

@Component({
  selector: 'venite-pray-prayers',
  templateUrl: './pray-prayers.component.html',
  styleUrls: ['./pray-prayers.component.sass']
})
export class PrayPrayersComponent implements OnInit {
  @Input() uid : string;
  @Input() value : Category[];
  @Input() mode : string = 'meditate';
  category : number = 0;

  meditateMinutes : number = 5;

  constructor(private modal : ModalController) { }

  ngOnInit() {
  }

  toggle(e : ShowInterface) {
    e.show = !e.show;
  }

  async startMeditation() {
    const modal = await this.modal.create({
      component: MeditatePage,
      backdropDismiss: true,
      componentProps: {
        'seconds': this.meditateMinutes * 60,
        'delay': 0,
        'modal': true
      }
    });
    modal.present();
  }
}
