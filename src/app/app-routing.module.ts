import {NgModule}                 from '@angular/core';
import {RouterModule, Routes}     from '@angular/router';
import {AppConfig}                from './app.config';

const routes: Routes = [
  { path: "", loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
