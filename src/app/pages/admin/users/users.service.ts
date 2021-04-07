import { Injectable, EventEmitter }     from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { map }                          from "rxjs/operators";
import { Observable, BehaviorSubject, of, ReplaySubject  }         from 'rxjs';

import { CloudGuardDataSource }          from '../../../services/cloudguard.data-source';

import * as _                           from 'lodash';

@Injectable({providedIn: 'root'})
export class UsersService {
  
    // When needed update 
    public users$: ReplaySubject<Array<any>>; 

    constructor(private cloudGuardDataSource: CloudGuardDataSource) {
        this.fetchUsers();
        this.users$ = new ReplaySubject<Array<any>>(1);
    }

    public fetchUsers(){
        return this.cloudGuardDataSource.getUsers().subscribe((users: any[]) => {
            this.users$.next(users);
        });
    }

    public update(user: any){
        return this.cloudGuardDataSource.updateUser(user.username, user).subscribe((response: any) => {
            this.fetchUsers();
        });
    }

    public delete(user: any){
        return this.cloudGuardDataSource.deleteUser(user.username).subscribe((response: any) => {
            this.fetchUsers();
        });
    }

    public create(user: any){
        return this.cloudGuardDataSource.createUser(user).pipe(map((response: any) => {
            this.fetchUsers();
            return response;
        }));
    }
  


}
