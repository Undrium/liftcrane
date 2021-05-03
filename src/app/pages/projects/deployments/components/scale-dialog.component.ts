import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';


import { DeploymentService }                from '../../../../services/deployment.service';
import { NamespaceService }                from '../../../../services/namespace.service';


@Component({
    selector: 'scale-dialog',
    templateUrl: 'scale-dialog.component.html'
})
export class ScaleDialogComponent {
    deployment: any;
    replicas = 0

    constructor(
        public deploymentService: DeploymentService,
        public namespaceService: NamespaceService,
        public dialogRef: MatDialogRef<ScaleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.deployment = data.deployment;
        this.replicas = data.deployment.spec.replicas;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    scale(): void{
        if(this.deployment.spec.replicas == this.replicas){
            this.dialogRef.close();        
        }
        var deploymentName = this.deployment.metadata.name;
        this.deploymentService.scaleDeployment(this.namespaceService.currentNamespace.metadata.name, deploymentName, this.replicas).subscribe(resp =>{
            this.dialogRef.close();
        }) 
    }

}