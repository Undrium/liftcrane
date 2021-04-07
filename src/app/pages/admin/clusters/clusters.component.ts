import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { PageService }        from '../../../services/page.service';
import { CloudGuardDataSource }        from '../../../services/cloudguard.data-source';



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
    private cloudGuardDataSource: CloudGuardDataSource,

  ) { 
    this.pageService.pageTitle = "Admin > Clusters";
    this.cloudGuardDataSource.getClusters().subscribe((response:any) => {
        this.clusters = response;
    });
  }



}
