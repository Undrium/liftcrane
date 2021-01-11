import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../../shared/shared.module';

import { CreateUserDialogComponent }  from './create-user-dialog.component';

import { UsersComponent }       from './users.component';

@NgModule({
  declarations: [
    CreateUserDialogComponent,
    UsersComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    UsersComponent
  ]
})
export class UsersModule { }
