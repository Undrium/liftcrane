import { NgModule }             from '@angular/core';

import { SharedModule }         from '../../../shared/shared.module';

import { ProjectsComponent }       from './projects.component';
import { CreateProjectDialogComponent }   from './components/create-project-dialog.component';
import { EditProjectComponent }   from './components/edit-project.component';
import { AddUserToProjectComponent }       from '../shared/components/add-user-to-project/add-user-to-project.component';



@NgModule({
  declarations: [
    ProjectsComponent,
    CreateProjectDialogComponent,
    EditProjectComponent,
    AddUserToProjectComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
