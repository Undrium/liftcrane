import { ModuleWithProviders, NgModule }            from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl }         from '@angular/forms';
import { LayoutModule }                             from '@angular/cdk/layout';

import { ClusterSelectComponent }                   from '../components/cluster-select/cluster-select.component';
import { ConfirmDialogComponent }                   from '../components/confirm-dialog/confirm-dialog.component';
import { NamespaceSelectComponent }                 from '../components/namespace-select/namespace-select.component';
import { ObjectEditorComponent }                    from '../components/object-editor/object-editor.component';
import { ObjectEditorDialogComponent }              from '../components/object-editor-dialog/object-editor-dialog.component';
import { ProjectSelectComponent }                   from '../components/project-select/project-select.component';
import { SearchFilterComponent }                    from '../components/search-filter/search-filter.component';

// Pipes
import { 
  DeploymentIsPausedPipe,
  DeploymentIsRunningPipe
} from './pipes/deployment.pipe';
import { 
  NodeConditionSummaryPipe,
  NodeNameSummaryPipe 
} from './pipes/node.pipe';

import { RoleGuardPipe } from './pipes/guard.pipe';
// Validators
import { NameFormatDirective} from './validators/name-format.directive';

// Third party
import { FlexLayoutModule }                         from '@angular/flex-layout';

import { MatButtonModule }                          from '@angular/material/button';
import { MatCardModule }                            from '@angular/material/card';
import { MatCheckboxModule }                        from '@angular/material/checkbox';
import { MatChipsModule }                           from '@angular/material/chips';
import { MatDialogModule }                          from '@angular/material/dialog';
import { MatExpansionModule }                       from '@angular/material/expansion';
import { MatGridListModule }                        from '@angular/material/grid-list';
import { MatFormFieldModule}                        from '@angular/material/form-field';
import { MatIconModule }                            from '@angular/material/icon';
import { MatInputModule }                           from '@angular/material/input';
import { MatListModule }                            from '@angular/material/list';
import { MatTableModule }                            from '@angular/material/table';
import { MatMenuModule }                            from '@angular/material/menu';
import { MatPaginatorModule }                       from '@angular/material/paginator';
import { MatProgressBarModule }                     from '@angular/material/progress-bar';
import { MatRadioModule }                           from '@angular/material/radio';
import { MatSelectModule }                          from '@angular/material/select';
import { MatSidenavModule }                         from '@angular/material/sidenav';
import { MatProgressSpinnerModule }                 from '@angular/material/progress-spinner';
import { MatSortModule }                            from '@angular/material/sort';
import { MatSnackBarModule }                        from '@angular/material/snack-bar';
import { MatTabsModule }                            from '@angular/material/tabs';
import { MatToolbarModule }                         from '@angular/material/toolbar';
import { MatTooltipModule }                         from '@angular/material/tooltip';

import { AceEditorModule }                          from '@postfinance/ngx-ace-editor-wrapper';

                                                  

@NgModule({
  imports:      [
    AceEditorModule,
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatToolbarModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatSelectModule, 
    MatSnackBarModule,
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  declarations: [
    ClusterSelectComponent,
    ProjectSelectComponent,
    NamespaceSelectComponent,
    ConfirmDialogComponent,
    ObjectEditorComponent,
    DeploymentIsPausedPipe,
    DeploymentIsRunningPipe,
    NodeConditionSummaryPipe,
    NodeNameSummaryPipe,
    RoleGuardPipe,
    NameFormatDirective,
    ObjectEditorDialogComponent,
    SearchFilterComponent
  ],
  exports: [
    AceEditorModule,
    ClusterSelectComponent,
    ProjectSelectComponent,
    NamespaceSelectComponent,
    CommonModule,
    ObjectEditorComponent,
    SearchFilterComponent,
    DeploymentIsPausedPipe,
    DeploymentIsRunningPipe,
    NodeConditionSummaryPipe,
    RoleGuardPipe,
    NodeNameSummaryPipe,
    NameFormatDirective,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatRadioModule,
    ReactiveFormsModule,
    LayoutModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    MatMenuModule
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
