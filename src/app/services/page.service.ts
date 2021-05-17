import { Injectable, EventEmitter }         from '@angular/core';
import { Router }  from '@angular/router';
import { BreakpointObserver, Breakpoints }  from '@angular/cdk/layout';
import { Observable }                       from 'rxjs';
import { Subject, zip }                from 'rxjs';
import { map, shareReplay }                 from 'rxjs/operators';

import { LocalStorageService }          from './localstorage.service';
import { AuthService }                  from './auth.service';
import { ProfileService }               from './profile.service';
import { ProjectsService }               from './projects.service';

import * as _                           from 'lodash';
import { LogService } from './log.service';

@Injectable({providedIn: 'root'})
export class PageService {

    sideNavOpen: boolean;
    
    public pageTitle: string;
    public beforeLogin: string = "";
    public subscriptions: Array<any> = [];
    // Loader
    public somethingIsLoading = false;
    public whatIsLoading = "Something is loading";

    constructor(
        public authService: AuthService,
        public localStorageService: LocalStorageService,
        public logService: LogService,
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        public profileService: ProfileService,
        public projectsService: ProjectsService,
    ) {
        this.sideNavOpen = localStorageService.getItem("settingsSession.sideNavOpen");
    }

    toggleSideNav():boolean {
        this.sideNavOpen = !this.sideNavOpen;
        // Save everytime to session
        this.localStorageService.setItem("settingsSession.sideNavOpen", this.sideNavOpen)
        return this.sideNavOpen;
    }

    public startLoader(message = "Something is loading."){
        this.somethingIsLoading = true;
        this.whatIsLoading = message;
    }

    public stopLoader(){
        this.somethingIsLoading = false;
        this.whatIsLoading = "";
    }

    public trackSubscription(subscription: any){
        this.subscriptions.push(subscription);
    }

    public wipeSubscriptions(){
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public guard(allowedRoles: string[]):Observable<boolean>{
        return zip(this.profileService.user$, this.projectsService.currentProjectSubject)
        .pipe(map(val => {  
            var user = {}, project = {};
            [user, project] = val;
            if(project['id']){
                return this.authService.hasCorrectRoleInProject(user, project['id'], allowedRoles);
            }
        }));
    }

    public isActivePage(path: any, matchRootOnly = false): boolean {
        path = "/"+path;
        if(matchRootOnly){
          return this.router.url.startsWith(path);
        }
        return path === this.router.url;
    }

    public logout() {
        return this.authService.logout().subscribe(
          (resp) => {this.router.navigate(['/']);}
        )
      }

    public displayMessage(message: string){
        this.logService.log(message, "message", {}, true);
    }

    public isHandset$: Observable<boolean> = 
        this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe( map(result => result.matches), shareReplay());

}
