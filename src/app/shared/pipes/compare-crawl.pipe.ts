import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'compareCrawl'})
export class CompareCrawlPipe implements PipeTransform {
  transform(value: any, neighbourCrawl: any, type: string): any {

  }


}
