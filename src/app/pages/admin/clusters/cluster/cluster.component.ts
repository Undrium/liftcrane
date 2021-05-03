import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { ConfirmDialogComponent }     from '../../../../components/confirm-dialog/confirm-dialog.component';
import { PageService }                from '../../../../services/page.service';
import { CloudGuardDataSource }       from '../../../../services/cloudguard.data-source';
import { ClusterService }             from '../../../../services/cluster.service';
import { LogService }                 from 'src/app/services/log.service';


@Component({
  selector: 'app-admin-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss']
})
export class ClusterComponent {

  public cluster: any;
  public clusterClone: any;
  public platforms: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public pageService: PageService,
    private cloudGuardDataSource: CloudGuardDataSource,
    private clusterService: ClusterService,
    public dialog: MatDialog,
    public logService: LogService,
    private router: Router,
  ) {

    this.platforms = this.clusterService.availablePlatforms;

    this.pageService.startLoader("Fetching cluster ...");
    this.activatedRoute.params.subscribe((params: Params) => {
      var clusterFormatname = params['formatName'];
      if(clusterFormatname){
        this.cloudGuardDataSource.getCluster(clusterFormatname).subscribe((response:any) => {
          this.cluster = response;
          this.clusterClone = JSON.parse(JSON.stringify(this.cluster));
          this.pageService.pageTitle = "Admin > Clusters > " + this.cluster.name;
          this.pageService.stopLoader();
        });
      }
    }); 
  }
  
  reset():void {
    this.cluster = JSON.parse(JSON.stringify(this.clusterClone));
  }

  save(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Save changes to " + this.cluster.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clusterService.updateCluster(this.cluster).subscribe(resp =>{
          this.pageService.displayMessage("Cluster saved.");
        },
        err => {
            this.logService.handleError(err);
        });
      }
    });
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Are you sure you want to delete " + this.cluster.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clusterService.deleteCluster(this.cluster).subscribe(result => {
          this.router.navigate(['/admin/clusters']);
        });

      }
    });
  }



}
