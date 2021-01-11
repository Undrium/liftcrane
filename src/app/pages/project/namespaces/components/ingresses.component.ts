import { Component, OnInit, Input, ViewEncapsulation }     from '@angular/core';

import { MatDialog }                       from '@angular/material/dialog';

import { ConfirmDialogComponent }         from '../../../../components/confirm-dialog/confirm-dialog.component';
import { ObjectEditorDialogComponent }    from '../../../../components/object-editor-dialog/object-editor-dialog.component';


import { ApiService }         from '../../../../services/api.service';
import { ClusterService }     from '../../../../services/cluster.service';
import { NamespaceService }   from '../../../../services/namespace.service';
import { LogService }         from '../../../../services/log.service';

@Component({
  selector: 'ingresses',
  templateUrl: './ingresses.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ingresses.component.scss']
})
export class IngressesComponent implements OnInit {
  @Input() namespace: any;
  public vendor: any
  public ingresses: Array<any> = [];
  public ingressesEvents: any;

  constructor(
    public apiService: ApiService,
    public clusterService: ClusterService,
    public namespaceService: NamespaceService,
    public logService: LogService,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnDestroy() {
    if(this.ingressesEvents['abortController']){
        this.ingressesEvents['abortController'].abort();
    }
  }

  ngOnChanges(changes) {

  }
  ngOnInit() {
    this.vendor = this.apiService.getVendor(this.clusterService.currentCluster);  
    this.getIngresses();
  }

  getIngresses(){
    this.vendor.listIngresses(this.namespace.metadata.name).subscribe((res:any) => {
      this.ingresses = res.items || []
      // Lets keep this updated by events
      this.handleEvents(res.metadata.resourceVersion)
      return res.items || []
    });
  }

  async handleEvents(resourceVersion: number){
    this.ingressesEvents = await this.vendor.getIngressesSse(this.namespace.metadata.name, resourceVersion).toPromise();
    this.ingressesEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.ingresses.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.ingresses[index] = event.data;
      } 
    })
    this.ingressesEvents.addEventListener('DELETED', (event:any) => {
      const index = this.ingresses.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.ingresses.splice(index, 1);
      } 
    })
    this.ingressesEvents.addEventListener('ADDED', (event:any) => {
      this.ingresses.push(event.data);
    })
  }

  deleteIngress(ingress): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Confirm deletion of ingress " + ingress.metadata.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.deleteIngress(this.namespace.metadata.name, ingress.metadata.name).subscribe();
      }
    });
  }

  editIngress(ingress): void {
    const dialogRef = this.dialog.open(ObjectEditorDialogComponent, {
        minWidth: "70vw",
        data: {
          verb: "Update",
          title: "Edit ingress " + ingress.metadata.name,
          object: ingress
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.updateIngress(this.namespace.metadata.name, result).subscribe(
          resp =>{
              // TODO Handle good response
          },
          err => {
              this.logService.handleError(err);
          }
        );
      }
    });
  }

  createIngressDialog(): void {
    const dialogRef = this.dialog.open(ObjectEditorDialogComponent, {
        minWidth: "70vw",
        data: {
          title: "Create new service",
          verb: "Create",
          object: {
            "apiVersion": "extensions/v1beta1",
            "kind": "Ingress",
            "metadata": {"name": "test-ingress"},
            "spec": {
                "rules":[{
                  "host": "hello-world.io",
                  "http": {
                    "paths": [{
                      "path": "/", "backend":{"serviceName":"service-example", "servicePort": 80}
                    }]
                  }
                }]
            }
          }
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.createIngress(this.namespace.metadata.name, result).subscribe(
          resp =>{
              // TODO Handle good response
          },
          err => {
              this.logService.handleError(err);
          }
        );
      }
    });
  }
}