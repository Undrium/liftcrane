import { Component, Inject, Input }                from '@angular/core';
import { MatDialog }                       from '@angular/material/dialog';

import { ConfirmDialogComponent }         from '../../../../components/confirm-dialog/confirm-dialog.component';

import { LogService }                       from '../../../../services/log.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { ProjectsService }       from '../../../../services/projects.service';
import { ClusterService }       from '../../../../services/cluster.service';
import { CloudGuardDataSource }       from '../../../../services/cloudguard.data-source';


@Component({
    selector: 'edit-project',
    templateUrl: 'edit-project.component.html',
})
export class EditProjectComponent {
    @Input() project : any;

    displayedColumns: string[] = ['username', 'role', 'action'];

    constructor(
        public logService: LogService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public clusterService: ClusterService,
        public cloudGuardDataSource: CloudGuardDataSource,
        public dialog: MatDialog

    ) {}

    ngOnInit() {
        this.clusterService.clusters$.subscribe(clusters => {
            
            for (var cluster of clusters){
                this.clusterService.getFullCluster(cluster.formatName, this.project.formatName);
            } 
         });
    }

    save(): void{
        this.projectsService.updateProject(this.project).subscribe(
            resp =>{

            },
            err => {
                this.logService.handleError(err);
            }
        );
    }


    deleteProjectDialog(project): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '450px',
            data: {
              message: "Confirm deletion of project " + project.name
            }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.projectsService.deleteProject(project).subscribe();
          }
        });
      }

    deleteProjectRole(projectRole): void{
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '450px',
            data: {
              message: "Confirm deletion of project role binding for  " + projectRole.user.username + " in project " + this.project.name + "."
            }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
              this.cloudGuardDataSource.deleteProjectRole(projectRole.id).subscribe((response:any) => {
                  this.cloudGuardDataSource.getProject(this.project.formatName).subscribe((response:any) => {
                      this.project.projectRoles = response.projectRoles;
                      this.projectsService.fetchProjects();
                  });
              });
          }
        });
    }
}