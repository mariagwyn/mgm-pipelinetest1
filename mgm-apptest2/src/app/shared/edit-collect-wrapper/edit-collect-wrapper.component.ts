import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Collect } from '../../models/collect.model';
import { CollectService } from '../../services/collect.service';


@Component({
  selector: 'venite-edit-collect-wrapper',
  templateUrl: './edit-collect-wrapper.component.html',
  styleUrls: ['./edit-collect-wrapper.component.scss'],
})
export class EditCollectWrapperComponent implements OnInit {
  obj : Collect;

  constructor(private route : ActivatedRoute, private service : CollectService) { }

  ngOnInit() {
    if(!this.obj) {
      this.obj = new Collect();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.obj = data);
      }
    });
  }

}
