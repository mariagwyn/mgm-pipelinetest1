import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceabletext'
})
export class ReplaceableTextPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    var pattern = new RegExp("\\=([^=]+)\\=", "gi");
    let text : string = value;
    let matches;
    while (matches = pattern.exec(text)) {
      text = text.replace(matches[0], '<em>'+matches[1]+'</em>');
    }
    return text;
  }

}
