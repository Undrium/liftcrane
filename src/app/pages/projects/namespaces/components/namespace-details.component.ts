import { Component, Input }                 from '@angular/core';
import { MatDialog }                        from '@angular/material/dialog';

import { CloneNamespaceDialogComponent }    from './clone-namespace-dialog.component'
import { ConfirmDialogComponent }           from '../../../../components/confirm-dialog/confirm-dialog.component'

import { LogService }                       from '../../../../services/log.service';
import { NamespaceService }                 from '../../../../services/namespace.service';
import { PageService }                      from '../../../../services/page.service';

@Component({
    selector: 'namespace-details',
    templateUrl: 'namespace-details.component.html',
    styleUrls: ['./namespace-details.component.scss']
})
export class NamespaceDetailsComponent {
    @Input() namespace: any;
    @Input() loadEvents: boolean;
    deleting = false;

    original: any;

    constructor(
      public namespaceService: NamespaceService, 
      public logService: LogService,
      public pageService: PageService, 
      public dialog: MatDialog
    ) {}

    cloneNamespaceDialog(): void {
      const dialogRef = this.dialog.open(CloneNamespaceDialogComponent, {
        data: { namespace: this.namespace }
      });
      dialogRef.afterClosed().subscribe(cloneData => {});
    }

    deleteNamespaceDialog(namespace: any): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '450px',
          data: { 
            title: "Confirm Deletion",
            message: "This will mark namespace " + namespace.metadata.name + " for termination and all it's resources will be removed." 
          }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleting = true;
          this.namespaceService.deleteNamespace(namespace.metadata.name).subscribe(
            resp =>{
              this.pageService.displayMessage("Namespace " + namespace.metadata.name + " deleted."); 
            },
            err => {
                this.logService.handleError(err);
            },
            () => {this.deleting = false;}
          );
        }
      });
    }

    
}