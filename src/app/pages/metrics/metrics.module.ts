import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../shared/shared.module';

import { MetricsComponent }         from './metrics.component';
import { MetricsRoutingModule }     from './metrics-routing.module';

@NgModule({
  declarations: [MetricsComponent],
  imports: [
    SharedModule,
    MetricsRoutingModule
  ]
})
export class MetricsModule { }
