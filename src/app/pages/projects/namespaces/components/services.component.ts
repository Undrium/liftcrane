import { Component, OnInit, Input, ViewEncapsulation }     from '@angular/core';

import { MatDialog }                       from '@angular/material/dialog';

import { ApiService }         from '../../../../services/api.service';
import { ClusterService }     from '../../../../services/cluster.service';

import { ConfirmDialogComponent }         from '../../../../components/confirm-dialog/confirm-dialog.component';
import { ObjectEditorDialogComponent }    from '../../../../components/object-editor-dialog/object-editor-dialog.component';

import { LogService }                       from '../../../../services/log.service';
import { NamespaceService }                 from '../../../../services/namespace.service';

@Component({
  selector: 'services',
  templateUrl: './services.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  @Input() namespace: any;
  public vendor: any
  public services: Array<any> = [];
  public servicesEvents: any;

  constructor(
    public apiService: ApiService,
    public clusterService: ClusterService,
    public namespaceService: NamespaceService,
    public logService: LogService,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnDestroy() {
    if(this.servicesEvents && this.servicesEvents['abortController']){
        this.servicesEvents['abortController'].abort();
    }
  }

  ngOnChanges(changes) {

  }

  ngOnInit() {
    this.vendor = this.apiService.getVendor(this.clusterService.currentCluster);  
    this.getServices();
  }

  deleteService(service): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Confirm deletion of service " + service.metadata.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.deleteService(this.namespace.metadata.name, service.metadata.name).subscribe();
      }
    });
  }

  editService(service): void {
    const dialogRef = this.dialog.open(ObjectEditorDialogComponent, {
        minWidth: "70vw",
        data: {
          verb: "Update",
          title: "Edit service " + service.metadata.name,
          object: service
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.updateService(this.namespace.metadata.name, result).subscribe(
          resp =>{
            // TODO Handle response of successful edit
          },
          err => {
              this.logService.handleError(err);
          }
        );
      }
    });
  }

  createServiceDialog(): void {
    const dialogRef = this.dialog.open(ObjectEditorDialogComponent, {
        minWidth: "70vw",
        data: {
          title: "Create new service",
          verb: "Create",
          object: {
            "kind": "Service",
            "apiVersion": "v1",
            "metadata": {
              "name": "service-example"
            },
            "spec": {
                "selector": {"app": "service-example"},
                "ports": [{"name": "http","port": 81,"targetPort": 80}]
            }
          }
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.createService(this.namespace.metadata.name, result).subscribe(
          resp =>{
              // TODO Handle succesful creation
          },
          err => {
              this.logService.handleError(err);
          }
        );
      }
    });
  }


  getServices(){
    this.vendor.listServices(this.namespace.metadata.name).subscribe((res:any) => {
      this.services = res.items || []
      // Lets keep this updated by events
      this.handleEvents(res.metadata.resourceVersion)
      return res.items || []
    });
  }

  async handleEvents(resourceVersion: number){
    this.servicesEvents = await this.vendor.getServicesSse(this.namespace.metadata.name, resourceVersion).toPromise();
    this.servicesEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.services.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.services[index] = event.data;
      } 
    })
    this.servicesEvents.addEventListener('DELETED', (event:any) => {
      const index = this.services.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.services.splice(index, 1);
      } 
    })
    this.servicesEvents.addEventListener('ADDED', (event:any) => {
      this.services.push(event.data);
    })
  }

}