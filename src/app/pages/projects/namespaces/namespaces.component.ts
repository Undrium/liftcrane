import { Component }                        from '@angular/core';
import { ActivatedRoute, Params, Router }           from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { CreateNamespaceDialogComponent }   from './components/create-namespace-dialog.component'

import { PageService }        from '../../../services/page.service';
import { ApiService }         from '../../../services/api.service';
import { ClusterService }     from '../../../services/cluster.service';
import { NamespaceService }   from '../../../services/namespace.service';
import { ProjectsService }    from '../../../services/projects.service';

@Component({
  selector: 'app-namespaces',
  templateUrl: './namespaces.component.html',
  styleUrls: ['./namespaces.component.scss']
})
export class NamespacesComponent {
  public vendor: any
  public namespaces:Array<any> = [];
  public showExtraDetails = {};
  public showProgressbar: boolean = false;
  public namespacesEvents: any;
  constructor(
    public pageService: PageService, 
    public apiService: ApiService,
    public clusterService: ClusterService,
    public namespaceService: NamespaceService,
    public projectsService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { 
      this.pageService.pageTitle = "Namespaces";
      // Do we already have a cluster in the url?
      this.pageService.trackSubscription(this.activatedRoute.params.subscribe((params: Params) => {
        var clusterFormatname = params['clusterFormatname'];
        if(clusterFormatname){
          this.clusterService.setCurrentClusterByName(clusterFormatname)
        }
      }));

      // Do the user wish to switch cluster?
      this.pageService.trackSubscription(this.clusterService.getCurrentCluster().subscribe((cluster: any) => {
        var uri = this.namespaceService.getCurrentUri();
        if(this.router.url != uri){
          this.router.navigate([uri]);
        }
      }));


      this.namespaces = namespaceService.namespaces;

  }

  extraDetailsEcho(){
    console.log(this.showExtraDetails);
  }

  createNamespaceDialog(): void {
    const dialogRef = this.dialog.open(CreateNamespaceDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  trackByUid(index, item){
    return item.metadata.uid; 
  }

  ngOnDestroy() {
    this.pageService.wipeSubscriptions();
  }

}
