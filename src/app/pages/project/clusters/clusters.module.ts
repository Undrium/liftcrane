import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../../shared/shared.module';

import { NodeDialogComponent }                  from './components/node-dialog.component';
import { ClusterRowComponent }                  from './components/cluster-row.component';
import { CreateClusterDialogComponent }         from './components/create-cluster-dialog.component';
import { PatchClusterDialogComponent }          from './components/patch-cluster-dialog.component';
import { AddExistingClusterDialogComponent }    from './components/add-existing-cluster-dialog.component';

import { ClustersComponent }                    from './clusters.component';

import { ClustersRoutingModule }                from './clusters-routing.module';

@NgModule({
  declarations: [
    AddExistingClusterDialogComponent,
    CreateClusterDialogComponent,
    ClusterRowComponent,
    ClustersComponent,
    NodeDialogComponent,
    PatchClusterDialogComponent
  ],
  imports: [
    SharedModule,
    ClustersRoutingModule
  ]
})
export class ClustersModule { }
