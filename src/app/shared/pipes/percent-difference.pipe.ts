import { Pipe, PipeTransform } from '@angular/core';



@Pipe({name: 'percentDifference'})
export class PercentDifferencePipe implements PipeTransform {
  constructor() {

  }
  transform(value1: number, value2: number): any {

  }
}
