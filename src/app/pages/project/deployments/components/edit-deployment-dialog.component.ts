import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { DeploymentService }                from '../../../../services/deployment.service';
import { NamespaceService }                 from '../../../../services/namespace.service';
import { LogService }                       from './../../../../services/log.service';


@Component({
    selector: 'edit-deployment-dialog',
    templateUrl: 'edit-deployment-dialog.component.html',
})
export class EditDeploymentDialogComponent {
    deployment: any;
    showRaw = true;
    public sourceImage: any;

    constructor(
        public deploymentService: DeploymentService,
        public namespaceService: NamespaceService,
        public logService: LogService,
        public dialogRef: MatDialogRef<EditDeploymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.deployment = this.data.deployment;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    formChanged(){
        this.showRaw = false;
        setTimeout(() => {this.showRaw = true}, 100);
    }

    updateDeployment(): void{
        // For some reason this doesn't work, change it to empty   
        var imagePullSecrets = this.deployment.spec.template.spec.imagePullSecrets;
        if(imagePullSecrets.length > 0 && !imagePullSecrets[0]["name"]){
            delete this.deployment.spec.template.spec.imagePullSecrets;
        }               
        this.deploymentService.updateDeployment(this.namespaceService.currentNamespace.metadata.name, this.deployment).subscribe(
            resp =>{
                this.dialogRef.close();
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }

}