import { Component, OnInit, ViewChild }   from '@angular/core';

import { MatDialog }                      from '@angular/material/dialog';
import { MatAccordion }                   from '@angular/material/expansion';

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

  @ViewChild(MatAccordion) accordion: MatAccordion;

  public vendor: any
  public clusters:Array<any> = [];
  public showProgressbar: boolean = false;
  public filterText: String = "";

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
    this.accordion.closeAll();

    const dialogRef = this.dialog.open(CreateClusterDialogComponent, {
      width: '550px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  addExistingClusterDialog(): void {
    this.accordion.closeAll();

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
          this.accordion.closeAll();
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
          this.accordion.closeAll();
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
    dialogRef.afterClosed().subscribe(result => {
      this.accordion.closeAll();
    });
  }

  public filterAndLimitClusters(clusters: any){

    var filteredClusters = clusters.filter((cluster) => {
      return this.filterText == "" || cluster.name.includes(this.filterText);
    });

    return filteredClusters;

  }

  public toggleKubeConfig(cluster){
    cluster.displayKubeConfig = !cluster.displayKubeConfig;
    if(cluster['kubeConfig']){return;}
    this.clusterService.getAKSKubeConfig(cluster).subscribe(kubeConfig => {
      cluster['kubeConfig'] = kubeConfig;
    });
  }

  trackByFormatName(index, item){
    return item.formatName;
  }

}
