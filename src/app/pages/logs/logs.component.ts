import { Component, OnInit, Input } from '@angular/core';

import { Router, ActivatedRoute, Params }   from '@angular/router';

import { PageService }  from '../../services/page.service';
import { LogService }   from '../../services/log.service';

@Component({
  selector: 'logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  showExtraDetails = {};
  logEntries = this.logService.logEntries;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public pageService: PageService,
    public logService: LogService
  ) { 
    this.pageService.pageTitle = "Logs";
  }

  ngOnInit() {

  }

  getLogEntries(){
    this.logEntries.sort(function(x, y){
      return y.timestamp - x.timestamp;
    });
    return this.logEntries;
  }

  delete(){
    this.logEntries = this.logService.removeAll();
  }
}
