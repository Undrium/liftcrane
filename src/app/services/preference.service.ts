import { Injectable, EventEmitter }     from '@angular/core';
import { map, take }                    from "rxjs/operators";
import { ReplaySubject  }               from 'rxjs';

import { CloudGuardDataSource }            from './cloudguard.data-source';
import { ProfileService }               from './profile.service';
import { LocalStorageService }          from './localstorage.service';

import * as _                           from 'lodash';

@Injectable({providedIn: 'root'})
export class PreferenceService {
  
    public preferences$: ReplaySubject<Array<any>>; 

    constructor(
        private cloudGuardDataSource: CloudGuardDataSource,
        private localStorageService: LocalStorageService,
        private profileService: ProfileService
    ) {
        this.preferences$ = new ReplaySubject<Array<any>>();
        this.profileService.user$.subscribe(user => {
            if(user && user.preferences){
                this.preferences$.next(user.preferences);
            }
        });
    }

    

    public addOrUpdatePreference(preferenceName: string, preferenceValue: string){
        this.preferences$.subscribe(preferences => {
            var newPreference = {preferenceName: preferenceName, preferenceValue: preferenceValue};
            // Don't do anything if already exists
            if(this.preferenceExists(preferences, newPreference)){
                return false;
            }
            var foundPref = preferences.find(function(el){ return el.preferenceName === preferenceName;});
            
            if(!foundPref){
                preferences.push(newPreference)
            }else{
                foundPref.preferenceValue = preferenceValue
            }
            // Save the local preference object which is in the profile/user
            this.profileService.saveUserLocally();
            return this.cloudGuardDataSource.updatePreferences(preferences).subscribe((projects: any[]) => {});
        });
    }

    public getPreferenceByName(name: string){
        return this.preferences$.pipe(take(1)).pipe(map(preferences => {
            return preferences.find(function(el){ 
                return el.preferenceName === name;
            })
        }));
    }

    public preferenceExists(preferences: any[], preferenceObject: any): boolean{
        return preferences.find(function(el){ 
            return el.preferenceName === preferenceObject.preferenceName &&  el.preferenceValue === preferenceObject.preferenceValue;  
        }) !== undefined;
    }

}
