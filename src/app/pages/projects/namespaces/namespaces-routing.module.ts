import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NamespacesComponent } from './namespaces.component';


const routes: Routes = [
  {
    path: '', component: NamespacesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NamespacesRoutingModule { }
