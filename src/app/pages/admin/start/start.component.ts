import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { PageService }        from '../../../services/page.service';
import { CloudGuardDataSource }        from '../../../services/cloudguard.data-source';

@Component({
  selector: 'app-admin-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  public projectCount$ = null;
  public registryCount$ = null;
  public userCount$ = null;
  public clusterCount$ = null;

  constructor(
    public pageService: PageService,
    public cloudGuardDataSource: CloudGuardDataSource
  ) { 
    this.pageService.pageTitle = "Admin > Start";
    this.cloudGuardDataSource.countProjects().subscribe((response:any) => {this.projectCount$ = response;});
    this.cloudGuardDataSource.countUsers().subscribe((response:any) => {this.userCount$ = response;});
    this.cloudGuardDataSource.countRegistries().subscribe((response:any) => {this.registryCount$ = response;});
    this.cloudGuardDataSource.countClusters().subscribe((response:any) => {this.clusterCount$ = response;});
  }



}
