import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { ClusterService }                   from '../../../../services/cluster.service';


@Component({
    selector: 'edit-cluster-dialog',
    templateUrl: 'edit-cluster-dialog.component.html',
})
export class EditClusterDialogComponent {
    cluster: any;
    platforms: any[];

    constructor(
        public logService: LogService,
        public apiService: ApiService,
        public clusterService: ClusterService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<EditClusterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.platforms = this.clusterService.availablePlatforms;
        this.cluster = this.data.deployment;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    edit(): void{
        this.clusterService.updateCluster(this.cluster).subscribe(
            resp =>{
                this.dialogRef.close();
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }
}