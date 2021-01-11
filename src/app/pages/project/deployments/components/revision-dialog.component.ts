import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';


import { ApiService }                       from '../../../../services/api.service';
import { DeploymentService }                from '../../../../services/deployment.service';
import { NamespaceService }                 from '../../../../services/namespace.service';
import { ClusterService }                   from '../../../../services/cluster.service';


@Component({
    selector: 'revision-dialog',
    templateUrl: 'revision-dialog.component.html',
    styleUrls: ['./revision-dialog.component.scss']
})
export class RevisionDialogComponent {
    replicaSets: Array<any>;
    deployment: any;
    vendor: any;
    public replicaSetsEvents: any;
    constructor(
        public apiService: ApiService,
        public clusterService: ClusterService,
        public deploymentService: DeploymentService,
        public namespaceService: NamespaceService,
        public dialogRef: MatDialogRef<RevisionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.deployment = data.deployment;
        this.vendor = this.apiService.getVendor(this.clusterService.currentCluster)
        //@TODO Replace hardcoded namespace with something dynamic
        this.vendor.getReplicaSets(this.namespaceService.currentNamespace.metadata.name, data.deployment.metadata.name).subscribe(
            (res:any) => {
                this.replicaSets = res.items || []
                this.replicaSets.reverse();
                // Lets keep this updated by events
                this.handleReplicaSetsEvents(data.deployment.metadata.name, res.metadata.resourceVersion)
                return res.items || []
            }
        );
    }

    ngOnDestroy() {
        if(this.replicaSetsEvents['abortController']){
            this.replicaSetsEvents['abortController'].abort();
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async handleReplicaSetsEvents(deploymentName: string, resourceVersion: number){
        var namespace = this.namespaceService.currentNamespace.metadata.name;
        this.replicaSetsEvents = await this.vendor.getReplicaSetsSse(namespace, deploymentName, resourceVersion).toPromise();
        this.replicaSetsEvents.addEventListener('MODIFIED', (event:any) => {
            const index = this.replicaSets.findIndex(p => p.metadata.uid === event.data.metadata.uid)
            if(index !== -1) {
                this.replicaSets[index] = event.data;
            } 
        })
        this.replicaSetsEvents.addEventListener('DELETED', (event:any) => {
            const index = this.replicaSets.findIndex(p => p.metadata.uid === event.data.metadata.uid)
            if(index !== -1) {
                this.replicaSets.splice(index, 1);
            } 
        })
        this.replicaSetsEvents.addEventListener('ADDED', (event:any) => {
            this.replicaSets.push(event.data);
        })
    }

    rollbackDeployment(deployment, template): void{
        this.deploymentService.rollbackDeployment(this.namespaceService.currentNamespace.metadata.name, deployment, template).subscribe(resp =>{
            this.dialogRef.close();
        });
    }

}