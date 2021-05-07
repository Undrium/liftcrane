import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/guards/auth.guard';
import { TypeGuard } from './services/guards/type.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  { 
    path: 'projects', 
    loadChildren: () => import('./pages/projects/project.module').then(m => m.ProjectModule), 
    data: { title: " " },
    canActivate: [AuthGuard]
  },
  { 
    path: 'registries', 
    loadChildren: () => import('./pages/registries/registries.module').then(m => m.RegistriesModule), 
    //data: { faIcon: "fas fa-list", title: "Registries" }, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectFormatName/clusters', 
    loadChildren: () => import('./pages/projects/clusters/clusters.module').then(m => m.ClustersModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectFormatName/namespaces', 
    loadChildren: () => import('./pages/projects/namespaces/namespaces.module').then(m => m.NamespacesModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectFormatName/clusters/:clusterFormatname/namespaces', 
    loadChildren: () => import('./pages/projects/namespaces/namespaces.module').then(m => m.NamespacesModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectFormatName/deployments', 
    loadChildren: () => import('./pages/projects/deployments/deployments.module').then(m => m.DeploymentsModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectFormatName/clusters/:clusterFormatname/deployments', 
    loadChildren: () => import('./pages/projects/deployments/deployments.module').then(m => m.DeploymentsModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectFormatName/clusters/:clusterFormatname/namespaces/:namespace/deployments', 
    loadChildren: () => import('./pages/projects/deployments/deployments.module').then(m => m.DeploymentsModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  { 
    path: 'metrics', 
    loadChildren: () => import('./pages/metrics/metrics.module').then(m => m.MetricsModule),
    //data: { faIcon: "fas fa-chart-pie", title: "Metrics" }
  },
  { 
    path: 'docs', 
    loadChildren: () => import('./pages/docs/docs.module').then(m => m.DocsModule),
    data: { faIcon: "fas fa-file-alt", title: "Docs" }
  },
  { 
    path: 'docs/:path1', 
    loadChildren: () => import('./pages/docs/docs.module').then(m => m.DocsModule) 
  },
  { 
    path: 'docs/:path1/:path2', 
    loadChildren: () => import('./pages/docs/docs.module').then(m => m.DocsModule) 
  },
  { 
    path: 'docs/:path1/:path2/:path3', 
    loadChildren: () => import('./pages/docs/docs.module').then(m => m.DocsModule) 
  },
  // Everything under admin goes here, admin has it's own routing
  { 
    path: 'admin', 
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule), 
    data: { expectedUserType: 'admin', faIcon: "fas fa-ambulance", title: "Admin"}, 
    canActivate: [TypeGuard],
  },
  // Just used for navigation-menu, not actual routing
  { 
    path: 'admin/start', 
    data: { expectedUserType: 'admin', faIcon: "fas fa-tachometer-alt", title: "Start", parent: "admin" },
    canActivate: [TypeGuard],
    children:[]
  },
  // Just used for navigation-menu, not actual routing
  { 
    path: 'admin/users', 
    data: { expectedUserType: 'admin', faIcon: "fas fa-users", title: "Users", parent: "admin" },
    canActivate: [TypeGuard],
    children:[]
  },
  // Just used for navigation-menu, not actual routing
  { 
    path: 'admin/clusters', 
    data: { expectedUserType: 'admin', faIcon: "fas fa-th", title: "Clusters", parent: "admin" },
    canActivate: [TypeGuard],
    children:[]
  },
  // Just used for navigation-menu, not actual routing
  { 
    path: 'admin/projects', 
    data: { expectedUserType: 'admin', faIcon: "fas fa-stream", title: "Projects", parent: "admin" },
    canActivate: [TypeGuard],
    children:[]
  },
  { 
    path: 'admin/logs', 
    data: { expectedUserType: 'admin', faIcon: "fas fa-stream", title: "Logs", parent: "admin" },
    canActivate: [TypeGuard],
    children:[]
  },
  { 
    path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
