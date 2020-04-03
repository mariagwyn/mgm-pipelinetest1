import { Component, OnInit, Input } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Clipboard } = Plugins;
import * as clipboardPolyfill from 'clipboard-polyfill/dist/clipboard-polyfill.promise';

@Component({
  selector: 'venite-copy-bulletin-link',
  templateUrl: './copy-bulletin-link.component.html',
  styleUrls: ['./copy-bulletin-link.component.scss'],
})
export class CopyBulletinLinkComponent implements OnInit {
  @Input() link : string;
  success : boolean = false;
  error : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  copyLink() {
    Clipboard.write({ url: this.link }).then(() => this.success = true)
      .catch(() => {
        clipboardPolyfill.writeText(this.link)
          .then(() => this.success = true)
          .catch(() => this.error = true);
      });
  }
}
