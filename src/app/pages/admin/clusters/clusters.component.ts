import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { ConfirmDialogComponent }     from '../../../components/confirm-dialog/confirm-dialog.component';

import { PageService }        from '../../../services/page.service';
import { CloudGuardDataSource }        from '../../../services/cloudguard.data-source';
import { ClusterService } from 'src/app/services/cluster.service';



@Component({
  selector: 'app-admin-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss']
})

export class ClustersComponent {
  public clusters: any[];
  displayedColumns: string[] = ['name', 'formatname', 'project.name', 'action'];


  constructor(
    public pageService: PageService,
    private clusterService: ClusterService,
    private cloudGuardDataSource: CloudGuardDataSource,
    public dialog: MatDialog,
    public router: Router
  ) { 
    this.pageService.pageTitle = "Admin > Clusters";
    this.cloudGuardDataSource.getClusters().subscribe((response:any) => {
        this.clusters = response;
    });
  }

  deleteCluster(clusterToDelete): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Confirm deletion of " + clusterToDelete.name,
          verifiyText: clusterToDelete.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clusterService.deleteCluster(clusterToDelete).subscribe(result => {
          this.router.navigate(['/admin/clusters']);
        });

      }
    });
  }



}
