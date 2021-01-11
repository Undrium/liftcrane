import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistriesComponent } from './registries.component';
import { RegistryComponent } from './registry.component';


const routes: Routes = [
  {
    path: '', component: RegistriesComponent,
  },
  {
    path: ':formatName', component: RegistryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistriesRoutingModule { }
