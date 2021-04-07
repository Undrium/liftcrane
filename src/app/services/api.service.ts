import { Injectable }                     from '@angular/core';
import { KubernetesApiService }           from './cloud-apis/api-kubernetes.service';
import { OpenshiftApiService }            from './cloud-apis/api-openshift.service';
import { HarborApiService }               from './cloud-apis/api-harbor.service';
import { AzurecrApiService }              from './cloud-apis/api-azurecr.service';
import { CloudGuardDataSource }              from './cloudguard.data-source';

@Injectable({providedIn:'root'})
export class ApiService {

  constructor(
    public kubernetesApiService: KubernetesApiService,
    public harborApiService: HarborApiService,
    public azurecrApiService: AzurecrApiService,
    public openshiftApiService: OpenshiftApiService,
    public cloudGuardDataSource: CloudGuardDataSource
  ) {}

  public getRegistry(registry: any):any{
    if(registry && registry.provider){
      switch (registry.provider) {
        case "harbor":
          return this.harborApiService.withCredentials(registry);
        case "azure":
          return this.azurecrApiService.withCredentials(registry);
        default:
          return false
      }
    }
    return false
  }
  
  public getVendor(cluster: any):any{
    if(!cluster || !cluster.platform){
      return this.kubernetesApiService;
    }
    switch (cluster.platform) {
      case "KUBERNETES":
        return this.kubernetesApiService;
      case "OPENSHIFT4":
        return this.openshiftApiService;
    }
    return this.kubernetesApiService;
  }

  public getServerApi(){
    return this.cloudGuardDataSource;
  }
}
