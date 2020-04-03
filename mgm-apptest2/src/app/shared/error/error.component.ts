import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Clipboard, Device } = Plugins;
import * as clipboardPolyfill from 'clipboard-polyfill/dist/clipboard-polyfill.promise';

@Component({
  selector: 'venite-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  @Input() text : string;
  @Input() page : string;
  now : Date = new Date();
  copied : boolean = false;
  copyError : boolean = false;
  deviceInfo : string;

  constructor() { }

  async ngOnInit() {
    this.deviceInfo = JSON.stringify(await Device.getInfo());
  }

  copy(text : string) {
    Clipboard.write({ string: text }).then(() => this.copied = true)
      .catch(() => {
        clipboardPolyfill.writeText(text)
          .then(() => this.copied = true)
          .catch(() => this.copyError = true);
      });
  }
}
