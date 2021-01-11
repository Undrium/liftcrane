
import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { LogService }                       from '../../../../services/log.service';
import { ApiService }                       from '../../../../services/api.service';
import { LocalStorageService }              from '../../../../services/localstorage.service';
import { ClusterService }       from '../../../../services/cluster.service';

@Component({
    selector: 'add-existing-cluster-dialog',
    templateUrl: 'add-existing-cluster-dialog.component.html',
})
export class AddExistingClusterDialogComponent {
    tabIndex = 0;
    existingCluster: any;
    platforms: any[];
    vendors = ["LOCAL", "AZURE", "AMAZON"];

    constructor(
        public logService: LogService,
        public apiService: ApiService,
        public clusterService: ClusterService,
        public localStorageService: LocalStorageService,
        public dialogRef: MatDialogRef<AddExistingClusterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.platforms = this.clusterService.availablePlatforms;
        this.existingCluster = { "platform": this.platforms[0].value, "vendor": this.vendors[0] };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    createExisting(): void{
        this.clusterService.addCluster(this.existingCluster).subscribe(
            resp =>{
                this.dialogRef.close();
            },
            err => {
                this.logService.handleError(err);
            }
        );
    }
}