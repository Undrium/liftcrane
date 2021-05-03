import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { NamespaceService }                 from '../../../../services/namespace.service';
import { ProjectsService }                  from '../../../../services/projects.service';
import { PageService }                      from '../../../../services/page.service';


@Component({
    selector: 'create-namespace-dialog',
    templateUrl: 'create-namespace-dialog.component.html',
})
export class CreateNamespaceDialogComponent {
    newNamespaceName: string;

    constructor(
        public logService: LogService,
        public pageService: PageService,
        public apiService: ApiService,
        public namespaceService: NamespaceService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<CreateNamespaceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.newNamespaceName = "default"
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    create(): void{
        var kubernetesIdentifier = this.projectsService.currentProject.kubernetesIdentifier;
        this.namespaceService.createNamespace(this.newNamespaceName, kubernetesIdentifier).subscribe(
            resp =>{
                this.namespaceService.refresh();
                this.dialogRef.close();
                this.pageService.displayMessage("Namespace " + this.newNamespaceName + " created in cluster.");
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }
}