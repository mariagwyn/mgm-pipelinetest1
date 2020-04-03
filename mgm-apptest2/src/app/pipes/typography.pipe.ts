import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typography'
})
export class TypographyPipe implements PipeTransform {

  transform(text: string, requireLength : boolean = false, index : number, overrideLength : number = undefined): any {
    //text = text.trim();

    // if text is long enough, wrap first word in dropcap class
    text = text.replace(/YHWH/g, 'Yhwh');

   if(!index || (index && index == 0)) {
     if(text && ((overrideLength && overrideLength > 200) || text.length > 200 || !requireLength)) {
       let firstWord : string = (text || '').split(/[\s.!?\\-]/) ? text.split(/[\s.!?\\-]/)[0] : '',
           re : RegExp = firstWord.length > 2 ? /^([\w\u0590-\u05ff\u0370-\u03ff])([\w\u0590-\u05ff\u0370-\u03ff]*)/ : /^([\w\u0590-\u05ff\u0370-\u03ff])([\w\u0590-\u05ff\u0370-\u03ff]*[\s.!?\\-]*[\w\u0590-\u05ff\u0370-\u03ff]*)/;
       //text = text.replace(re, '<span aria-hidden="true" class="firstword"><span class="drop">$1</span>$2</span><span class="display-hidden">$1$2</span>');
       const buffer = firstWord.length == 1 ? '&nbsp;' : '';
       text = text.replace(re, `<span class="firstword"><span class="drop" aria-hidden="true">$1${buffer}</span>$2</span>`);
     }
   }

   text = text.replace(/\n/g, '<br/>')
              .replace(/LORD[\'’]S/g, 'LORD’s')
              .replace(/YHWH/g, '<span class="tetragrammaton">Yhwh</span>')
              .replace(/YAHWEH/g, '<span class="tetragrammaton">Yhwh</span>')
              .replace(/Yhwh/g, '<span class="tetragrammaton">Yhwh</span>')
              .replace(/LORD/g, '<span class="tetragrammaton">Lord</span>')
              .replace(/Lord GOD/g, 'Lord <span class="tetragrammaton">God</span>')
              .replace(/GOD/g, '<span class="tetragrammaton">God</span>');


    return text;
  }

}
