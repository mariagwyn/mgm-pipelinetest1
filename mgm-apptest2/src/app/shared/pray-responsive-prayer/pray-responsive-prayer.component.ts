import { Component, OnInit, Input } from '@angular/core';

interface PrecesLine {
  label: string;
  text: string;
}

@Component({
  selector: 'venite-pray-responsive-prayer',
  templateUrl: './pray-responsive-prayer.component.html',
  styleUrls: ['./pray-responsive-prayer.component.sass'],
})
export class PrayResponsivePrayerComponent implements OnInit {
  @Input() uid : string;
  @Input() value : PrecesLine[]|string[][];
  @Input() response : string;
  @Input() label : string;
  isPreces : boolean;
  isLitany : boolean;

  constructor() { }

  ngOnInit() {
    this.isPreces = this.value[0].hasOwnProperty('label');
    this.isLitany = !!this.response || Array.isArray(this.value[0]);
    console.log(this.value);
    if(Array.isArray(this.value[0])) {
      this.value.forEach(line => {
        // bracketed => optional
        if(line.length == 2 && line[0].match(/^\[/) && line[1].match(/\]$/)) {
          line[0] = line[0].replace('[', '');
          line[1] = line[1].replace(']', '');
          line.push('optional')
        }
        if(line.length == 1 && this.response && line[0].match(/^\[/) && line[0].match(/\]$/)) {
          line[0] = line[0].replace(/[\[\]]/g, '');
          line.push('optional')
        }
      })
    }
  }

}
