import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lord'
})
export class LordPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.replace(/LORD[\'’]S/g, 'LORD’s')
                 .replace(/YHWH/g, '<span class="tetragrammaton">Yhwh</span>')
                 .replace(/YAHWEH/g, '<span class="tetragrammaton">Yhwh</span>')
                 .replace(/LORD/g, '<span class="tetragrammaton">Lord</span>')
                 .replace(/Lord GOD/g, 'Lord <span class="tetragrammaton">God</span>')
                 .replace(/GOD/g, '<span class="tetragrammaton">God</span>');
  }

}
