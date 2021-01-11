import { Component, Inject }    from '@angular/core';

import { ClusterService }   from '../../services/cluster.service';
import { NamespaceService }   from '../../services/namespace.service';


@Component({
  selector: 'cluster-select',
  templateUrl: './cluster-select.component.html',
  styleUrls: ['./cluster-select.component.scss']
})
export class ClusterSelectComponent {

    constructor(public clusterService: ClusterService, public namespaceService: NamespaceService) { 

    }
    
    public compareSelected(cluster1: any, cluster2: any):boolean{
      if(!cluster1 || !cluster2){
        return false;
      }
      return cluster1.name == cluster2.name;
    }    

}
