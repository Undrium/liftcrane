import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, share, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ClusterService } from '../cluster.service';
import { ProjectsService } from '../projects.service';
import { SseService } from '../sse.service';

/*
* Base class to cloud platforms
*/
@Injectable({
  providedIn: 'root'
})
export class KubeBase {

  platformName: string;

  constructor(
    public http: HttpClient,
    public clusterService: ClusterService,
    public projectsService: ProjectsService,
    public sseService: SseService
  ) {
    this.platformName = "BASE";
  }

  public getNodes(cluster: any): Observable<any> {
    return this.get("/api/v1/nodes", cluster).pipe(take(1));
  }

  public getNodesSse(cluster: any, resourceVersion): Observable<any> {
    return this.getUrlAndHeaders(cluster).pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/api/v1/nodes?watch=true";
      return this.sseService.CreateEventMachine(url, { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public listNamespacesSse(resourceVersion): Observable<any> {
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/api/v1/namespaces?watch=true";
      return this.sseService.CreateEventMachine(url, 
      { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public getDeploymentsSse(namespace: string, resourceVersion): Observable<any> {
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/apis/apps/v1/namespaces/" + namespace + "/deployments?watch=1";
      return this.sseService.CreateEventMachine(url, 
        { 
          "method": "GET", 
          "headers": urlAndHeaders[1],
          "resourceVersion": resourceVersion
        });
    })).pipe(take(1));
  }

  public getReplicaSetsSse(namespace: string, deploymentName: string, resourceVersion: number): Observable<any> {
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var params = "?watch=true&labelSelector=k8s-app%3D" + deploymentName;
      var url = urlAndHeaders[0] + "/apis/apps/v1/namespaces/" + namespace + "/replicasets" + params;
      return this.sseService.CreateEventMachine(url, { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public getEndpointsSse(namespace: string, resourceVersion: number): Observable<any> {
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/api/v1/namespaces/" + namespace + "/endpoints?watch=true";
      return this.sseService.CreateEventMachine(url, { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public getSecretsSse(namespace: string, resourceVersion: number): Observable<any> {
    // TODO All SSEs need error checking
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/api/v1/namespaces/" + namespace + "/secrets?watch=true";
      return this.sseService.CreateEventMachine(url, { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public getServicesSse(namespace: string, resourceVersion: number): Observable<any> {
    // TODO All SSEs need error checking
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/api/v1/namespaces/" + namespace + "/services?watch=true";
      return this.sseService.CreateEventMachine(url, { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public getIngressesSse(namespace: string, resourceVersion: number): Observable<any> {
    return this.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/apis/extensions/v1beta1/namespaces/" + namespace + "/ingresses?watch=true";
      return this.sseService.CreateEventMachine(url, { 
        "method": "GET", 
        "headers": urlAndHeaders[1],
        "resourceVersion": resourceVersion
      })
    })).pipe(take(1));
  }

  public listNamespaces(): Observable<any> {
    return this.get("/api/v1/namespaces");
  }

  public listIngresses(namespace: string): Observable<any> {
    return this.get("/apis/extensions/v1beta1/namespaces/"+namespace+"/ingresses");
  }

  public listSecrets(namespace: string): Observable<any> {
    return this.get("/api/v1/namespaces/"+namespace+"/secrets");
  }

  public listServices(namespace: string): Observable<any> {
    return this.get("/api/v1/namespaces/"+namespace+"/services");
  }

  public listEndpoints(namespace: string): Observable<any> {
    return this.get("/api/v1/namespaces/"+namespace+"/endpoints");
  }

  public deleteDeployment(namespace: string, deploymentName: string): Observable<any> {
    return this.delete("/apis/apps/v1/namespaces/" + namespace + "/deployments/" + deploymentName);
  }

  public deleteIngress(namespaceName: string, serviceName: string): Observable<any> {
    return this.delete("/apis/extensions/v1beta1/namespaces/" + namespaceName+"/ingresses/"+serviceName);
  }

  public deleteSecret(namespaceName: string, secretName: string): Observable<any> {
    return this.delete("/api/v1/namespaces/" + namespaceName+"/secrets/"+secretName);
  }

  public deleteService(namespaceName: string, serviceName: string): Observable<any> {
    return this.delete("/api/v1/namespaces/" + namespaceName+"/services/"+serviceName);
  }

  public deleteNamespace(namespaceName: string): Observable<any> {
    return this.delete("/api/v1/namespaces/" + namespaceName);
  }

  public scaleDeployment(namespace: string, deploymentName: string, numberOfReplicas: number): Observable<any> {
    var scaleSpec = {
      "apiVersion": "autoscaling/v1", "kind": "Scale",
      "metadata": { "name": deploymentName, "namespace": namespace },
      "spec": { "replicas": numberOfReplicas }
    };
    return this.patch("/apis/apps/v1/namespaces/" + namespace + "/deployments/" + deploymentName + "/scale", scaleSpec);
  }

  public startDeployment(namespace: string, deploymentName: any): Observable<any> {
    return this.getDeployment(namespace, deploymentName).pipe(
      switchMap(deploymentSpec => {
        var scaleSpec = {
          "apiVersion": "autoscaling/v1", "kind": "Scale",
          "metadata": { "name": deploymentName, "namespace": namespace },
          "spec": { "replicas": 1 }
        };
        // Do we have a saved value somewhere?
        if (deploymentSpec.metadata.annotations && deploymentSpec.metadata.annotations.preferedReplicas) {
          scaleSpec.spec['replicas'] = parseInt(deploymentSpec.metadata.annotations.preferedReplicas);
        }

        var uri = "/apis/apps/v1/namespaces/" + namespace + "/deployments/" + deploymentName + "/scale";
        return this.patch(uri, scaleSpec);
    }));
  }

  public getDeployment(namespace: string, deploymentName: string): Observable<any> {
    return this.get("/apis/apps/v1/namespaces/" + namespace + "/deployments/" + deploymentName);
  }

  public stopDeployment(namespace: string, deploymentName: any): Observable<any> {
    return this.getDeployment(namespace, deploymentName).pipe(
      switchMap((deploymentSpec: any) => {
        var imagePullSecrets = deploymentSpec.spec.template.spec.imagePullSecrets;
        // If it doesn't contain name, we have a bug
        if(imagePullSecrets.length > 0 && !imagePullSecrets[0]["name"]){
            delete deploymentSpec.spec.template.spec.imagePullSecrets;
        }   
        if (deploymentSpec.metadata.annotations) {
          deploymentSpec.metadata.annotations['preferedReplicas'] = "" + deploymentSpec.spec['replicas'];
        } else {
          deploymentSpec.metadata['annotations'] = { 'preferedReplicas': "" + deploymentSpec.spec['replicas'] };
        }
        return this.updateDeployment(namespace, deploymentSpec);  
      }),
      switchMap((response: any) => {
        var scaleSpec = {
          "apiVersion": "autoscaling/v1", "kind": "Scale",
          "metadata": { "name": deploymentName, "namespace": namespace },
          "spec": { "replicas": 0 }
        };
        var uri = "/apis/apps/v1/namespaces/" + namespace + "/deployments/" + deploymentName + "/scale";
        return this.patch(uri, scaleSpec);
      })
    );
  }

  public updateDeployment(namespaceName: string, specification: any): Observable<any> {
    var uri = "/apis/apps/v1/namespaces/" + namespaceName + "/deployments/" + specification.metadata.name;
    return this.patch(uri, specification);
  }

  public updateService(namespaceName: string, specification: any): Observable<any> {
    var uri = "/api/v1/namespaces/" + namespaceName + "/services/" + specification.metadata.name
    return this.patch(uri, specification);
  }

  public updateIngress(namespaceName: string, specification: any): Observable<any> {
    var uri = "/apis/extensions/v1beta1/namespaces/" + namespaceName + "/ingresses/" + specification.metadata.name
    return this.patch(uri, specification);
  }

  public getDeploymentScale(namespace: string, deploymentName: string): Observable<any> {
    var uri = "/apis/apps/v1/namespaces/" + namespace + "/deployments/" + deploymentName + "/scale";
    return this.get(uri);
  }

  public getDeployments(namespace: string): Observable<any> {
    return this.get("/apis/apps/v1/namespaces/" + namespace + "/deployments");
  }

  public getReplicaSets(namespace: string, deploymentName: string, params: string): Observable<any> {
    return this.get("/apis/apps/v1/namespaces/" + namespace + "/replicasets" + params);
  }

  public updateNamespace(namespace: string, specification: any): Observable<any> {
    return this.patch("/api/v1/namespaces/" + namespace, specification);
  }

  public createDeployment(namespace: string, specification: any): Observable<any> {
    return this.post("/apis/apps/v1/namespaces/" + namespace + "/deployments", specification);
  }

  public createNamespace(namespace: string, projectIdentifier: string): Observable<any> {
    var data = { metadata: { name: namespace, labels: {"cloudguard-project": projectIdentifier} } };
    return this.post("/api/v1/namespaces", data);
  }

  public createIngress(namespaceName: string, specification: any): Observable<any> {
    return this.post("/apis/extensions/v1beta1/namespaces/"+ namespaceName+"/ingresses", specification);
  }

  public createService(namespaceName: string, specification: any): Observable<any> {
    return this.post("/api/v1/namespaces/"+ namespaceName+"/services", specification);
  }

  public createSecret(namespace: string, specification: any): Observable<any> {
    return this.post("/api/v1/namespaces/" + namespace + "/secrets", specification);
  }

  public listAllSecrets(): Observable<any> {
    return this.get("/api/v1/secrets");
  }

  public get(uri: string, cluster?): Observable<any> {
    return this.getUrlAndHeaders(cluster).pipe(switchMap(urlAndHeaders => {
      return this.http.get(urlAndHeaders[0] + uri, { headers: urlAndHeaders[1] }).pipe(share())
    }));
  }

  public delete(uri: string, data = {}, cluster?): Observable<any> {
    return this.getUrlAndHeaders(cluster).pipe(switchMap(urlAndHeaders => {
      return this.http.delete(urlAndHeaders[0] + uri, { headers: urlAndHeaders[1] }).pipe(share());
    }));
  }

  public post(uri: string, data = {}, cluster?): Observable<any> {
    return this.getUrlAndHeaders(cluster).pipe(switchMap(urlAndHeaders => {
      return this.http.post(urlAndHeaders[0] + uri, data, { headers: urlAndHeaders[1] }).pipe(share());
    }));
  }

  public patch(uri: string, data = {}, cluster?): Observable<any> {
    return this.getUrlAndHeaders(cluster, "patch").pipe(switchMap(urlAndHeaders => {
      return this.http.patch(urlAndHeaders[0] + uri, data, { headers: urlAndHeaders[1] }).pipe(share());
    }));
  }

  public getUrlAndHeaders(specificCluster?: any, type?: string): Observable<any> {
    var cluster = specificCluster || this.clusterService.currentCluster;
    return this.clusterService.getFullCluster(cluster.formatName, this.projectsService.currentProject.formatName).pipe(map((fullCluster: any) => {
      if (!fullCluster) {
        throw new Error('Could not get cluster ' + cluster.name);
      }
      if (fullCluster && !fullCluster.apiServer) {
        throw new Error('URL is missing for cluster ' + cluster.name);
      }
      if (fullCluster.status && fullCluster.status == 'unavailable') {
        throw new Error('Cluster is not available ' + cluster.name);
      }
      var headers = {};
      if (fullCluster && fullCluster.personalToken) {
        headers['authorization'] = "Bearer " + fullCluster.personalToken;
      }
      if (type == 'patch') {
        headers['Content-Type'] = "application/strategic-merge-patch+json";
      }
      return [fullCluster.apiServer, headers];
    },
      (error: any) => { return ["", {}] }));
  }



}
