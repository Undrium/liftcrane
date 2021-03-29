import { Component, Inject }    from '@angular/core';

import { PreferenceService }    from '../../services/preference.service';
import { ClusterService }   from '../../services/cluster.service';
import { NamespaceService }   from '../../services/namespace.service';


@Component({
  selector: 'cluster-select',
  templateUrl: './cluster-select.component.html',
  styleUrls: ['./cluster-select.component.scss']
})
export class ClusterSelectComponent {

    constructor(
      public clusterService: ClusterService, 
      public namespaceService: NamespaceService,
      public preferenceService: PreferenceService
      ) { 

    }
    
    public compareSelected(cluster1: any, cluster2: any):boolean{

      if(!cluster1 && !cluster2){
        return false;
      }
      
      return cluster1.name == cluster2.name;
    }    

    public switchCurrentCluster(cluster: any){
      this.preferenceService.addOrUpdatePreference("cluster", cluster.name || "");
      // Need to wipe it, therefor set it to dirty
      this.clusterService.setCurrentCluster(cluster, true);
    }

}
