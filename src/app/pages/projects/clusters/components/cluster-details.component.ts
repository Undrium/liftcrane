import { 
  Component, 
  OnChanges,
  OnInit, 
  Input, 
  ViewEncapsulation 
}                               from '@angular/core';
import { MatDialog }            from '@angular/material/dialog';

import { ConfirmDialogComponent }             from '../../../../components/confirm-dialog/confirm-dialog.component';
import { PatchClusterDialogComponent }        from './patch-cluster-dialog.component';

import { LogService }           from '../../../../services/log.service';
import { PageService }          from '../../../../services/page.service';
import { ApiService }           from '../../../../services/api.service';
import { ClusterService }       from '../../../../services/cluster.service';
import { ProjectsService }       from '../../../../services/projects.service';

declare const YAML: any;

@Component({
  selector: 'cluster-details',
  templateUrl: './cluster-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cluster-details.component.scss']
})
export class ClusterDetailsComponent {
  @Input() cluster: any;
  @Input("closeAccordion") closeAccordion: any;

  constructor(
    public clusterService: ClusterService,
    public projectsService: ProjectsService,
    public pageService: PageService, 
    public logService: LogService,
    public apiService: ApiService,
    public dialog: MatDialog
    ) { 

  }

  async refreshCluster(){
    this.clusterService.refresh(this.cluster);
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
          this.closeAccordion();
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
          this.closeAccordion();
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
      this.closeAccordion();
    });
  }

  public toggleKubeConfig(cluster){
    cluster.displayKubeConfig = !cluster.displayKubeConfig;
    if(cluster['kubeConfig']){return;}

    this.clusterService.getAKSKubeConfig(cluster).subscribe(kubeConfig => {
      cluster['kubeConfig'] = atob(kubeConfig);
    });
  }

}