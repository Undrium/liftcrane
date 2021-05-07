import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';

import { SharedModule }         from '../../shared/shared.module';

import { AdminRoutingModule }       from './admin-routing.module';
import { StartModule }              from './start/start.module';
import { UsersModule }              from './users/users.module';
import { ClustersModule }           from './clusters/clusters.module';
import { ClusterModule }            from './clusters/cluster/cluster.module';
import { LogsModule }               from './logs/logs.module';
import { ProjectsModule }           from './projects/projects.module';
import { AdminComponent }           from './admin.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AdminRoutingModule,
    UsersModule,
    ClustersModule,
    ClusterModule,
    LogsModule,
    StartModule,
    ProjectsModule,
  ],
  exports: [
    AdminRoutingModule
  ]
})
export class AdminModule {}
