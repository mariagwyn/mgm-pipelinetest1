import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PrayerService } from '../../services/prayer.service';
import { Prayer } from '../../models/prayer.model';
import { AlertController } from '@ionic/angular';

import { GenericCreatePage } from '../create.generic.page';

@Component({
  selector: 'venite-create-prayer',
  templateUrl: './create-prayer.page.html',
  styleUrls: ['./create-prayer.page.scss'],
})
export class CreatePrayerPage extends GenericCreatePage<Prayer> {

  constructor(service : PrayerService, loading : LoadingController, alert : AlertController) {
    super(service, loading, alert);
  }

}
