import { NgModule }             from '@angular/core';

import { Routes, RouterModule }     from '@angular/router';

import { SharedModule }         from '../../../shared/shared.module';

import { ClustersComponent } from './clusters.component';

@NgModule({
  declarations: [ ClustersComponent ],
  exports: [ ClustersComponent ],
  imports: [ SharedModule, RouterModule ]
})
export class ClustersModule { }
