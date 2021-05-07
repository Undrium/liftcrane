import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../../shared/shared.module';

import { LogsComponent }       from './logs.component';

@NgModule({
  declarations: [
    LogsComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    LogsComponent
  ]
})
export class LogsModule { }
