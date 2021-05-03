import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { DeploymentService }                from '../../../../services/deployment.service';
import { NamespaceService }                from '../../../../services/namespace.service';
import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { RegistryService }                       from '../../../../services/registry.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';

@Component({
    selector: 'create-deployment-dialog',
    templateUrl: 'create-deployment-dialog.component.html',
})
export class CreateDeploymentDialogComponent {
    deploymentSpec: any;
    registries: any;
    sourceRegistry: any;
    repositoryTags: any;
    registry: any;
    public sourceImage: string = "url";

    constructor(
        public deploymentService: DeploymentService,
        public namespaceService: NamespaceService,
        public logService: LogService,
        public apiService: ApiService,
        public registryService: RegistryService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<CreateDeploymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.deploymentSpec = this.deploymentService.createBareDeploymentSpec();
        this.registries = this.localStorageService.getItem('registries') || [];
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    deploy(): void{
        if(this.registry){
            var secretSpec = this.registryService.createBareSecretSpec();
            secretSpec.metadata.name = this.registry.secretname;
            secretSpec.data[".dockerconfigjson"] = this.registry.secret;
            // We have a secret which needs to created first
            this.registryService.withRegistry(this.registry).createSecret(this.namespaceService.currentNamespace.metadata.name, secretSpec).subscribe((res:any) => {
                this.deploymentSpec.spec.template.spec.containers[0].image = this.deploymentSpec.spec.template.spec.containers[0].image.replace("https://","");
                this.deploymentSpec.spec.template.spec.containers[0].image = this.deploymentSpec.spec.template.spec.containers[0].image.replace("http://","");
                this.deploymentSpec.spec.template.spec.imagePullSecrets[0].name = this.registry.secretname;
                this.deploymentService.createDeployment(this.namespaceService.currentNamespace.metadata.name, this.deploymentSpec).subscribe(
                    resp =>{
                        this.dialogRef.close();
                    },
                    err => {
                        this.logService.handleError(err);
                    }
                );
            });
        }else{
            this.deploymentService.createDeployment(this.namespaceService.currentNamespace.metadata.name, this.deploymentSpec).subscribe(
                resp =>{
                    this.dialogRef.close();
                },
                err => {
                    this.logService.handleError(err);
                }
            );
        }
    }

    public registryChange(id:number){
        this.registry = this.registries[id];
        var api = this.apiService.getRegistry(this.registry);
        
        api.getAllTags().subscribe((res:any) => {
            this.repositoryTags = res;
        });

    }

}