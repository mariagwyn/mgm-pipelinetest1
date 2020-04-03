import { Component, OnInit, Input } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../models/favorite.model';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'venite-favorite-text',
  templateUrl: './favorite-text.component.html',
  styleUrls: ['./favorite-text.component.sass'],
  animations: [
    trigger('checkmark', [
      state('saving', style({
        fill: 'black',
        opacity: '0.5',
      })),
      state('saved', style({
        fill: 'green',
        opacity: '1',
      })),
      transition('unliked <=> liked', animate('100ms ease-out'))
    ])
  ]
})
export class FavoriteTextComponent implements OnInit {
  @Input() favorited : Favorite;
  textUpdated : string;

  constructor(private favoriteService : FavoriteService) { }

  ngOnInit() {}

  updateFavoriteText(event) {
    this.textUpdated = 'saving';
    let f = this.favorited;
    f.note = event.detail.value;
    this.favoriteService.update(f.id, f).subscribe(data => {
      console.log(data);
      this.textUpdated = 'saved';
    });
  }

}
