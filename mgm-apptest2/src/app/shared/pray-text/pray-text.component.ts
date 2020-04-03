import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'venite-pray-text',
  templateUrl: './pray-text.component.html',
  styleUrls: ['./pray-text.component.sass']
})
export class PrayTextComponent implements OnInit {
  @Input() uid : string;
  @Input() label: string;
  @Input() value: string[];
  @Input() response: string;

  compiledValue : string[][] = new Array();

  constructor() { }

  ngOnInit() {
    this.compiledValue = this.value
      .map((s, index) => {
        let chunks = s.match(/[\w‘’“”\n ]+([^\w‘’“”\n ]|$)/g);
        if(index == this.value.length - 1 && this.response) {
          // preserve a trailing newline if necessary (as in e.g., Trisagion)
          if(this.value[this.value.length-1].charAt(this.value.length-1) == '\n') {
            chunks.push('<br>');
          }
          chunks.push(`<span class='response'> ${this.response}</span>`);
        } else {
          console.log(s);
        }
        return chunks;
      });
  }

}
