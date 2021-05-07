import { TypeGuard } from './../../services/guards/type.guard';
import { NgModule }                 from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';
import { AdminComponent }           from './admin.component';
import { StartComponent }           from './start/start.component';
import { UsersComponent }           from './users/users.component';
import { ClustersComponent }        from './clusters/clusters.component';
import { ClusterComponent }         from './clusters/cluster/cluster.component';
import { LogsComponent }            from './logs/logs.component';
import { ProjectsComponent }        from './projects/projects.component';
import { AuthGuard }                from '../../services/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '', 
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path:'',
        redirectTo: 'start',
        pathMatch: '' 
      },
      {
        path: 'start', 
        data: { title: "Start", faIcon: "fas fa-tachometer-alt", },
        component: StartComponent,
      },
      {
        path: 'users', 
        data: { title: "Users", faIcon: "fas fa-users", },
        component: UsersComponent,
      },
      {
        path: 'clusters', 
        data: { title: "Clusters", faIcon: "fas fa-th", },
        component: ClustersComponent,
      },
      {
        path: 'clusters/:formatName', 
        component: ClusterComponent,
      },
      { 
        path: 'projects', 
        data: { title: "Projects", faIcon: "fas fa-stream", },
        component: ProjectsComponent,
        
      },
      { 
        path: 'logs', 
        data: { title: "Logs", faIcon: "fas fa-stream", },
        component: LogsComponent,
        
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
