import { Component }                        from '@angular/core';
import { ActivatedRoute, Params }           from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { CreateNamespaceDialogComponent }   from './components/create-namespace-dialog.component'

import { PageService }        from '../../../services/page.service';
import { ApiService }         from '../../../services/api.service';
import { ClusterService }     from '../../../services/cluster.service';
import { NamespaceService }   from '../../../services/namespace.service';

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
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { 
      this.pageService.pageTitle = "Namespaces";
      // Do we already have a cluster in the url?
      this.activatedRoute.params.subscribe((params: Params) => {
        var clusterFormatname = params['clusterFormatname'];
        if(clusterFormatname){
          this.clusterService.setCurrentClusterByName(clusterFormatname)
        }
      });
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

}
