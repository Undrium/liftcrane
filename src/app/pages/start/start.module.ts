import {NgModule}             from '@angular/core';
import {CommonModule}         from '@angular/common';

import { SharedModule }       from '../../shared/shared.module';

import { StartRoutingModule }             from './start-routing.module';
import { StartComponent }                 from './start.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StartRoutingModule
  ],
  declarations: [
    StartComponent
  ],
  entryComponents: [

  ],
  providers: [

  ]
})

export class StartModule {
}
