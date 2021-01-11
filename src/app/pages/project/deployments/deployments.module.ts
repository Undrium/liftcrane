import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../../shared/shared.module';

import { DeploymentRowComponent }           from './components/deployment-row.component';
import { EditDeploymentDialogComponent }    from './components/edit-deployment-dialog.component';
import { CreateDeploymentDialogComponent }  from './components/create-deployment-dialog.component';
import { DeleteDeploymentDialogComponent }  from './components/delete-deployment-dialog.component';
import { DeploymentsRoutingModule }         from './deployments-routing.module';
import { DeploymentsComponent }             from './deployments.component';
import { ReplicasComponent }                from './components/replicas.component';
import { RevisionDialogComponent }          from './components/revision-dialog.component';
import { ScaleDialogComponent }             from './components/scale-dialog.component';

@NgModule({
  declarations: [
    CreateDeploymentDialogComponent,
    EditDeploymentDialogComponent,
    DeleteDeploymentDialogComponent,
    DeploymentsComponent, 
    DeploymentRowComponent,
    ReplicasComponent,
    RevisionDialogComponent,
    ScaleDialogComponent
  ],
  imports: [
    SharedModule,
    DeploymentsRoutingModule
  ]
})
export class DeploymentsModule { }
