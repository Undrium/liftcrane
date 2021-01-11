import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { NamespaceService }       from './../../../../services/namespace.service';
import { ProjectsService }       from './../../../../services/projects.service';


@Component({
    selector: 'create-namespace-dialog',
    templateUrl: 'create-namespace-dialog.component.html',
})
export class CreateNamespaceDialogComponent {
    newNamespace: any;

    constructor(
        public logService: LogService,
        public apiService: ApiService,
        public namespaceService: NamespaceService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<CreateNamespaceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.newNamespace = "default"
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    create(): void{
        this.namespaceService.createNamespace(this.newNamespace, this.projectsService.currentProject.kubernetesIdentifier).subscribe(
            resp =>{
                this.namespaceService.refresh();
                this.dialogRef.close();
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }
}