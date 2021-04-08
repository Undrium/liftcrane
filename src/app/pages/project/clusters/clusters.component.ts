import { Component, OnInit }  from '@angular/core';
import { MatDialog }          from '@angular/material/dialog';


import { PageService }        from '../../../services/page.service';
import { ApiService }         from '../../../services/api.service';
import { ClusterService }     from '../../../services/cluster.service';
import { ProjectsService }    from '../../../services/projects.service';

import { CreateClusterDialogComponent }       from './components/create-cluster-dialog.component';
import { AddExistingClusterDialogComponent }  from './components/add-existing-cluster-dialog.component';
import { ConfirmDialogComponent }             from '../../../components/confirm-dialog/confirm-dialog.component';
import { PatchClusterDialogComponent }        from './components/patch-cluster-dialog.component';

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss']
})
export class ClustersComponent {
  public vendor: any
  public clusters:Array<any> = [];
  public showProgressbar: boolean = false;

  constructor(
    public clusterService: ClusterService,
    public projectsService: ProjectsService,
    public pageService: PageService, 
    public apiService: ApiService,
    public dialog: MatDialog

  ) { 
    this.pageService.pageTitle = "Clusters";
  }

  createClusterDialog(): void {
    const dialogRef = this.dialog.open(CreateClusterDialogComponent, {
      width: '550px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  addExistingClusterDialog(): void {
    const dialogRef = this.dialog.open(AddExistingClusterDialogComponent, {
      width: '550px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  deleteCluster(cluster): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: "Confirm Delete",
          message: "Confirm deletion of cluster " + cluster.name + " reference (will not be removed from provider)."
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clusterService.deleteCluster(cluster).subscribe(response => {
          this.pageService.displayMessage(`Cluster ${cluster.name} deleted.`);
        });
      }
    });
  }

  deleteClusterInAzure(cluster): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: "Confirm Delete",
          message: "Confirm deletion of cluster " + cluster.name + " in Azure."
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clusterService.deleteAKSCluster(cluster).subscribe(result => {
          this.pageService.displayMessage("Cluster deletion started of " + cluster.name);
        });
      }
    });
  }

  patchClusterInAzureDialog(cluster): void {
    const dialogRef = this.dialog.open(PatchClusterDialogComponent, {
      width: '550px',
      data: {cluster: cluster}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  trackByFormatName(index, item){
    return item.formatName;
  }

}
