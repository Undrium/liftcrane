import { 
  Component, 
  OnInit, 
  Input, 
  ViewEncapsulation 
}                               from '@angular/core';
import { MatDialog }            from '@angular/material/dialog';

import { NodeDialogComponent }  from './node-dialog.component'

import { CloudGuardService }    from '../../../../services/cloudguard.service';
import { LogService }           from '../../../../services/log.service';
import { PageService }          from '../../../../services/page.service';
import { ApiService }           from '../../../../services/api.service';
import { ClusterService }       from '../../../../services/cluster.service';
import { ProjectsService }       from '../../../../services/projects.service';


@Component({
  selector: 'cluster-row',
  templateUrl: './cluster-row.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cluster-row.component.scss']
})
export class ClusterRowComponent implements OnInit {
  @Input() cluster: any;
  public vendor: any
  nodes: Array<any> = [];
  pollTimeout = null;
  public nodeEvents: any;

  constructor(
    public cloudGuardService: CloudGuardService, 
    public clusterService: ClusterService,
    public projectsService: ProjectsService,
    public pageService: PageService, 
    public logService: LogService,
    public apiService: ApiService,
    public dialog: MatDialog
    ) { 
      
  }

  async ngOnInit() {
    this.vendor = this.apiService.getVendor(this.cluster);
    this.initNodes(this.cluster);
    if(this.cluster.vendor == "AZURE" && this.cluster.vendorState == "Creating" && !this.pollTimeout){
      this.pollTimeout = this.pollAzureClusterState();
    }
  }

  ngOnDestroy() {
    if(this.nodeEvents && this.nodeEvents['abortController']){
        this.nodeEvents['abortController'].abort();
    }
    clearTimeout(this.pollTimeout);
  }

  async pollAzureClusterState(){
    const self = this;
    var data = await this.cloudGuardService.getAKSCluster(this.cluster.name).toPromise();
    if(data && data.properties && data.properties.provisioningState != "Creating"){
      clearTimeout(this.pollTimeout);
      // One final refresh;
      await this.refreshCluster();
      return;
    }
    return setTimeout(function(){
      self.pollAzureClusterState();
    },6000);
  }

  async initNodes(cluster: any){
    if(this.nodeEvents && this.nodeEvents['abortController']){
      this.nodeEvents['abortController'].abort();
    }
    this.getNodes(cluster);
  }

  async getNodes(cluster: any){
    this.vendor.getNodes(cluster).subscribe((res:any) => {
        this.nodes = res.items || []
        // Lets keep this updated by events

        this.handleNodesEvents(cluster, res.metadata.resourceVersion)

        return this.nodes
      },
      error => {
        this.logService.handleError(error, false)
      }
    )
  }

  async refreshCluster(){
    delete this.cluster.personalToken;
    delete this.cluster.status;
    this.cluster['status'] = 'fetching';
    var cluster = await this.clusterService.getFullCluster(this.cluster.name, this.projectsService.currentProject.formatName).toPromise();
    this.initNodes(this.cluster);
  }

  async handleNodesEvents(cluster: any, resourceVersion: string){
    this.nodeEvents = await this.vendor.getNodesSse(cluster, resourceVersion).toPromise();
    this.nodeEvents.addEventListener('MODIFIED', (event:any) => {
      const index = this.nodes.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.nodes[index] = event.data;
      } 
    })
    this.nodeEvents.addEventListener('DELETED', (event:any) => {
      const index = this.nodes.findIndex(p => p.metadata.uid === event.data.metadata.uid)
      if(index !== -1) {
        this.nodes.splice(index, 1);
      } 
    })
    this.nodeEvents.addEventListener('ADDED', (event:any) => {
      this.nodes.push(event.data);
    })
  }

  nodeDialog(node: any): void {
    const dialogRef = this.dialog.open(NodeDialogComponent, {
      width: '950px',
      data: {node: node}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  getClusterOrigin(cluster: any){
    var vendor = cluster.vendor || "Unknown vendor";
    var platform = cluster.platform || "Unknown platform";
    var placement = vendor == "LOCAL" ? "on" : "in";
    
    vendor = vendor.charAt(0).toUpperCase() + vendor.slice(1).toLowerCase();
    platform = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();

    var version = cluster?.platformVersionInfo?.gitVersion || '';

    return `${platform} ${version} ${placement} ${vendor}`;
  }

  ngOnChanges(changes) {
 
  }

}