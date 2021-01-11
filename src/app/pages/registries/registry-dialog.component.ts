import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';
import { RegistryService }                from './../../services/registry.service';



@Component({
    selector: 'registry-dialog',
    templateUrl: 'registry-dialog.component.html',
})
export class RegistryDialogComponent {
    registry: any;
    secretSpec:any;
    public providers: Array<any>;

    constructor(
        public dialogRef: MatDialogRef<RegistryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, 
        public registryService: RegistryService,
    ) {
        this.registry = {name:null,username:null,password:null,email:null};
        this.secretSpec = this.registryService.createBareSecretSpec();

        this.providers = [
            {
                value: "azure",
                viewValue: "Azure Container Registry"
            },
            {
                value: "harbor",
                viewValue: "Harbor Container Registry"
            },
        ];
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    add(): void{
        var auth = btoa(this.registry.username+':'+this.registry.password);
        var secret = btoa('{"auths":{"'+this.registry.url+'":{"username":"'+this.registry.username+'","password":"'+this.registry.password+'","email":"'+this.registry.email+'","auth":"'+auth+'"}}}')
        this.registryService.createRegistry(this.registry.name, this.registry.provider, this.registry.url, this.registry.email, this.registry.username, this.registry.password, secret).subscribe(registry=>{
            this.registryService.getRegistries(true)
            this.dialogRef.close();
        });
    }

   

}