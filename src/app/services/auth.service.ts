import { Injectable, EventEmitter }         from '@angular/core';
import { map, catchError }                  from "rxjs/operators";
import { BehaviorSubject, Observable, of }  from "rxjs";
import { LocalStorageService }              from './localstorage.service';
import { ProfileService }                      from './profile.service';
import { User, UserAdapter }                from '../shared/models/user.model';
import { CloudGuardDataSource }                from './cloudguard.data-source';

import * as _                               from 'lodash';

@Injectable({providedIn: 'root'})
export class AuthService {
  loginSubject = new BehaviorSubject<boolean>(false);
  heartbeatTimeout = null;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(
    private localStorageService: LocalStorageService, 
    private profileService: ProfileService,
    private cloudGuardDataSource: CloudGuardDataSource
    ) {
      profileService.user$.subscribe((user: User) => {
        clearTimeout(this.heartbeatTimeout);
        if(user && user.token){
          this.heartbeat(user);
        }
      });
  }

  public login(username: string, password: string): Observable<any>{
    // Clear previous data if existing
    this.profileService.clearUser();
    return this.cloudGuardDataSource.login(username, password).pipe(map(user => {
      this.profileService.setUser(user);
      return user;
    }));
  }

  public heartbeat(user: User): Observable<any>{
    return this.cloudGuardDataSource.heartbeat(user).pipe(map(incomingUser => {
      if(!user || !user.token){
        clearTimeout(this.heartbeatTimeout);
      }
      var user = this.profileService.updateUserToken(incomingUser);
      this.heartbeatTimeout = setTimeout(() => 
      {
        this.heartbeat(user);
      },
      15000);
    }),
    catchError(err => { console.log(err); this.profileService.clearUser();return of(err);}))
    .subscribe();
  }

  public logout(): Observable<any>{
    return this.cloudGuardDataSource.logout(this.profileService.user$).pipe(
      map(response => { this.profileService.clearUser();return response; }),
      catchError(err => { this.profileService.clearUser();return of(err);})
    );
  }

  public isUserType(userType: string): Observable<boolean>{
    return this.profileService.user$.pipe(
      map( (user:any) => {
        return user && user.usertype == userType ? true : false; 
      })
    );
  }

  public hasCorrectRoleInProject(user: any, projectId: string, allowedRoles: string[]): boolean{
    if(user.usertype && user.usertype == 'admin'){
      return true;
    }
    if(!user.projectRoles || (user.projectRoles && user.projectRoles.length == 0)){
        return false;
    }
    for(var projectRole of user.projectRoles){
        if(projectRole.project && projectRole.project.id == projectId){
            if(projectRole.role && projectRole.role.name && allowedRoles.includes(projectRole.role.name)){
                return true;
            }else{
                return false;
            }
        }
    }
  }

  public isRoleInProject(role: string, projectId: string): Observable<boolean>{
    // TODO actually fetch the role-relation
    return this.profileService.user$.pipe(
      map( (user:any) => {
        return true; 
      })
    );
  }

  public isLoggedIn(): Observable<boolean>{
    return this.profileService.user$.pipe(
      map( (user:any) => {return user && user.token ? true : false;})
    );
  }


}