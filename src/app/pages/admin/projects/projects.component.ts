import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { CreateProjectDialogComponent }   from './components/create-project-dialog.component'
import { EditProjectComponent }   from './components/edit-project.component'
import { ConfirmDialogComponent }         from '../../../components/confirm-dialog/confirm-dialog.component';

import { PageService }        from '../../../services/page.service';
import { ProjectsService }        from '../../../services/projects.service';


@Component({
  selector: 'app-admin-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  public showExtraDetails = {};
  constructor(
    public pageService: PageService,
    public projectsService: ProjectsService,
    public dialog: MatDialog

  ) { 
    this.pageService.pageTitle = "Admin > Projects";
    this.projectsService.fetchProjects();
  }

  createProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  trackByFn(index, item) {
    return item.formatName;
  }

}
