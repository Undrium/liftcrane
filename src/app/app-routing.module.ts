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
    path: 'project', 
    loadChildren: () => import('./pages/project/project.module').then(m => m.ProjectModule), 
    data: { title: " " },
    canActivate: [AuthGuard]
  },
  { 
    path: 'registries', 
    loadChildren: () => import('./pages/registries/registries.module').then(m => m.RegistriesModule), 
    data: { faIcon: "fas fa-list", title: "Registries" }, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'project/clusters', 
    loadChildren: () => import('./pages/project/clusters/clusters.module').then(m => m.ClustersModule), 
    data: { faIcon: "fas fa-th", title: "Clusters", parent: "project" },
    canActivate: [AuthGuard]
  },
  { 
    path: 'project/namespaces', 
    loadChildren: () => import('./pages/project/namespaces/namespaces.module').then(m => m.NamespacesModule), 
    data: { faIcon: "fas fa-signature", title: "Namespaces", parent: "project" },
    canActivate: [AuthGuard]
  },
  { 
    path: 'project/clusters/:clusterFormatname/namespaces', 
    loadChildren: () => import('./pages/project/namespaces/namespaces.module').then(m => m.NamespacesModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'project/deployments', 
    loadChildren: () => import('./pages/project/deployments/deployments.module').then(m => m.DeploymentsModule), 
    data: { faIcon: "fas fa-globe", title: "Deployments", parent: "project" },
    canActivate: [AuthGuard]
  },
  { 
    path: 'project/clusters/:clusterFormatname/namespaces/:namespace/deployments', 
    loadChildren: () => import('./pages/project/deployments/deployments.module').then(m => m.DeploymentsModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  { 
    path: 'metrics', 
    loadChildren: () => import('./pages/metrics/metrics.module').then(m => m.MetricsModule),
    data: { faIcon: "fas fa-chart-pie", title: "Metrics" }
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
    path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
