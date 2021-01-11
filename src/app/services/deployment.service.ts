import { Injectable }       from '@angular/core';
import { Observable }       from 'rxjs';

import { ApiService }       from './api.service';
import { ClusterService }     from './cluster.service';

@Injectable({providedIn: 'root'})
export class DeploymentService {
    constructor(
        public apiService: ApiService,
        public clusterService: ClusterService
    ) {}

    public scaleDeployment(namespace: string, deploymentName: any, numberOfReplicas: number):Observable<any>{
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        return vendor.scaleDeployment(namespace, deploymentName, numberOfReplicas);
    }

    public startDeployment(namespace: string, deploymentName: any):Observable<any>{
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        return vendor.startDeployment(namespace, deploymentName);
    }

    public deleteDeployment(namespace: string, deploymentName: any):Observable<any>{
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        return vendor.deleteDeployment(namespace, deploymentName);
    }

    public stopDeployment(namespace: string, deploymentName: any):Observable<any>{
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        return vendor.stopDeployment(namespace, deploymentName);
    }

    public updateDeployment(namespace: string, deploymentSpec: any):Observable<any>{
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        return vendor.updateDeployment(namespace, deploymentSpec);
    }

    public rollbackDeployment(namespace: string, deployment:any, template: any):Observable<any>{
        deployment.spec.template = template;
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        return vendor.updateDeployment(namespace, deployment);
    }

    public createDeployment(namespace: string, deploymentSpec: any):Observable<any>{
        var vendor = this.apiService.getVendor(this.clusterService.currentCluster);
        deploymentSpec.metadata.labels["k8s-app"] = deploymentSpec.metadata.name;
        deploymentSpec.spec.template.metadata.labels["k8s-app"] = deploymentSpec.metadata.name;
        deploymentSpec.spec.template.spec.containers[0].name = deploymentSpec.metadata.name;
        deploymentSpec.spec.selector.matchLabels["k8s-app"] = deploymentSpec.metadata.name;
        return vendor.createDeployment(namespace, deploymentSpec);
    }

    public createBareDeploymentSpec():any{
        return {
            apiVersion: "apps/v1", kind: "Deployment", metadata: { name: "appappapp", labels: {"k8s-app": ""} },
            spec: {
                replicas: 1, selector: {matchLabels: {"k8s-app": ""}},
                template: {
                    metadata: { labels: {"k8s-app": "" }},
                    spec:{
                        containers: [{name: "", image: "k8s.gcr.io/echoserver:1.4"}],
                        imagePullSecrets: [{name: ""}]
                    }
                }
            }
        }
    }

}