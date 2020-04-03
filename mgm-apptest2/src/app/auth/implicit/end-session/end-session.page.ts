import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../auth.service';

@Component({
  template: '<venite-loading message="logout"></venite-loading>'
})
export class EndSessionPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.authService.userInfo.next(undefined);
    this.authService.setAuthenticated(false);
    this.authService.EndSessionCallBack();
    this.navCtrl.navigateRoot('/');
  }

}
