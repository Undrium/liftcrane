import { Component, Inject }    from '@angular/core';

import { first }                    from "rxjs/operators";

import { PreferenceService }   from '../../services/preference.service';
import { ProjectsService }   from '../../services/projects.service';
import { ClusterService }   from '../../services/cluster.service';
import { NamespaceService }   from '../../services/namespace.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'project-select',
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.scss']
})
export class ProjectSelectComponent {
    projectRoles: any[];
    constructor(
      public projectsService: ProjectsService, 
      public preferenceService: PreferenceService, 
      public clusterService: ClusterService, 
      public namespaceService: NamespaceService, 
      public profileService: ProfileService
    ) { 
      profileService.user$.pipe(first()).subscribe(user => {
        if(!user || !user.projectRoles){
          this.projectRoles = [];
          return;
        }
        this.projectRoles = user.projectRoles;
        this.SetCurrentByPreference(this.projectRoles);
      });
    }
    
    public compareSelected(project1: any, project2: any):boolean{
      if(!project1 || !project2){
        return false;
      }
      return project1.formatName == project2.formatName;
    }   
    
    public async SetCurrentByPreference(projectRoles: any[]){
      var preference = await this.preferenceService.getPreferenceByName("preferedProject").toPromise();
      if(typeof preference  == 'undefined' && projectRoles[0] && projectRoles[0]["project"]) { 
        this.projectsService.setCurrentProject(projectRoles[0]["project"]);
        return 
      }
      for(var projectRole of projectRoles){
        if(projectRole && projectRole['project'] && projectRole['project'].name == preference['preferenceValue']){
          this.projectsService.setCurrentProject(projectRole['project']);
        }
      } 
    }

    public async switchProject(project){
      this.preferenceService.addOrUpdatePreference("preferedProject", project.name);
      await this.projectsService.setCurrentProject(project);
    }

}
