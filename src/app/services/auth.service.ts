import { Injectable, EventEmitter }         from '@angular/core';
import { map, catchError }                  from "rxjs/operators";
import { BehaviorSubject, Observable, of }  from "rxjs";
import { LocalStorageService }              from './localstorage.service';
import { ProfileService }                      from './profile.service';
import { User, UserAdapter }                from '../shared/models/user.model';
import { CloudGuardService }                from './cloudguard.service';

import * as _                               from 'lodash';

@Injectable({providedIn: 'root'})
export class AuthService {
  loginSubject = new BehaviorSubject<boolean>(false);
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(
    private localStorageService: LocalStorageService, 
    private profileService: ProfileService,
    private cloudGuardService: CloudGuardService
    ) {
      profileService.user$.subscribe((user: User) => {
        if(user && user.token){
          this.heartbeat(user).subscribe();
        }
      })
  }

  public login(username: string, password: string): Observable<any>{
    return this.cloudGuardService.login(username, password).pipe(map(user => {
      this.profileService.setUser(user);
      return user;
    }));
  }

  public heartbeat(user: User): Observable<any>{
    return this.cloudGuardService.heartbeat(user).pipe(map(user => {
      //Actually refresh user
    }),
    catchError(err => { console.log(err); this.profileService.clearUser();return of(err);}));
  }

  public logout(): Observable<any>{
    return this.cloudGuardService.logout(this.profileService.user$).pipe(
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
      if(!user.projectRoles || user.projectRoles.length == 0){
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