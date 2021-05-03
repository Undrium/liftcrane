
import { Component, Inject, Directive, Input }                from '@angular/core';
import { 
    FormControl, 
    FormGroup, 
    Validators,
    AbstractControl,
    ValidatorFn,
    NG_VALIDATORS,
    Validator
}                                           from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { ClusterService }       from '../../../../services/cluster.service';

@Component({
    selector: 'create-cluster-dialog',
    templateUrl: 'create-cluster-dialog.component.html',
})
export class CreateClusterDialogComponent {
    createForm: any;
    tabIndex = 0;
    newCluster: any;
    platforms: any[]; 
    locations: any[];
    kubernetesVersions: any[];
    creating: boolean = false;
    showAdvanced = true;

    constructor(
        public logService: LogService,
        public apiService: ApiService,
        public clusterService: ClusterService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<CreateClusterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.platforms = this.clusterService.availablePlatforms;
        this.locations = this.clusterService.availableLocationsAzure;
        this.kubernetesVersions = this.clusterService.availableKubernetesVersionsAzure;
        
        const defaultVersion = this.kubernetesVersions.find(element => element.name.includes("default"));

        this.newCluster = { 
            "name": "", 
            "platform": this.platforms[0].value, 
            "specification":{
                location: "westeurope",
                properties: {
                    networkProfile: {
                        networkPlugin: "kubenet",
                        podCidr: "10.195.0.0/16",
                        loadBalancerSku: "basic"
                    },
                    agentPoolProfiles: [{
                        vmSize: "Standard_D2_v2",
                        count: 2,
                        mode: "System"
                    }],
                    apiServerAccessProfile: {
                        authorizedIPRanges: [],
                        enablePrivateCluster: false
                    },
                    sku: {
                        "name": "Basic",
                        "tier": "Paid"
                    },
                    kubernetesVersion: defaultVersion['value']
                }
            }
        } // End newCluster
        
    }

    formChanged(){
        this.newCluster = Object.assign({}, this.newCluster);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    createNew(): void{
        this.creating = true;
        this.clusterService.createAKSCluster(this.newCluster).subscribe(
            resp =>{
                this.dialogRef.close();
            },
            err => {
                this.logService.handleError(err);
            }
        ).add(() => {
            this.creating = false;
       });
    }

}




