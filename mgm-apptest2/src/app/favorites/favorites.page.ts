import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FavoriteService } from '../services/favorite.service';
import { Favorite } from '../models/favorite.model';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { GenericCreatePage, Container } from '../create/create.generic.page';

@Component({
  selector: 'venite-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.sass'],
})
export class FavoritesPage extends GenericCreatePage<Favorite> {
  search: string;
  objects : Container<Favorite>[] = undefined;

  constructor(
    public service : FavoriteService,
    public loading : LoadingController,
    public alert : AlertController,
    private title : Title,
    private toast : ToastController,
    private route : ActivatedRoute
  ) {
    super(service, loading, alert);
  }

  async loadData() {
    const loading = await this.loading.create({
      message: 'Loading...',
    });
    await loading.present();
    this.service.findAll('dateAdded', 'DESC').subscribe(data => {
      console.log('data = ', data);
      this.objects = data.map(o => {
        o.tags = o.note ? o.note.match(/\#[^\s]*/g) : new Array();
        return new Container<Favorite>(o, false);
      });
      console.log('objects = ', this.objects);
      loading.dismiss();
      this.route.fragment.subscribe((fragment) => {
        if(fragment) {
          this.setSearch(`#${fragment}`);
        }
      });
    },
    async error => {
      console.error(error);
      loading.dismiss();
      const toast = await this.toast.create({
        message: 'Uh oh! We had some trouble loading your favorites. Try again in a few minutes, or contact us at admin@venite.app.',
        duration: 10000,
        color: 'danger'
      });
      toast.present();
    });
  }

  deleteQuestionLabel(obj : Favorite) {
    let copy = obj.text
    return obj.text.length > 30 ? `${obj.text.slice(0, 30)}...` : obj.text;
  }

  setSearch(search : string) {
    this.search = search;
    this.filter({ detail: { value: search }});
  }

  ngOnInit() {
    this.title.setTitle('Favorites');
    super.ngOnInit();
  }
}
