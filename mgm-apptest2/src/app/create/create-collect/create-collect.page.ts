import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CollectService } from '../../services/collect.service';
import { Collect } from '../../models/collect.model';
import { AlertController } from '@ionic/angular';

import { GenericCreatePage } from '../create.generic.page';

@Component({
  selector: 'venite-create-collect',
  templateUrl: './create-collect.page.html',
  styleUrls: ['./create-collect.page.scss'],
})
export class CreateCollectPage extends GenericCreatePage<Collect> {

  constructor(service : CollectService, loading : LoadingController, alert : AlertController) {
    super(service, loading, alert);
  }

}
