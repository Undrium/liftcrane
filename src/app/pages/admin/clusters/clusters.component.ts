import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { PageService }        from '../../../services/page.service';
import { CloudGuardService }        from '../../../services/cloudguard.service';



@Component({
  selector: 'app-admin-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss']
})

export class ClustersComponent {
  public clusters: any[];
  displayedColumns: string[] = ['name', 'formatname', 'action'];


  constructor(
    public pageService: PageService,
    private cloudGuardService: CloudGuardService,

  ) { 
    this.pageService.pageTitle = "Admin > Clusters";
    this.cloudGuardService.getClusters().subscribe((response:any) => {
        this.clusters = response;
    });
  }



}
