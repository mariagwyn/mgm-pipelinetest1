import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlines'
})
export class NewlinesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? value.replace(/\n/g, '<br>') : value;
  }

}
