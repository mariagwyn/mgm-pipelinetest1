import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LiturgyService } from '../../services/liturgy.service';
import { Liturgy } from '../../models/liturgy.model';
import { AlertController } from '@ionic/angular';

import { GenericCreatePage } from '../create.generic.page';

@Component({
  selector: 'venite-create-liturgy',
  templateUrl: './create-liturgy.page.html',
  styleUrls: ['./create-liturgy.page.scss'],
})
export class CreateLiturgyPage extends GenericCreatePage<Liturgy> {

  constructor(service : LiturgyService, loading : LoadingController, alert : AlertController) {
    super(service, loading, alert);
  }

}
