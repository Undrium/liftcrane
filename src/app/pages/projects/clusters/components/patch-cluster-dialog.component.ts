
import { Component, Inject }                from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { PageService }                      from '../../../../services/page.service';
import { ClusterService }                   from '../../../../services/cluster.service';

@Component({
    selector: 'patch-cluster-dialog',
    templateUrl: 'patch-cluster-dialog.component.html',
})
export class PatchClusterDialogComponent {
    patchingRequest = false;
    availableVersions:any = false; 
    clusterPatch: any = {};

    constructor(
        public logService: LogService,
        public apiService: ApiService,
        public clusterService: ClusterService,
        public dialogRef: MatDialogRef<PatchClusterDialogComponent>,
        public pageService: PageService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.init();
    }

    async init(){
        var response = await this.clusterService.getAKSUpgradeProfile(this.data.cluster).toPromise();
        var upgrades = response?.properties?.controlPlaneProfile?.upgrades || [];
        this.availableVersions = [];
        for(var upgradeData of upgrades){
            this.availableVersions.push(upgradeData.kubernetesVersion);
        }
        this.clusterPatch = await this.clusterService.getAKSCluster(this.data.cluster).toPromise();
        // Default
        if(this.availableVersions[0]){
            this.clusterPatch.properties.kubernetesVersion = this.availableVersions[0];
        }

    }

    onNoClick(): void {
        
    }

    patch(): void{
        this.patchingRequest = true;
        this.clusterService.patchAKSCluster(this.data.cluster, this.clusterPatch).subscribe(
            cluster =>{
                this.clusterService.upsertLocalClusterList(cluster);
                this.dialogRef.close();
                this.pageService.displayMessage("Patching " + this.data.cluster.name + " ...");
            },
            err => {
                this.logService.handleError(err);
            }
        ).add(() => {
            //Final
            this.patchingRequest = false;
        });
    }

}




