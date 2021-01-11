import { Component, OnInit, Input, ViewEncapsulation }     from '@angular/core';

import { MatDialog }                       from '@angular/material/dialog';

import { ApiService }         from '../../../../services/api.service';
import { ClusterService }     from '../../../../services/cluster.service';

import { ObjectEditorDialogComponent }    from '../../../../components/object-editor-dialog/object-editor-dialog.component';

@Component({
  selector: 'endpoints',
  templateUrl: './endpoints.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
  @Input() namespace: any;
  public vendor: any
  public endpoints: Array<any> = [];
  public endpointsEvents: any;

  constructor(
    public apiService: ApiService,
    public clusterService: ClusterService,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnDestroy() {
    if(this.endpointsEvents && this.endpointsEvents['abortController']){
        this.endpointsEvents['abortController'].abort();
    }
  }

  ngOnChanges(changes) {

  }
  ngOnInit() {
    this.vendor = this.apiService.getVendor(this.clusterService.currentCluster);  
    this.getEndpoints();
  }

  getEndpoints(){
    this.vendor.listEndpoints(this.namespace.metadata.name).subscribe((res:any) => {
      this.endpoints = res.items || []
      // Lets keep this updated by events
      this.handleEvents(res.metadata.resourceVersion)
      return res.items || []
    });
  }

  async handleEvents(resourceVersion: number){
    this.endpointsEvents = await this.vendor.getEndpointsSse(this.namespace.metadata.name, resourceVersion).toPromise();
    this.endpointsEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.endpoints.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.endpoints[index] = event.data;
      } 
    })
    this.endpointsEvents.addEventListener('DELETED', (event:any) => {
      const index = this.endpoints.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.endpoints.splice(index, 1);
      } 
    })
    this.endpointsEvents.addEventListener('ADDED', (event:any) => {
      this.endpoints.push(event.data);
    })
  }

  viewEndpoint(endpoint): void {
    const dialogRef = this.dialog.open(ObjectEditorDialogComponent, {
        width: '650px',
        data: {
          verb: "Update",
          readOnly: true,
          title: "Endpoint " + endpoint.metadata.name,
          object: endpoint
        }
    });
  }

}