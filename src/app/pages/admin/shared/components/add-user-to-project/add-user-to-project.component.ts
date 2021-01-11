import { Component, Inject, Input }                from '@angular/core';
import { map }                          from "rxjs/operators";
import { CloudGuardService }        from './../../../../../services/cloudguard.service';
import { ProjectsService }        from './../../../../../services/projects.service';
import { UsersService }        from './../../../../../pages/admin/users/users.service';


@Component({
    selector: 'add-user-to-project',
    templateUrl: 'add-user-to-project.component.html',
    styleUrls: ['./add-user-to-project.component.scss']

})
export class AddUserToProjectComponent {
    @Input() project;
    @Input() user;
    public roles$: any[];
    public setProject: any;
    public setUser: any;
    public setRole: any;
    constructor(
        public projectsService: ProjectsService,
        public usersService: UsersService,
        private cloudGuardService: CloudGuardService,
    ) {
        this.cloudGuardService.getRoles().subscribe((response:any) => {this.roles$ = response;});
    }

    ngOnInit() {
        if(this.project){
            this.setProject = this.project;
        }
        if(this.user){
            this.setUser = this.user;
        }
    }


    add(): void {
        let post = {
            projectFormatName: this.setProject.formatName,
            username: this.setUser.username,
            roleId: this.setRole.id
        };
        this.cloudGuardService.createProjectRole(post).subscribe((response:any) => {
            this.cloudGuardService.getProject(post.projectFormatName).subscribe((response:any) => {
                this.project.projectRoles = response.projectRoles;
                this.projectsService.fetchProjects();
            });
        });
      }


}