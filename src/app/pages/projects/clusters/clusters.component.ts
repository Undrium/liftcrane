import { Component, OnInit, ViewChild }   from '@angular/core';

import { MatDialog }                      from '@angular/material/dialog';
import { MatAccordion }                   from '@angular/material/expansion';

import { PageService }        from '../../../services/page.service';
import { ApiService }         from '../../../services/api.service';
import { ClusterService }     from '../../../services/cluster.service';
import { ProjectsService }    from '../../../services/projects.service';

import { CreateClusterDialogComponent }       from './components/create-cluster-dialog.component';
import { AddExistingClusterDialogComponent }  from './components/add-existing-cluster-dialog.component';


@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss']
})
export class ClustersComponent {

  @ViewChild(MatAccordion) accordion: MatAccordion = null;

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

  public closeAccordion(){
    if(this.accordion){
      this.accordion.closeAll();
    }
  }


  trackByFormatName(index, item){
    return item.formatName;
  }

}
