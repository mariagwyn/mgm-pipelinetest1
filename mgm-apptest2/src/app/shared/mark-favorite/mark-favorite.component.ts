import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ToastController, PopoverController } from '@ionic/angular';

import { AuthenticatedComponent } from '../../shared/authenticated/authenticated.component';

import { StorageService } from '../../auth/storage.service';
import { AuthService } from '../../auth/auth.service';
import { FavoriteService } from '../../services/favorite.service';

import { Favorite } from '../../models/favorite.model';
import { SelectedTextEvent } from '../../models/selection.model';

import { FavoriteTextComponent } from '../favorite-text/favorite-text.component';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'venite-mark-favorite',
  templateUrl: './mark-favorite.component.html',
  styleUrls: ['./mark-favorite.component.sass'],
  animations: [
    trigger('heart', [
      state('unliked', style({
        opacity: '1',
      })),
      state('liked', style({
        fill: 'red',
        opacity: '1',
      })),
      transition('unliked <=> liked', [
        animate(150, style({ fill: 'red', transform: 'scale(1.5)' })),
        animate(150, style({ fill: 'red', transform: 'scale(1)' })),
        animate(150, style({ fill: 'red', transform: 'scale(1.25)' })),
        animate(150, style({ fill: 'red', transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class MarkFavoriteComponent extends AuthenticatedComponent {
  @Input() selection : SelectedTextEvent;
  @Input() favoriteMarked : boolean = false;
  favorited : Favorite;
  textUpdated : string;

  constructor(
    private toast : ToastController,
    private popover : PopoverController,
    public authService : AuthService,
    public favoriteService : FavoriteService,
    public storage : StorageService,
    public location : Location
  ) {
    super(authService, storage, location);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // favorites
  toggleFavorite(selection : SelectedTextEvent) {
    if(!this.favoriteMarked) {
      this.favorite(selection);
    } else {
      this.unfavorite(selection);
    }
  }

  async favorite(selection : SelectedTextEvent) {
    let f = new Favorite();
    f.id = undefined;
    f.dateAdded = undefined;
    let userInfo = await this.getUserInfo() as any;
    console.log(`userInfo = `, userInfo);
    f.user = userInfo.preferred_username || userInfo.user_name || userInfo.login || userInfo.email || userInfo.name;
    f.url = decodeURI(this.location.path());
    f.fragment = selection.fragment;
    f.citation = selection.citation;
    f.text = selection.text;
    f.tags = new Array();
    this.favoriteMarked = true;
    this.favoriteService.save(f)
      .subscribe(async data => {
        this.favorited = data;
        selection.ids.forEach(id => document.getElementById(id).classList.add('venite-liked'));
        const popover = await this.popover.create({
          component: FavoriteTextComponent,
          componentProps: {
            'favorited': data
          },
          translucent: true
        });
        return await popover.present();
      },
      async error => {
        this.favoriteMarked = false;
        const toast = await this.toast.create({
          message: 'Uh oh! We ran into a problem while saving this favorite.',
          position: 'top',
          duration: 2000,
          color: 'danger'
        });
      });
  }

  unfavorite(selection : SelectedTextEvent) {
    let f = this.favorited;
    this.favoriteService.delete(f.id).subscribe(data => {
      console.log(data);
      this.favoriteMarked = false;
    });
  }

}
