import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../../shared/shared.module';

import { NamespacesRoutingModule }         from './namespaces-routing.module';

import { NamespacesComponent }              from './namespaces.component';
import { CloneNamespaceDialogComponent }    from './components/clone-namespace-dialog.component';
import { CreateNamespaceDialogComponent }   from './components/create-namespace-dialog.component';
import { NamespaceDetailsComponent }        from './components/namespace-details.component';
import { IngressesComponent }               from './components/ingresses.component';
import { ServicesComponent }                from './components/services.component';
import { EndpointsComponent }               from './components/endpoints.component';
import { SecretsComponent }                 from './components/secrets.component';


@NgModule({
  declarations: [
    CloneNamespaceDialogComponent,
    CreateNamespaceDialogComponent,
    EndpointsComponent,
    SecretsComponent,
    IngressesComponent,
    NamespaceDetailsComponent,
    NamespacesComponent,
    ServicesComponent
  ],
  imports: [
    SharedModule,
    NamespacesRoutingModule
  ]
})
export class NamespacesModule { }

