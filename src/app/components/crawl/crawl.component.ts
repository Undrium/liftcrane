import { Component, OnInit, Input, ViewEncapsulation }     from '@angular/core';

import { Observable, fromEvent, of }    from 'rxjs';



@Component({
  selector: 'crawl',
  templateUrl: './crawl.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./crawl.component.scss']
})
export class CrawlComponent implements OnInit {
  constructor() { }
  ngOnInit() {

  }
}
