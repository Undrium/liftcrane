import { Injectable }                   from '@angular/core';
import { BehaviorSubject, ReplaySubject, Observable, of }  from 'rxjs';
import { map, take }                           from 'rxjs/operators';

import { ApiService }                       from './api.service';
import { CloudGuardDataSource }                from './cloudguard.data-source';
import { ClusterService }                   from './cluster.service';
import { ProjectsService }                  from './projects.service';
import { LocalStorageService }              from './localstorage.service';
import { PreferenceService }                from './preference.service';

import { ɵMetadataOverrider } from '@angular/core/testing';


@Injectable({providedIn: 'root'})
export class NamespaceService {
    public namespaces: Array<any> = [];
    public namespacesLoading = true;
    namespaces$: BehaviorSubject<any>;
    public currentNamespace: any = {};
    public currentNamespaceSubject: BehaviorSubject<any>;
    // General filters used all over the application for namespaces 
    public filterText: string = "";

    constructor(
        public apiService: ApiService, 
        public cloudguardService: CloudGuardDataSource,
        public clusterService: ClusterService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public preferenceService: PreferenceService
    ) {
        this.namespaces$ = new BehaviorSubject<any>(this.namespaces);    
        this.currentNamespaceSubject = new BehaviorSubject<any>(null);
        // Subscribe to know when namespaces change
        this.clusterService.getCurrentCluster().subscribe((cluster:any) => {
            this.namespacesLoading = false;
            if(!cluster || !cluster.name){return;}
            // Reset
            this.setNamespaces([]);
            this.setCurrentNamespace(null);
            this.refresh();
        });
    }

    refresh(){
        var projectFormatName = this.projectsService.currentProject.formatName;
        this.getProjectsNamespaces(projectFormatName, true);
        // Reset
        this.setCurrentNamespace(null)
    }

    /*
    * Get the current list of namespaces fetched or if not existing a new shallow list of namespaces
    */
   public async getProjectsNamespaces(projectFormatName: string, refresh = false):Promise<any>{
        if((refresh || !this.namespaces || this.namespaces.length == 0) && projectFormatName){
            if(!this.clusterService.currentCluster || !this.clusterService.currentCluster.name){return;}
            this.namespacesLoading = true;
            var clusterFormatName = this.clusterService.currentCluster.formatName;

            this.cloudguardService.getProjectsClustersNamespaces(projectFormatName, clusterFormatName).subscribe((namespaces:any) => {
                this.namespacesLoading = false;
                this.setNamespaces(namespaces);
                // Reset
                this.setCurrentNamespace(null)
                // Check preferences
                this.preferenceService.getPreferenceByName("preferedNamespace"+clusterFormatName).subscribe(preference => {
                    if(typeof preference  == 'undefined') { 
                        // No preference, default to 0
                        if(this.namespaces && this.namespaces[0] && this.namespaces[0].metadata){
                            this.setCurrentNamespaceByName(this.namespaces[0].metadata.name); 
                        }
                        return 
                    }
                    this.setCurrentNamespaceByName(preference['preferenceValue']);       
                });
            });
            // Reset
            this.setCurrentNamespace(null)
        }
        return this.namespaces;
    }

    public setCurrentNamespaceByName(namespaceName: string){
        this.namespaces$.subscribe((namespaces: any) => {
            for(var namespace of namespaces){
                if(namespace.metadata.name == namespaceName){
                    this.setCurrentNamespace(namespace);
                }
            }
        })
    }

    public async setCurrentNamespace(namespace: any){
        // Only update if new
        if(namespace && !this.sameUID(namespace, this.currentNamespace)){

            this.currentNamespace = this.localStorageService.setItem('currentNamespace', namespace); 
            this.preferenceService.addOrUpdatePreference("namespace", this.currentNamespace.metadata.name || "");
            // Notify others
            this.currentNamespaceSubject.next(this.currentNamespace);

        }else if(!namespace){

            this.currentNamespace = this.localStorageService.setItem('currentNamespace', namespace); 
            this.preferenceService.addOrUpdatePreference("namespace", "");
            this.currentNamespaceSubject.next(this.currentNamespace);
            
        }
    }

    public sameUID(namespace1, namespace2){
        if(!namespace1 || !namespace1.metadata || !namespace1.metadata.uid){
            return false;
        }
        if(!namespace2 || !namespace2.metadata || !namespace2.metadata.uid){
            return false;
        }
        if(namespace1.metadata.uid != namespace2.metadata.uid){
            return false;
        }
        return true;
    }

    public filterAndLimitNamespaces(namespaces: any){
        if(!namespaces){
           return namespaces; 
        }
        for(var namespace of namespaces){
            namespace["hide"] = this.filterText != "" && !namespace.metadata.name.includes(this.filterText);
        }
        return namespaces;
    }

    public filteredNamespaces(){
        if(!this.namespaces || !this.namespaces.length){
            return []; 
        }
        if(this.filterText == ""){
            return this.namespaces;
        }
        return this.namespaces.filter(namespace => namespace.metadata.name.includes(this.filterText));
    }

    public setNamespaces(namespaces: any){
        this.namespaces.length = 0;
        [].push.apply(this.namespaces, namespaces);
        this.namespaces$.next(this.namespaces);
        return this.namespaces;
    }

    public getCurrentNamespace(){
        return this.currentNamespaceSubject;
    }

    public createNamespace(namespaceName:string, projectIdentifier: string):Observable<any>{
        return this.apiService.getVendor(this.clusterService.currentCluster).
                createNamespace(namespaceName, projectIdentifier).pipe(map(namescape =>
                    {
                        // Since a namespace has been created we need to renegotiate tokens, therefor fetch the cluster again
                        this.clusterService.refresh(true);
                        return this.namespaces;
                    }
                ));
    }

    public deleteNamespace(namespaceName:string):Observable<any>{
        return this.apiService.getVendor(this.clusterService.currentCluster)
            .deleteNamespace(namespaceName)
            .pipe(map((resp: any) => {
                if(resp && resp.status && resp.status.phase && resp.status.phase == 'Terminating'){
                    this.namespaces.splice(this.namespaces.findIndex(item => item?.metadata?.name === resp?.metadata?.name), 1);
                    if(this.currentNamespace?.metadata?.name == namespaceName){
                        this.setCurrentNamespace(null);
                    }
                }
        }));
    }

    public updateNamespace(namespaceName:string, specification: any):Observable<any>{
        return this.apiService.getVendor(this.clusterService.currentCluster).updateNamespace(specification.metadata.name, specification);
    }

    
}