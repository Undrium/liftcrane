import { NgModule }             from '@angular/core';

import { Routes, RouterModule }     from '@angular/router';

import { SharedModule }         from '../../../shared/shared.module';

import { StartComponent } from './start.component';

@NgModule({
  declarations: [ StartComponent ],
  exports: [ StartComponent ],
  imports: [ SharedModule, RouterModule ]
})
export class StartModule { }
