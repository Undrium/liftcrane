import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  constructor(
    public pageService: PageService
  ) { 
    this.pageService.pageTitle = "Metrics";
  }
  ngOnInit() {
  }

}
