import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CrudService } from '../services/crud.service';
import { AlertController } from '@ionic/angular';

import isoLangs from '../models/language-codes.json'; // @author Phil Teare using wikipedia data

export class GenericCreatePage<T extends IdSlug> implements OnInit {
  objects : Container<T>[] = new Array();

  constructor(
    public service : CrudService<T, number>,
    public loading : LoadingController,
    public alert : AlertController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loading.create({
      message: 'Loading...',
    });
    await loading.present();
    this.service.findAll().subscribe(data => {
      this.objects = data.map(o => new Container<T>(o, false));
      loading.dismiss();
    });
  }

  filter(event) {
    if(this.objects) {
      let filter : string = event.detail.value.toLowerCase();
      this.objects.forEach(object => {
        object.hide = !(JSON.stringify(object).toLowerCase().includes(filter));
      });
    }
  }

  async delete(obj : T) {
    const alert = await this.alert.create({
      header: 'Confirm Deletion',
      message: `Do you want to delete ‘${this.deleteQuestionLabel(obj)}’?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          role: 'submit',
          cssClass: 'danger',
          handler: () => {
            console.log('deleting ', obj);
            this.service.delete(obj.id).subscribe(data => {
              console.log(data);
              this.objects.find(container => container.obj.id == obj.id).hide = true;
            });
          }
        }
      ]
    });

    await alert.present();
  }

  copy(obj : T) {
    let copied : T = JSON.parse(JSON.stringify(obj));
    delete copied.id;
    this.service.save(copied).subscribe(data => {
      console.log(data);
      this.objects.push(new Container(data, false));
    });
  }

  deleteQuestionLabel(obj : T) {
    return obj.slug;
  }
}

class IdSlug {
  id: number;
  slug?: string;
  label?: string;
}

export class Container<T> {
  obj: T;
  hide: boolean;

  constructor(obj : T, hide : boolean) {
    this.obj = obj;
    this.hide = hide;
  }
}
