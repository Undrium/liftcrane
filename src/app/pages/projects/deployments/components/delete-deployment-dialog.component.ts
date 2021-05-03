import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';


import { DeploymentService }                from '../../../../services/deployment.service';


@Component({
    selector: 'delete-deployment-dialog',
    templateUrl: 'delete-deployment-dialog.component.html'
})
export class DeleteDeploymentDialogComponent {
    deployment: any;
    replicas = 0

    constructor(
        public deploymentService: DeploymentService,
        public dialogRef: MatDialogRef<DeleteDeploymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.deployment = data.deployment;
        this.replicas = data.deployment.spec.replicas;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    deleteDeployment(namespace: string, deploymentName: string): void{
        this.deploymentService.deleteDeployment(namespace, deploymentName).subscribe(resp =>{
            this.dialogRef.close();
        });
    }

}