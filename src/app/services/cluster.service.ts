import { Injectable }                               from '@angular/core';
import { Observable, BehaviorSubject, of, ReplaySubject  }         from 'rxjs';
import { map, catchError, share, switchMap, take }                   from "rxjs/operators";

import { CloudGuardDataSource }                     from './cloudguard.data-source';
import { LocalStorageService }                      from './localstorage.service';
import { ProfileService }                           from './profile.service';
import { ProjectsService }                          from './projects.service';
import { PreferenceService }                        from './preference.service';


@Injectable({providedIn: 'root'})
export class ClusterService {
    // General filters used all over the application for clusters 
    public filterText: string = "";
    //Flag for components to check
    public clustersAreBeingFetched = false;
    // List with loaded clusters
    public clusters: Array<any> = [];
    // When needed update 
    public clusters$: ReplaySubject<Array<any>>; 
    // Selected cluster
    public currentCluster: any = {};
    // Subject to subscribe to for selected (current cluster)
    public currentClusterSubject: BehaviorSubject<{currentCluster: any}>; 
    // Cluster observers
    public clusterFetch$ = {};
    // Platforms to pick when creating or editing cluster 
    // @todo maybe add this to a config instead
    public availablePlatforms = [
        {"name": "Kubernetes", "value": "KUBERNETES"},
        {"name": "OpenShift 4.X", "value": "OPENSHIFT4"}
    ];
    // @todo create this somewhere else
    public availableKubernetesVersionsAzure = [
        {"name": "1.20.2 (preview)", "value": "1.20.2"},
        {"name": "1.19.7", "value": "1.19.7"},
        {"name": "1.19.6", "value": "1.19.6"},
        {"name": "1.18.14 (default)", "value": "1.18.14"},
        {"name": "1.18.10", "value": "1.18.10"}
    ];
    // @todo maybe fetch these from somewhere 
    public availableLocationsAzure = [
        {name: "Australia East", value: "australiaeast"},
        {name: "Brazil South", value: "brazilsouth"},
        {name: "Canada Central", value: "canadacentral"},
        {name: "Canada East", value: "canadaeast"},
        {name: "Central India", value: "centralindia"},
        {name: "Central US", value: "centralus"},
        {name: "East Asia", value: "eastasia"},
        {name: "East US", value: "eastus"},
        {name: "East US 2", value: "eastus2"},
        {name: "Japan East", value: "japaneast"},
        {name: "Japan West", value: "japanwest"},
        {name: "Korea Central", value: "koreacentral"},
        {name: "Korea South", value: "koreasouth"},
        {name: "North Central US", value: "northcentralus"},
        {name: "North Europe", value: "northeurope"},
        {name: "South Central US", value: "southcentralus"},
        {name: "South East Asia", value: "southeastasia"},
        {name: "South India", value: "southindia"},
        {name: "UK South", value: "uksouth"},
        {name: "UK West", value: "ukwest"},
        {name: "West Central US", value: "westcentralus"},
        {name: "West Europe", value: "westeurope"},
        {name: "West India", value: "westindia"},
        {name: "West US", value: "westus"},
        {name: "West US 2", value: "westus2"}
    ];

    constructor(
        public cloudGuardDataSource: CloudGuardDataSource, 
        public localStorageService: LocalStorageService,
        public profileService: ProfileService,
        public projectsService: ProjectsService,
        public preferenceService: PreferenceService
        ) { 
        this.clusters$ = new ReplaySubject<Array<any>>(1);
        this.currentCluster = this.localStorageService.getItem('currentCluster', {}); 
        this.currentClusterSubject = new BehaviorSubject<{currentCluster: any}>(this.currentCluster);

        this.projectsService.currentProjectSubject.subscribe((project: any) => {
            if(project && project.formatName){
                this.getProjectsClusters(project.formatName, true);
            }
        });

    }

    public refresh(cluster){
        delete cluster.personalToken;
        delete cluster.status;
        cluster['status'] = 'fetching';
        return this.getFullCluster(cluster.formatName, this.projectsService.currentProject.formatName).toPromise().then(cluster => {
            if(this.currentCluster && this.currentCluster.formatName == cluster?.formatName){
                this.setCurrentCluster(cluster);
            }
        });
    }

    public refreshCurrentCluster(){
        if(this.currentCluster?.formatName){
            this.refresh(this.currentCluster);
        }
    }

    public async setCurrentClusterByName(formatName: string){
        this.getFullCluster(formatName, this.projectsService.currentProject.formatName).pipe(map(cluster => {
            this.setCurrentCluster(cluster);
        })).pipe(take(1)).subscribe();
    }

    public async setCurrentCluster(cluster: any, dirty = false){
        var previousCluster = this.currentCluster;
        this.currentCluster = this.localStorageService.setItem('currentCluster', cluster); 
        
        if(!this.currentCluster && previousCluster){
            // This is a reset of currentCluster, notify the rest of the application
            this.currentClusterSubject.next(this.currentCluster);
            return;
        }

        // We do not want to spam change if same cluster and not dirty
        if((previousCluster?.formatName != this.currentCluster?.formatName) || dirty){
            this.currentClusterSubject.next(this.currentCluster);
        }
        
        // If a dirty cluster it also need to be fetched, do that afterwards
        if(dirty){
            this.getFullCluster(cluster.formatName, this.projectsService.currentProject.formatName).pipe(map(cluster => {
                this.setCurrentCluster(cluster);
            })).pipe(take(1)).subscribe();
        }
    }

    public getCurrentCluster(){
        return this.currentClusterSubject;
    }

    public updateClusterList(){

    }

    /*
    * Get the current list of clusters fetched or if not existing a new shallow list of clusters
    */
    public async getProjectsClusters(projectFormatName: string, refresh = false):Promise<any>{
        if((refresh || !this.clusters || this.clusters.length == 0) && projectFormatName){
            this.clustersAreBeingFetched = true;
            let fetchedClusters = await this.cloudGuardDataSource.getProjectsClusters(projectFormatName).toPromise();
            this.clustersAreBeingFetched = false;
            this.clusters = this.localStorageService.setItem('clusters-'+projectFormatName, fetchedClusters);
        }
        // Determine if a cluster should be selected in select components
        this.preferenceService.getPreferenceByName("cluster").subscribe(preference => {
            if(typeof preference  === 'undefined') { 
                // No preference, default to 0
                if(this.clusters.length){
                    this.setCurrentClusterByName(this.clusters[0].formatName); 
                }
                return
            }else if(this.clusters.length && this.clusters.length == 1){
                this.setCurrentClusterByName(this.clusters[0].formatName); 
                return
            }
            this.setCurrentClusterByName(preference['preferenceValue']);  
            if(this.currentCluster?.formatName && this.clusters[0] && this.clusters[0].formatName == this.currentCluster.formatName){
                // Trigger this for other services to know a refresh has happened
                this.setCurrentClusterByName(this.clusters[0].formatName);
            }
        });

        this.clusters$.next(this.clusters);
        return this.clusters;
    }

    /*
    * Get a cluster containing all the details about the cluster
    */
    public getFullCluster(formatName, projectFormatName):Observable<any>{
        // Since we do not know, wait on a cluster list
        return this.clusters$.pipe(take(1)).pipe(switchMap((clusters) => {
            let cluster = clusters.find(el => el.formatName === formatName);
            if(!cluster){
                return of(false);
            }
            if(!cluster.status){
                cluster['status'] = "fetching";
            }
            if(cluster && cluster.status && cluster.status == 'unavailable'){
                return of(cluster);  
            }
            if(cluster){
                cluster.status = "fetched";
            }

            // Do we need to fetch the cluster?
            if(!cluster || (cluster && !cluster.personalToken)){
                cluster.status = "fetching";
                var identifier = cluster.formatName + projectFormatName;
                
                if(!this.clusterFetch$[identifier] && projectFormatName) {
                    this.clusterFetch$[identifier] 
                        = this.cloudGuardDataSource.getProjectsCluster(projectFormatName, cluster.formatName);
                }
                return this.clusterFetch$[identifier].pipe(
                    map((fetchedCluster: any)=>{
                        if(!fetchedCluster || !fetchedCluster.name){return false;}
                        // Merge new properties into the existing cluster
                        Object.assign(cluster, fetchedCluster);
                        cluster.status = cluster.personalToken == "" ? "unavailable" : "fetched";
                        this.localStorageService.setItem('clusters-'+projectFormatName, this.clusters);
                        return cluster;
                    }),
                    catchError(err => { 
                        cluster.status = "unavailable";
                        // Persist
                        this.localStorageService.setItem('clusters-'+projectFormatName, this.clusters); 
                        throw err;
                    })
                );
            }

            // We have a cluster
            return of(cluster);          
        
        }));
        
    } // End getFullCluster

    public filteredClusters(){
        if(!this.clusters || !this.clusters.length){
            return []; 
        }
        if(this.filterText == ""){
            return this.clusters;
        }
        return this.clusters.filter(cluster => cluster.name.includes(this.filterText));
    }


    public removeFromLocalClusterList(clusterToDelete: any){
        if(this.currentCluster && this.currentCluster.formatName == clusterToDelete['formatName']){
            this.setCurrentCluster(null);
        }
        for (let [index, cluster] of this.clusters.entries()) {
            if(clusterToDelete['formatName'] == cluster.formatName){
                this.clusters.splice(index, 1);
                // Update local storage aswell
                this.localStorageService.setItem('clusters-'+this.projectsService.currentProject.formatName, this.clusters);
                break;
            }
        }
        
    }

    public upsertLocalClusterList(newCluster: any){
        var found = false;
        for (let [index, cluster] of this.clusters.entries()) {
            found = newCluster['formatName'] == cluster.formatName
            if(found){
                this.clusters[index] = newCluster;
                break;
            }
        }
        if(!found){
            this.clusters.push(newCluster);
        }
        // Update local storage aswell
        this.localStorageService.setItem('clusters-'+this.projectsService.currentProject.formatName, this.clusters);
    }

    public getAKSKubeConfig(cluster: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.getAKSKubeConfig(projectFormatName, cluster.name);
    }

    public getAKSUpgradeProfile(cluster: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.getAKSUpgradeProfile(projectFormatName, cluster.name);
    }

    public getAKSCluster(cluster: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.getAKSCluster(projectFormatName, cluster.name);
    }

    public patchAKSCluster(cluster: any, clusterPatch: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.patchAKSCluster(projectFormatName, cluster.name, clusterPatch);
    }

    public deleteAKSCluster(clusterToDelete: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.deleteAKSCluster(projectFormatName, clusterToDelete.name).pipe(map(cluster => {
            this.removeFromLocalClusterList(clusterToDelete);
            return cluster;
        }));
    }

    public createAKSCluster(data: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.createAKSCluster(projectFormatName, data).pipe(map(cluster => {
            this.upsertLocalClusterList(cluster);
            return cluster;
        }));
    }

    public addCluster(cluster: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.addCluster(projectFormatName, cluster).pipe(map(cluster => {
            this.upsertLocalClusterList(cluster);
            return cluster;
        }));
    }

    public updateCluster(cluster: any): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.updateCluster(projectFormatName, cluster).pipe(map(cluster => {
            this.upsertLocalClusterList(cluster);
            return cluster;
        }));
    }

    public deleteCluster(clusterToDelete): Observable<any>{
        var projectFormatName = this.projectsService.getCurrentProjectFormatName();
        return this.cloudGuardDataSource.deleteCluster(projectFormatName, clusterToDelete.formatName).pipe(map(resp => {
            this.removeFromLocalClusterList(clusterToDelete);
            return resp;
        }));
    }

}