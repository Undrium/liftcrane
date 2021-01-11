import { NgModule }             from '@angular/core';

import { Routes, RouterModule }     from '@angular/router';

import { SharedModule }         from '../../../../shared/shared.module';

import { ClusterComponent } from './cluster.component';

@NgModule({
  declarations: [ ClusterComponent ],
  exports: [ ClusterComponent ],
  imports: [ SharedModule, RouterModule ]
})
export class ClusterModule { }
