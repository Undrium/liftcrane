import { Injectable, EventEmitter }     from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { map }                          from "rxjs/operators";
import { Observable, BehaviorSubject, of, ReplaySubject  }         from 'rxjs';

import { CloudGuardService }            from './cloudguard.service';
import { ProfileService }               from './profile.service';
import { LocalStorageService }          from './localstorage.service';

import { User }                         from '../shared/models/user.model';

import * as _                           from 'lodash';

@Injectable({providedIn: 'root'})
export class ProjectsService {
  
    // When needed update 
    public projects: Array<any> = [];
    public projects$: ReplaySubject<Array<any>>;
     // Selected project
     public currentProject: any = {};
     // Subject to subscribe to for selected (current project)
     public currentProjectSubject: BehaviorSubject<{currentProject: any}>; 

    constructor(
        private cloudGuardService: CloudGuardService,
        private localStorageService: LocalStorageService,
        private profileService: ProfileService
    ) {
        this.projects = [];
        this.projects$ = new ReplaySubject<Array<any>>(1);
        this.currentProject = this.localStorageService.getItem('currentProject', {}); 
        this.currentProjectSubject = new BehaviorSubject<{currentProject: any}>(this.currentProject);
    }

    /*
    * Observe! This is for fetching all the projects, not specifically for the user
    */
    public fetchProjects(){
        return this.cloudGuardService.getProjects().subscribe((projects: any[]) => {
            this.projects.length = 0;
            [].push.apply(this.projects, projects);
            this.projects$.next(projects);
            // Refresh user roles for admin
            this.cloudGuardService.getUser(this.profileService.getUsername()).subscribe(user => {
                this.profileService.refreshUserProjectRoles(user);
            });
        });
    }

    public getProject(formatName: string): Observable<any>{
        return this.cloudGuardService.getProject(formatName).pipe(map(project => {
            return project;
        }));
    }

    public createProject(project: any): Observable<any>{
        return this.cloudGuardService.createProject(project).pipe(map(project => {
            this.fetchProjects();
            return project;
        }));
    }
    
    public deleteProject(project): Observable<any>{
        return this.cloudGuardService.deleteProject(project.formatName).pipe(map(resp => {
            this.fetchProjects();
            return resp;
        }));
    }
    
    public updateProject(project: any): Observable<any>{
        return this.cloudGuardService.updateProject(project).pipe(map(project => {
            this.fetchProjects();
            return project;
        }));
    }
    
    public async setCurrentProject(project: any){
        // Notify only on change of project
        if(project.formatName != this.currentProject.formatName){
            this.currentProjectSubject.next(project);
        }
        // Always update 
        this.currentProject = this.localStorageService.setItem('currentProject', project);  
    }

    public getCurrentProject(){
        return this.currentProjectSubject;
    }

}
