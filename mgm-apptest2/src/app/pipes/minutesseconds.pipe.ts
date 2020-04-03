import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {

  transform(value: number): string {
   const negative : boolean = value < 0,
         minutes : number = Math.floor(Math.abs(value / 60));
   return `${negative ? '-': ''}${minutes.toString().padStart(2, '0')}:${Math.abs((value - minutes * 60)).toString().padStart(2, '0')}`;
  }

}
