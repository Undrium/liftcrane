import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, Router, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { PageService } from '../page.service';


@Injectable({
  providedIn: 'root'
})
export class TypeGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router, public pageService: PageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>
	{
        const expectedUserType = route.data.expectedUserType;
        return this.authService.isUserType(expectedUserType).pipe(
            map(isType => {
                if (isType) {
                    return true;
                }else{
                    this.pageService.beforeLogin = state.url;
                    this.router.navigate(['/login']);
                    return false;
                } 
            })
        );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
