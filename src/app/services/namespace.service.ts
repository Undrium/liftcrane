import { Injectable }                   from '@angular/core';
import { BehaviorSubject, ReplaySubject, Observable, of }  from 'rxjs';
import { map, take }                           from 'rxjs/operators';

import { ApiService }                   from './api.service';
import { ClusterService }               from './cluster.service';
import { ProjectsService }               from './projects.service';
import { LocalStorageService }          from './localstorage.service';
import { PreferenceService } from './preference.service';
import { ɵMetadataOverrider } from '@angular/core/testing';


@Injectable({providedIn: 'root'})
export class NamespaceService {
    public namespaces: Array<any> = [];
    namespaces$: ReplaySubject<Array<any>>;
    public currentNamespace: any = {};
    public currentNamespaceSubject: BehaviorSubject<any>;

    constructor(
        public apiService: ApiService, 
        public clusterService: ClusterService,
        public projectsService: ProjectsService,
        public localStorageService: LocalStorageService,
        public preferenceService: PreferenceService
    ) {
        if(this.localStorageService.isExist('namespaces')){
            this.namespaces = this.localStorageService.getItem('namespaces');
        }
        this.namespaces$ = new ReplaySubject<Array<any>>(1);    
        this.currentNamespaceSubject = new BehaviorSubject<any>(null);
        // Subscribe to know when namespaces change
        this.clusterService.getCurrentCluster().subscribe((cluster:any) => {
            if(!cluster || !cluster.name){return;}
            // Reset
            this.setNamespaces([]);
            this.setCurrentNamespace(null)
            this.setNamespaces(cluster.namespaces);
            // Check preferences
            this.preferenceService.getPreferenceByName("preferedNamespace"+cluster.formatName).subscribe(preference => {
                if(typeof preference  == 'undefined') { 
                    // No preference, default to 0
                    if(cluster.namespaces[0] && cluster.namespaces[0].metadata){
                        this.setCurrentNamespaceByName(cluster.namespaces[0].metadata.name); 
                    }
                    return 
                }
                this.setCurrentNamespaceByName(preference['preferenceValue']);       
            });
        });
    }

    refresh(){
        this.clusterService.refresh();
    }

    /*
    * Get the current list of clusters fetched or if not existing a new shallow list of clusters
    */
   public async getProjectsNamespaces(projectFormatName: string, refresh = false):Promise<any>{
        if((refresh || !this.namespaces || this.namespaces.length == 0) && projectFormatName){
            this.clusterService.getCurrentCluster().subscribe((cluster:any) => {
                if(!cluster || !cluster.name){return;}
                this.clusterService.getFullCluster(cluster.formatName, projectFormatName).pipe(take(1)).subscribe(cluster => { 
                    this.setNamespaces(cluster.namespaces);
                    this.namespaces$.next(this.namespaces);
                });
                // Reset
                this.setCurrentNamespace(null)
            });
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
        return this.apiService.getVendor(this.clusterService.currentCluster).createNamespace(namespaceName, projectIdentifier);
    }

    public deleteNamespace(namespaceName:string):Observable<any>{
        return this.apiService.getVendor(this.clusterService.currentCluster)
            .deleteNamespace(namespaceName)
            .pipe(map((resp: any) => {
                if(resp && resp.status && resp.status.phase && resp.status.phase == 'Terminating'){
                    this.namespaces.splice(this.namespaces.findIndex(item => item.metadata.name === resp.metadata.name), 1);
                }
        }));
    }

    public updateNamespace(namespaceName:string, specification: any):Observable<any>{
        return this.apiService.getVendor(this.clusterService.currentCluster).updateNamespace(specification.metadata.name, specification);
    }

    
}