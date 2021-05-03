
import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

declare const YAML: any;
import { LogService }                       from '../../../../services/log.service';
import { ClusterService }                   from '../../../../services/cluster.service';
import { PageService }                      from '../../../../services/page.service';

@Component({
    selector: 'add-existing-cluster-dialog',
    templateUrl: 'add-existing-cluster-dialog.component.html',
    styleUrls: ['add-existing-cluster-dialog.component.scss']
})
export class AddExistingClusterDialogComponent {
    authType = "token";
    kubeConfigString = "";
    kubeConfigObject: any = {};
    tabIndex = 0;
    existingCluster: any;
    platforms: any[]; 
    vendors = ["LOCAL", "AZURE", "AMAZON"];

    constructor(
        public logService: LogService,
        public clusterService: ClusterService,
        public pageService: PageService,
        public dialogRef: MatDialogRef<AddExistingClusterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.platforms = this.clusterService.availablePlatforms;
        this.existingCluster = { 
            "apiServer": "",
            "platform": this.platforms[0].value, 
            "vendor": this.vendors[0] 
        };
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

    pasteKubeConfig(event){
        try{
            this.kubeConfigObject = YAML.parse(this.kubeConfigString);
        }catch(error){
            this.pageService.displayMessage("Could not parse KubeConfig, wrong format?");
            console.log(error);
        }
        // If we just find one, then we can parse
        if(this.kubeConfigObject?.clusters?.length == 1){
            this.parseKubeConfig(this.kubeConfigObject?.clusters?.name)
        }
    }

    parseKubeConfig(clusterName){
        this.kubeConfigString = "";

        this.existingCluster.name = clusterName;

        if(!this.kubeConfigObject?.clusters || !this.kubeConfigObject?.clusters?.length){
            this.pageService.displayMessage("Cluster-list missing in KubeConfig");
            return;
        }

        var cluster = this.kubeConfigObject?.clusters.find(cluster => cluster.name === clusterName);

        if(cluster?.cluster?.server){
            this.existingCluster.apiServer = cluster?.cluster?.server;
        }else{
            this.pageService.displayMessage("Could not find API server in KubeConfig");
        }

        var user = this.kubeConfigObject?.users.find(user => user.name === clusterName);
        
        if(user?.user?.['client-certificate-data']){
            this.existingCluster.certData = user?.user?.['client-certificate-data'];
            this.authType = "certificate";
        }else{
            this.pageService.displayMessage("Could not find client-certificate-data in KubeConfig");
        }

        if(user?.user?.['client-key-data']){
            this.existingCluster.keyData = user?.user?.['client-key-data'];
            this.authType = "certificate";
        }else{
            this.pageService.displayMessage("Could not find client-key-data in KubeConfig");
        }

        this.tabIndex = 0;
        
        this.kubeConfigObject = {};
    }

    resetKubeConfig(){
        this.kubeConfigObject = {};
        this.kubeConfigString = "";
    }

    
}