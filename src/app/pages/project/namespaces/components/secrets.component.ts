import { Component, OnInit, Input, ViewEncapsulation }     from '@angular/core';

import { MatDialog }                       from '@angular/material/dialog';
import { ConfirmDialogComponent }         from '../../../../components/confirm-dialog/confirm-dialog.component';

import { ApiService }         from '../../../../services/api.service';
import { ClusterService }     from '../../../../services/cluster.service';

import { ObjectEditorDialogComponent }    from '../../../../components/object-editor-dialog/object-editor-dialog.component';

@Component({
  selector: 'secrets',
  templateUrl: './secrets.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./secrets.component.scss']
})
export class SecretsComponent implements OnInit {
  @Input() namespace: any;
  public vendor: any
  public secrets: Array<any> = [];
  public secretsEvents: any;

  constructor(
    public apiService: ApiService,
    public clusterService: ClusterService,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnDestroy() {
    if(this.secretsEvents['abortController']){
        this.secretsEvents['abortController'].abort();
    }
  }

  ngOnChanges(changes) {

  }
  ngOnInit() {
    this.vendor = this.apiService.getVendor(this.clusterService.currentCluster);  
    this.getSecrets();
  }

  getSecrets(){
    this.vendor.listSecrets(this.namespace.metadata.name).subscribe((res:any) => {
      this.secrets = res.items || []
      // Lets keep this updated by events
      this.handleEvents(res.metadata.resourceVersion)
      return res.items || []
    });
  }

  async handleEvents(resourceVersion: number){
    this.secretsEvents = await this.vendor.getSecretsSse(this.namespace.metadata.name, resourceVersion).toPromise();
    this.secretsEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.secrets.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.secrets[index] = event.data;
      } 
    })
    this.secretsEvents.addEventListener('DELETED', (event:any) => {
      const index = this.secrets.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.secrets.splice(index, 1);
      } 
    })
    this.secretsEvents.addEventListener('ADDED', (event:any) => {
      this.secrets.push(event.data);
    })
  }

  viewSecret(secret): void {
    const dialogRef = this.dialog.open(ObjectEditorDialogComponent, {
        width: '550px',
        data: {
          verb: "Update",
          readOnly: true,
          title: "Secret " + secret.metadata.name,
          object: secret
        }
    });
  }

  deleteSecret(secret): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Confirm deletion of secret " + secret.metadata.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendor.deleteSecret(this.namespace.metadata.name, secret.metadata.name).subscribe();
      }
    });
  }

}