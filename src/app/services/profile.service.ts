import { Injectable, EventEmitter }     from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { map }                          from "rxjs/operators";
import { BehaviorSubject, Observable }  from "rxjs";

import { User, UserAdapter }            from '../shared/models/user.model';
import { LocalStorageService }          from './localstorage.service';

import * as _                           from 'lodash';

@Injectable({providedIn: 'root'})
export class ProfileService {

  // Local track of user
  private user: User = null;
  // Global track of user
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(this.user); 
  
  constructor(
    private userAdapter: UserAdapter, 
    private localStorageService: LocalStorageService
  ) {
      var localUser = localStorageService.getItem('user');
      if(localUser && localUser.token){
        this.user = this.userAdapter.adapt(localUser);
        this.setUser(this.user)
      }
  }

  public initUser(user:any){
    this.setUser(user);
  }

  public setUser(user:any){
    this.user = this.userAdapter.adapt(user);
    this.user$.next(this.user);
    this.localStorageService.setItem('user', this.user);
  }

  public saveUserLocally(){
    this.localStorageService.setItem('user', this.user);
  }

  public refreshUserProjectRoles(user:any){
    let userA = this.userAdapter.adapt(user)
    this.user.projectRoles = userA.projectRoles;
    this.localStorageService.setItem('user', this.user);
    this.user$.next(this.user);
  }

  public clearUser(){
    this.user = null
    this.localStorageService.clear();
    this.user$.next(this.user);
  }

  public getUser(){
    return this.user$;
  }
  public getUsername(){
    return this.user.username;
  }

  public isAdmin(){
    return this.isUserType("admin");
  }

  public isUserType(userType){
    if(!this.user){
      return false
    }
    return this.user.usertype == userType;
  }

}
