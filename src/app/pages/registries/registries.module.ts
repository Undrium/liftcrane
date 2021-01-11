import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../shared/shared.module';

import { RegistriesRoutingModule }   from './registries-routing.module';
import { RegistriesComponent }       from './registries.component';
import { RegistryComponent }       from './registry.component';
import { RegistryDialogComponent }       from './registry-dialog.component';
import { DeleteRegistryDialogComponent }       from './delete-registry-dialog.component';


@NgModule({
  declarations: [
    RegistriesComponent,
    RegistryComponent,
    RegistryDialogComponent,
    DeleteRegistryDialogComponent],
  imports: [
    SharedModule,
    RegistriesRoutingModule
  ]
})
export class RegistriesModule { }
