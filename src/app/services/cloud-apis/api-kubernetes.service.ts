import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClusterService } from '../cluster.service';
import { ProjectsService } from '../projects.service';
import { SseService } from '../sse.service';
import { KubeBase } from './kube-base';

/*
* The bridge to the MASP API, to be used for websockets, httprequests and
* token negotiation
*/
@Injectable({
  providedIn: 'root'
})
export class KubernetesApiService extends KubeBase{

  constructor(
    public http: HttpClient,
    public clusterService: ClusterService,
    public projectsService: ProjectsService,
    public sseService: SseService
  ) {
    super(http, clusterService, projectsService, sseService);
    this.platformName = "KUBERNETES";
  }

  public getReplicaSets(namespace: string, deploymentName: string): Observable<any> {
    return super.getReplicaSets(namespace, deploymentName, "?labelSelector=k8s-app%3D" + deploymentName);
  }

  
}
