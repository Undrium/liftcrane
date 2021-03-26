import { Component, Input }                from '@angular/core';
import { MatDialog }                       from '@angular/material/dialog';

import { CloneNamespaceDialogComponent }   from './clone-namespace-dialog.component'
import { ConfirmDialogComponent }          from '../../../../components/confirm-dialog/confirm-dialog.component'

import { NamespaceService }                from '../../../../services/namespace.service';

@Component({
    selector: 'namespace-details',
    templateUrl: 'namespace-details.component.html',
    styleUrls: ['./namespace-details.component.scss']
})
export class NamespaceDetailsComponent {
    @Input() namespace: any;
    @Input() loadEvents: boolean;

    original: any;

    constructor(public namespaceService: NamespaceService,public dialog: MatDialog) {}

    cloneNamespaceDialog(): void {
      const dialogRef = this.dialog.open(CloneNamespaceDialogComponent, {
        data: { namespace: this.namespace }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }

    deleteNamespaceDialog(namespace: any): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: { message: "Confirm deletion of namespace " + namespace.metadata.name }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.namespaceService.deleteNamespace(namespace.metadata.name).subscribe(resp =>{});
  
        }
      });
    }

    
}