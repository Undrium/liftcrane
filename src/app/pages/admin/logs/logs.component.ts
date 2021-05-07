import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';


import { ConfirmDialogComponent }         from '../../../components/confirm-dialog/confirm-dialog.component';

import { PageService }        from '../../../services/page.service';
import { LogService }        from '../../../services/log.service';


@Component({
  selector: 'app-admin-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
  public showExtraDetails = {};
  public logs = [];
  constructor(
    public pageService: PageService,
    public logService: LogService,
    public dialog: MatDialog

  ) { 
    this.pageService.pageTitle = "Admin > Logs";

  }


  trackByFn(index, item) {
    return item.formatName;
  }

}
