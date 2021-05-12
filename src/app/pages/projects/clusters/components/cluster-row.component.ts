import { 
  Component, 
  OnChanges,
  OnInit, 
  Input, 
  ViewEncapsulation 
}                               from '@angular/core';
import { MatDialog }            from '@angular/material/dialog';

import { interval }             from 'rxjs';

import { NodeDialogComponent }  from './node-dialog.component'

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
export class ClusterRowComponent implements OnInit, OnChanges {
  @Input() cluster: any;
  public vendor: any
  
  public nodes: Array<any> = [];
  public nodeEvents: any;
  
  public pollStates: Array<any> = ["creating", "patching", "unknown"];
  public pollTimeout = null;

  public estimate = null;

  constructor(
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
  }

  ngOnDestroy() {
    if(this.nodeEvents && this.nodeEvents['abortController']){
        this.nodeEvents['abortController'].abort();
    }
    this.stopPollTimer();
  }

  async pollClusterState(){
    
    const self = this;
    var projectFormatName = this.projectsService.currentProject.formatName;
    var cluster = await this.clusterService.fetchClusterFromCloudguard(projectFormatName, this.cluster).toPromise();
    
    if(!this.estimate){
      await this.getAndStartEstimation(cluster.vendorState);
    }

    if(!this.pollStates.includes(cluster.vendorState)){
      this.stopPollTimer();
      // One final refresh;
      await this.refreshClusterAndNodes();
      return;
    }
    return setTimeout(function(){
      self.pollClusterState();
    }, 7000);
  }

  async stopPollTimer(){
    clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
  }

  async initNodes(cluster: any){
    if(this.nodeEvents && this.nodeEvents['abortController']){
      this.nodeEvents['abortController'].abort();
    }
    this.getNodes(cluster);
  }

  async getNodes(cluster: any){
    try{
      var nodeList = await this.vendor.getNodes(cluster).toPromise();
      this.nodes = nodeList.items || [];
      this.handleNodesEvents(cluster, nodeList.metadata.resourceVersion);
    }catch(error){
      this.logService.handleError(error, false);
    }
  }

  /*
  * TODO make this more compact
  */
  public async getAndStartEstimation(type?: string){
    if(!this.estimate && this.cluster?.formatName){
      this.estimate = await this.clusterService.getEstimation(this.cluster, type).toPromise();
      if(this.estimate.averageTime == 0){
        this.estimate['timeMessage'] = "Can't estimate time for modification.";
        this.progressbarType = "indeterminate";
        return false;
      }
      var startTime = new Date(this.estimate.startTime);
      var currentTime = new Date(this.estimate.currentTime);
      var elapsedSeconds = Math.abs((currentTime.getTime() - startTime.getTime()) / 1000);
      var timeLeft = this.estimate.averageTime - elapsedSeconds;
      timeLeft = Math.round(timeLeft > 0 ? timeLeft : 0);
      this.estimate['timeMessage'] = "Estimating it to take " + timeLeft + " seconds";
      console.log(this.estimate['timeMessage']);
      this.progressbarValue = 100;
      this.startTimer(timeLeft);
    }
    return true;
  }

  progressbarType = "determinate";
  progressbarValue = 100;
  curTick: number = 0;

  startTimer(seconds: number) {
    const limit = seconds * 5;
    const timer$ = interval(200);

    const sub = timer$.subscribe((tick) => {
      if (!limit || this.curTick >= limit) {
        sub.unsubscribe();
        return;
      }

      this.progressbarValue = 100 - tick * 100 / limit;
      this.curTick = tick;
      
    });
  }

  async refreshClusterAndNodes(){
    await this.clusterService.refresh(this.cluster);
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

    var version = cluster?.external?.platformVersionInfo?.gitVersion || '';

    return `${platform} ${version} ${placement} ${vendor}`;
  }

  ngOnChanges(changes) {
    if(this.pollStates.includes(this.cluster.vendorState) && !this.pollTimeout){
      this.pollTimeout = this.pollClusterState();
    }
  }

}