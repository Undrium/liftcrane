import { Pipe, PipeTransform } from '@angular/core';

import { ClusterService }              from '../../services/cluster.service';

@Pipe({name: 'filterAndLimitClusters'})
export class FilterAndLimitClustersPipe implements PipeTransform {
    constructor(private clusterService: ClusterService) {}
    transform(clusters: any): any {
        return this.clusterService.filterAndLimitClusters(clusters);
    }
}
