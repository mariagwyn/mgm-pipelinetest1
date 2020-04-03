import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Bulletin } from '../models/bulletin.model';
import { BulletinService } from '../services/bulletin.service';

@Component({
  selector: 'venite-bulletins',
  templateUrl: './bulletins.page.html',
  styleUrls: ['./bulletins.page.scss'],
})
export class BulletinsPage implements OnInit {
  bulletins : Bulletin[];
  drafts : Bulletin[];
  ids : string[] = new Array();
  error : string;

  constructor(private service : BulletinService, private title : Title) { }

  async ionViewWillEnter() {
    this.service.getLocalBulletins()
      .then(data => this.bulletins = data)
      .catch(error => {
        console.error(error);
        this.error = JSON.stringify(error);
      });

    this.service.getDrafts()
      .then(data => this.drafts = data)
      .catch(error => {
        console.error(error);
        this.error = JSON.stringify(error);
      });
  }

  ngOnInit() {
    this.title.setTitle('Bulletins');
  }

}
