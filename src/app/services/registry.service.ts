import { Injectable }       from '@angular/core';
import { Observable, BehaviorSubject }       from 'rxjs';
import { map, catchError }                  from "rxjs/operators";


import { CloudGuardDataSource }                        from './cloudguard.data-source';
import { ClusterService }                              from './cluster.service';
import { ProfileService }                              from './profile.service';
import { LocalStorageService }                      from './localstorage.service';

import { ApiService }       from './api.service';

@Injectable({providedIn: 'root'})
export class RegistryService {
    private registry:any;
    public registries: Array<any> = [];
    public registries$: BehaviorSubject<Array<any>>; 
    private clusterApi:any;
    private registryApi:any;
    constructor(
        public cloudGuardDataSource: CloudGuardDataSource, 
        public clusterService: ClusterService,
        public localStorageService: LocalStorageService, 
        public apiService: ApiService, 
        public profileService: ProfileService
    ) {
        profileService.user$.subscribe((user) => {
            if(user && user.token){
                this.getRegistries()
            }
        })
        this.registries$ = new BehaviorSubject<Array<any>>(this.registries);

    }

    public withRegistry(registry:any):RegistryService{
        this.registry = registry;
        this.clusterApi = this.apiService.getVendor(this.clusterService.currentCluster);
        this.registryApi = this.apiService.getRegistry(this.registry);
        return this;
    }

    public createSecret(namespace: string, spec: any):Observable<any>{
        return this.clusterApi.createSecret(namespace, spec);
    }

    public createBareSecretSpec():any{
        return {
            apiVersion: "v1", kind: "Secret", type: "kubernetes.io/dockerconfigjson", metadata: { name: "" },
            data: {
                ".dockerconfigjson": "",
            },
        }
    }

    /*
    * Get the current list of registries fetched or if not existing a new shallow list of registries
    */
   public async getRegistries(refresh = false):Promise<any>{
        if(refresh || !this.registries || this.registries.length == 0){
            let fetchedRegistries = await this.cloudGuardDataSource.getRegistries().toPromise();
            this.registries = this.localStorageService.setItem('registries', fetchedRegistries);
        }
        this.registries$.next(this.registries);
        return this.registries;
    }

    public createRegistry(name: string, provider: string, url: string, email: string, username: string, password: string, secret: string): Observable<any>{
        return this.cloudGuardDataSource.createRegistry({name:name, provider:provider, url:url,email:email,username:username,password:password,secret:secret}).pipe(map(registry => {
          return registry;
        }));
    }

    public deleteRegistry(formatName): Observable<any>{
        return this.cloudGuardDataSource.deleteRegistry(formatName).pipe(map(resp => {
          return resp;
        }));
    }

}