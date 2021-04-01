import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { ClusterService }                   from '../../../../services/cluster.service';
import { CloudGuardService }                from '../../../../services/cloudguard.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { NamespaceService }                 from '../../../../services/namespace.service';
import { PageService }                      from './../../../../services/page.service';
import { ProjectsService }                  from '../../../../services/projects.service';


@Component({
    selector: 'clone-namespace-dialog',
    templateUrl: 'clone-namespace-dialog.component.html',
})
export class CloneNamespaceDialogComponent {
    cloneForm: any;
    namespace: any;
    changeName: boolean = false;
    validationMessage = "";
    cloneData: any = {
        sourceClusterFormatName: "",
        targetClusterFormatName: "",
        targetNamespaceName: ""
    }

    constructor(
        public logService: LogService,
        public apiService: ApiService,
        public cloudguardService: CloudGuardService,
        public clusterService: ClusterService,
        public namespaceService: NamespaceService,
        public pageService: PageService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<CloneNamespaceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.namespace = data.namespace;
        this.cloneData.targetNamespaceName = data.namespace.metadata.name;
        this.clusterService.getCurrentCluster().subscribe(currentCluster => {
            this.cloneData.sourceClusterFormatName = currentCluster['formatName'];
        });
    }

    

    onNoClick(): void {
        this.dialogRef.close();
    }

    clone(): void{
        var projectFormatName = this.projectsService.currentProject.formatName;
        this.cloudguardService.cloneNamespace(projectFormatName, this.namespace.metadata.name, this.cloneData).subscribe(
            resp =>{
                // We really only want to reload if same target as source
                if(this.cloneData && this.cloneData.targetClusterFormatName && this.cloneData.sourceClusterFormatName){
                    this.pageService.displayMessage("Cloned namespace " + this.namespace.metadata.name + " to Cluster "+this.cloneData.targetClusterFormatName+".");
                    if(this.cloneData.targetClusterFormatName == this.cloneData.sourceClusterFormatName){
                        this.namespaceService.refresh();
                    }
                }
                this.dialogRef.close(this.cloneData);
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }

    formChanged(): void{
        this.validationMessage = "";
        if(this.cloneData.sourceClusterFormatName == this.cloneData.targetClusterFormatName){
            if(this.namespace.metadata.name == this.cloneData.targetNamespaceName){
                this.changeName = true;
                this.validationMessage = "Provide a unique namespace name"
            }
        }
    }

 
}