import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Psalm } from '../../models/psalm.model';
import { PsalmService } from '../../services/psalm.service';


@Component({
  selector: 'venite-edit-psalm-wrapper',
  templateUrl: './edit-psalm-wrapper.component.html',
  styleUrls: ['./edit-psalm-wrapper.component.scss'],
})
export class EditPsalmWrapperComponent implements OnInit {
  obj : Psalm;

  constructor(private route : ActivatedRoute, private service : PsalmService) { }

  ngOnInit() {
    if(!this.obj) {
      this.obj = new Psalm();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.obj = data);
      }
    });
  }

}
