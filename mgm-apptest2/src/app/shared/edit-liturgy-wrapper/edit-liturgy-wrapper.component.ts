import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Liturgy } from '../../models/liturgy.model';
import { LiturgyService } from '../../services/liturgy.service';


@Component({
  selector: 'venite-edit-liturgy-wrapper',
  templateUrl: './edit-liturgy-wrapper.component.html',
  styleUrls: ['./edit-liturgy-wrapper.component.scss'],
})
export class EditLiturgyWrapperComponent implements OnInit {
  obj : Liturgy;

  constructor(private route : ActivatedRoute, private service : LiturgyService) { }

  ngOnInit() {
    if(!this.obj) {
      this.obj = new Liturgy();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.obj = data);
      }
    });
  }

}
