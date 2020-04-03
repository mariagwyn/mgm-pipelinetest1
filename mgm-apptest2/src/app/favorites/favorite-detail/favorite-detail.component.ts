import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

import { Favorite } from '../../models/favorite.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'venite-favorite-detail',
  templateUrl: './favorite-detail.component.html',
  styleUrls: ['./favorite-detail.component.sass'],
})
export class FavoriteDetailComponent implements OnInit {
  obj : Favorite;

  constructor(
    private route : ActivatedRoute,
    private service : FavoriteService,
    private toast : ToastController,
    private alert : AlertController,
    private router : Router
  ) { }

  ngOnInit() {
    if(!this.obj) {
      this.obj = new Favorite();
      this.obj.tags = new Array();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => {
          this.obj = data;
          this.obj.tags = this.obj.note ? this.obj.note.match(/\#[^\s]*/g) : new Array();
        },
        async error => {
          console.error(error);
          const toast = await this.toast.create({
            message: 'Uh oh! We had some trouble loading your favorites. Try again in a few minutes, or contact us at admin@venite.app.',
            duration: 10000,
            color: 'danger'
          });
          toast.present();
        });
      }
    });
  }

  async delete(obj : Favorite) {
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
              this.router.navigate(['/', 'favorites']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  deleteQuestionLabel(obj : Favorite) {
    let copy = obj.text
    return obj.text.length > 30 ? `${obj.text.slice(0, 30)}...` : obj.text;
  }

  updateFavoriteText(event) {
    this.obj.note = event.detail.value;
    this.service.update(this.obj.id, this.obj).subscribe(data => {
      this.obj = data;
      this.obj.tags = this.obj.note ? this.obj.note.match(/\#[^\s]*/g) : new Array();
    },
    async error => {
      console.error(error);
      const toast = await this.toast.create({
        message: 'Uh oh! We had some trouble saving the note. Try again in a few minutes, or contact us at admin@venite.app.',
        duration: 10000,
        color: 'danger'
      });
      toast.present();
    });
  }
}
