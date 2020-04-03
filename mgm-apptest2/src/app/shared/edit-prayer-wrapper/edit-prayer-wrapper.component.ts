import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Prayer } from '../../models/prayer.model';
import { PrayerService } from '../../services/prayer.service';


@Component({
  selector: 'venite-edit-prayer-wrapper',
  templateUrl: './edit-prayer-wrapper.component.html',
  styleUrls: ['./edit-prayer-wrapper.component.scss'],
})
export class EditPrayerWrapperComponent implements OnInit {
  obj : Prayer;

  constructor(private route : ActivatedRoute, private service : PrayerService) { }

  ngOnInit() {
    if(!this.obj) {
      this.obj = new Prayer();
    }
    this.route.params.subscribe(params => {
      if(params.id) {
        this.service.findOne(params.id).subscribe(data => this.obj = data);
      }
    });
  }

}
