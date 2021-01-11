import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { PageService }        from '../../../services/page.service';
import { CloudGuardService }        from '../../../services/cloudguard.service';

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
    public cloudGuardService: CloudGuardService
  ) { 
    this.pageService.pageTitle = "Admin > Start";
    this.cloudGuardService.countProjects().subscribe((response:any) => {this.projectCount$ = response;});
    this.cloudGuardService.countUsers().subscribe((response:any) => {this.userCount$ = response;});
    this.cloudGuardService.countRegistries().subscribe((response:any) => {this.registryCount$ = response;});
    this.cloudGuardService.countClusters().subscribe((response:any) => {this.clusterCount$ = response;});
  }



}
