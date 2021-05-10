import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';


import { ConfirmDialogComponent }         from '../../../components/confirm-dialog/confirm-dialog.component';

import { PageService }        from '../../../services/page.service';
import { LogService }        from '../../../services/log.service';
import { CloudGuardDataSource }        from '../../../services/cloudguard.data-source';


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
    public cloudGuardDataSource: CloudGuardDataSource,
    public dialog: MatDialog

  ) { 
    this.pageService.pageTitle = "Admin > Logs";
    this.fetchLogs();
  }

  async fetchLogs(){
    this.logs = await this.cloudGuardDataSource.getLogs().toPromise();
  }

  trackByFn(index, item) {
    return item.formatName;
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Are you sure you want to delete all logs?"
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cloudGuardDataSource.deleteAllLogs().subscribe(result => {
          this.fetchLogs();
        });

      }
    });
  }

}
