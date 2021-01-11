import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../shared/shared.module';

import { ProjectComponent }         from './project.component';
import { ProjectRoutingModule }     from './project-routing.module';

@NgModule({
  declarations: [ProjectComponent],
  imports: [
    SharedModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
