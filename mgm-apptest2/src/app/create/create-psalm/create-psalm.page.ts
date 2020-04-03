import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PsalmService } from '../../services/psalm.service';
import { Psalm } from '../../models/psalm.model';
import { AlertController } from '@ionic/angular';

import { GenericCreatePage } from '../create.generic.page';

@Component({
  selector: 'venite-create-psalm',
  templateUrl: './create-psalm.page.html',
  styleUrls: ['./create-psalm.page.scss'],
})
export class CreatePsalmPage extends GenericCreatePage<Psalm> {

  constructor(service : PsalmService, loading : LoadingController, alert : AlertController) {
    super(service, loading, alert);
  }

}
