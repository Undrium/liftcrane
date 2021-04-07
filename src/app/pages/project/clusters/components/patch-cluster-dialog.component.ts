
import { Component, Inject }                from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { PageService }                      from '../../../../services/page.service';
import { ClusterService }                   from '../../../../services/cluster.service';
import { CloudGuardDataSource }             from '../../../../services/cloudguard.data-source';

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
        public cloudGuardDataSource: CloudGuardDataSource,
        public dialogRef: MatDialogRef<PatchClusterDialogComponent>,
        public pageService: PageService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.init();
    }

    async init(){
        var response = await this.cloudGuardDataSource.getAKSUpgradeProfile(this.data.cluster.formatName).toPromise();
        var upgrades = response?.properties?.controlPlaneProfile?.upgrades || [];
        this.availableVersions = [];
        for(var upgradeData of upgrades){
            this.availableVersions.push(upgradeData.kubernetesVersion);
        }
        this.clusterPatch = await this.cloudGuardDataSource.getAKSCluster(this.data.cluster.formatName).toPromise();
        // Default
        if(this.availableVersions[0]){
            this.clusterPatch.properties.kubernetesVersion = this.availableVersions[0];
        }

    }

    onNoClick(): void {
        
    }

    patch(): void{
        this.patchingRequest = true;
        this.cloudGuardDataSource.patchAKSCluster(this.data.cluster.formatName, this.clusterPatch).subscribe(
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




