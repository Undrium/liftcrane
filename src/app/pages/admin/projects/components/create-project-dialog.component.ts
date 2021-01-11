import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { ProjectsService }       from '../../../../services/projects.service';


@Component({
    selector: 'create-project-dialog',
    templateUrl: 'create-project-dialog.component.html',
})
export class CreateProjectDialogComponent {
    newProject: any;

    constructor(
        public logService: LogService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.newProject = {};
        
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    create(): void{
        this.projectsService.createProject(this.newProject).subscribe(
            resp =>{
                this.dialogRef.close();
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }
}