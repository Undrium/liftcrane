import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { combineLatest }                    from 'rxjs';

import { CreateDeploymentDialogComponent }  from './components/create-deployment-dialog.component'

import { PageService }        from '../../../services/page.service';
import { ApiService }         from '../../../services/api.service';
import { DeploymentService }  from '../../../services/deployment.service';
import { ClusterService }     from '../../../services/cluster.service';
import { NamespaceService }   from '../../../services/namespace.service';
import { LogService }         from '../../../services/log.service';


@Component({
  selector: 'app-deployments',
  templateUrl: './deployments.component.html',
  styleUrls: ['./deployments.component.scss'],
  providers: [ ApiService ]
})
export class DeploymentsComponent {
  public vendor: any
  public deployments:Array<any> = [];
  public deploymentsEvents;
  // OCP
  public deploymentConfigs:Array<any> = [];
  public deploymentConfigsEvents;
  constructor(
    public apiService: ApiService, 
    public clusterService: ClusterService,
    public dialog: MatDialog,
    public deploymentService: DeploymentService,
    public namespaceService: NamespaceService,
    private activatedRoute: ActivatedRoute,
    public logService: LogService,
    public pageService: PageService
  ) { 
    this.pageService.pageTitle = "Deployments";

    // Do we already have a cluster and namespace in the url?
    this.activatedRoute.params.subscribe((params: Params) => {
      var clusterFormatname = params['clusterFormatname'];
      if(clusterFormatname){
        this.clusterService.setCurrentClusterByName(clusterFormatname)
      }
      var namespace = params['namespace'];
      if(namespace){
        this.namespaceService.setCurrentNamespaceByName(namespace)
      }
    });

    combineLatest([this.clusterService.getCurrentCluster(), this.namespaceService.getCurrentNamespace()])
    .subscribe(([cluster, namespace]) => {
      this.vendor = this.apiService.getVendor(this.clusterService.currentCluster);
      this.deployments = [];
      //Since both OCP4 and Kubernetes use deployments we fetch those first
      this.getDeployments(namespace);
      // OCP4 also has deployment configurations
      if(this.vendor.platformName == "OPENSHIFT4"){
        this.getDeploymentConfigs(namespace);
      }
    });

  }

  // TODO separate Deployment and Deployment Config
  deployDialog(): void {
    const dialogRef = this.dialog.open(CreateDeploymentDialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  getDeployments(namespace: any){
    if(!namespace || !namespace.metadata || !namespace.metadata.name){return}
    this.vendor.getDeployments(namespace.metadata.name).subscribe((res:any) => {
        this.deployments = res.items || []
        // Lets keep this updated by events
        this.handleDeploymentEvents(res.metadata.resourceVersion)
        return res.items || []
      },
      error => {this.logService.handleError(error)}
    );
  }

  getDeploymentConfigs(namespace: any){
    if(!namespace || !namespace.metadata || !namespace.metadata.name){return}
    this.vendor.getDeploymentConfigs(namespace.metadata.name).subscribe((res:any) => {
        this.deployments = res.items || []
        // Lets keep this updated by events
        this.handleDeploymentConfigEvents(res.metadata.resourceVersion)
        return res.items || []
      },
      error => {this.logService.handleError(error)}
    );
  }

  ngOnDestroy() {
    if(this.deploymentsEvents && this.deploymentsEvents['abortController']){
      this.deploymentsEvents['abortController'].abort();
    }
  }

  async handleDeploymentEvents(resourceVersion: number){
    var namespace = this.namespaceService.currentNamespace.metadata.name;
    this.deploymentsEvents = await this.vendor.getDeploymentsSse(namespace, resourceVersion).toPromise();
    this.deploymentsEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.deployments.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.deployments[index] = event.data;
      } 
    })
    this.deploymentsEvents.addEventListener('DELETED', (event:any) => {
      const index = this.deployments.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.deployments.splice(index, 1);
      } 
    })
    this.deploymentsEvents.addEventListener('ADDED', (event:any) => {
      this.deployments.push(event.data);
    })
  }

  async handleDeploymentConfigEvents(resourceVersion: number){
    var namespace = this.namespaceService.currentNamespace.metadata.name;
    this.deploymentConfigsEvents = await this.vendor.getDeploymentsSse(namespace, resourceVersion).toPromise();
    this.deploymentConfigsEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.deploymentConfigs.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.deploymentConfigs[index] = event.data;
      } 
    })
    this.deploymentConfigsEvents.addEventListener('DELETED', (event:any) => {
      const index = this.deploymentConfigs.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.deploymentConfigs.splice(index, 1);
      } 
    })
    this.deploymentConfigsEvents.addEventListener('ADDED', (event:any) => {
      this.deploymentConfigs.push(event.data);
    })
  }

}
