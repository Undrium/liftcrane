import { Component, Inject }    from '@angular/core';

import { PreferenceService }    from '../../services/preference.service';
import { NamespaceService }     from '../../services/namespace.service';
import { ClusterService }       from '../../services/cluster.service';


@Component({
  selector: 'namespace-select',
  templateUrl: './namespace-select.component.html',
  styleUrls: ['./namespace-select.component.scss']
})
export class NamespaceSelectComponent {

    constructor(public clusterService: ClusterService, public namespaceService: NamespaceService, public preferenceService: PreferenceService) { 

      
    }
    
    public compareSelected(namespace1: any, namespace2: any):boolean{
      if(!namespace1 || !namespace2 || !namespace1.metadata || !namespace2.metadata){
        return false;
      }
      return namespace1.metadata.name == namespace2.metadata.name;
    }

    public async switchNamespace(namespace: any){
      this.preferenceService.addOrUpdatePreference("preferedNamespace"+this.clusterService.currentCluster.formatName, namespace.metadata.name);
      await this.namespaceService.setCurrentNamespace(namespace);  
    }

}
