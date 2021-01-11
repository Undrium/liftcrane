import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take }  from 'rxjs/operators';
import { Observable } from 'rxjs';


import { ClusterService } from '../cluster.service';
import { ProjectsService } from '../projects.service';
import { SseService } from '../sse.service';
import { KubeBase } from './kube-base';

@Injectable({
  providedIn: 'root'
})
export class OpenshiftApiService extends KubeBase{

  constructor(
    public http: HttpClient,
    public clusterService: ClusterService,
    public projectsService: ProjectsService,
    public sseService: SseService
  ) {
    super(http, clusterService, projectsService, sseService);
    this.platformName = "OPENSHIFT4";
  }

  public getReplicaSets(namespace: string, deploymentName: string): Observable<any> {
    return super.getReplicaSets(namespace, deploymentName, "?labelSelector=app%3D" + deploymentName);
  }

  public getDeploymentConfigsSse(namespace: string, resourceVersion): Observable<any> {
    return super.getUrlAndHeaders().pipe(map(urlAndHeaders => {
      var url = urlAndHeaders[0] + "/oapi/v1/namespaces/" + namespace + "/deploymentconfigs?watch=true&resourceVersion=" + resourceVersion;
      return this.sseService.CreateEventMachine(url, 
        { "method": "GET", "headers": urlAndHeaders[1]});
    })).pipe(take(1));
  }
}
