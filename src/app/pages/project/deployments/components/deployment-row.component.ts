import { Component, OnInit, Input, ViewEncapsulation }      from '@angular/core';
import { MatDialog }                                        from '@angular/material/dialog';

import { DeleteDeploymentDialogComponent }  from './../components/delete-deployment-dialog.component'
import { EditDeploymentDialogComponent }    from './../components/edit-deployment-dialog.component';
import { RevisionDialogComponent }          from './../components/revision-dialog.component';
import { ScaleDialogComponent }             from './../components/scale-dialog.component'

import { PageService }        from '../../../../services/page.service';
import { ApiService }         from '../../../../services/api.service';
import { DeploymentService }  from '../../../../services/deployment.service';
import { ClusterService }     from '../../../../services/cluster.service';
import { NamespaceService }   from '../../../../services/namespace.service';
import { LogService }         from '../../../../services/log.service';


@Component({
  selector: 'deployment-row',
  templateUrl: './deployment-row.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./deployment-row.component.scss']
})
export class DeploymentRowComponent {
  @Input() deployment: any;
  
  constructor(
    public apiService: ApiService, 
    public clusterService: ClusterService,
    public dialog: MatDialog,
    public deploymentService: DeploymentService,
    public namespaceService: NamespaceService,
    public logService: LogService,
    public pageService: PageService
  ) {}

  public pauseDeployment = this.deploymentService.stopDeployment;
  public startDeployment = this.deploymentService.startDeployment;

  // TODO separate Deployment and Deployment Config
  editDeploymentDialog(deployment: any): void {
    const dialogRef = this.dialog.open(EditDeploymentDialogComponent, {
      width: '950px',
      data: {deployment: deployment}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  // TODO separate Deployment and Deployment Config
  deleteDeploymentDialog(deployment: any): void {
    const dialogRef = this.dialog.open(DeleteDeploymentDialogComponent, {
      width: '350px',
      data: {deployment: deployment}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  // TODO separate Deployment and Deployment Config
  revisionDialog(deployment: any): void {
    const dialogRef = this.dialog.open(RevisionDialogComponent, {
      width: '650px',
      data: {deployment: deployment}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  // TODO separate Deployment and Deployment Config
  scaleDialog(deployment: any): void {
    const dialogRef = this.dialog.open(ScaleDialogComponent, {
      width: '350px',
      data: {deployment: deployment}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

}