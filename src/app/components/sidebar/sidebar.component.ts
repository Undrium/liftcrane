import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PageService } from '../../services/page.service';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

import { environment } from '../../../environments/environment';

export class MenuItem {
  path: string;
  title: string;
  icon?: string;
  parent: string;
  children: Array<any>;
  settings: any;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems: MenuItem[]; 
  environmentData : any;
  constructor(
      private breakpointObserver: BreakpointObserver, 
      public pageService: PageService, 
      public authService: AuthService,
      public profileService: ProfileService,
      private router: Router
  ) {
    this.environmentData = environment;
    this.menuItems = this.getMenuItems();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  getMenuItems(): MenuItem[] {  
    return this.router.config
    .filter(route => route.data && route.data.title && !route.data.parent) 
    .map(route => {
        return {
            path: route.path,
            title: route.data.title,
            icon: route.data.icon,
            faIcon: route.data.faIcon,
            parent: "",
            settings: route.data,
            children: this.router.config
              .filter(childRoute => 
                childRoute.data && 
                childRoute.data.title && 
                childRoute.data.parent && 
                childRoute.data.parent == route.path
                ) 
              .map(childRoute => {
                  return {
                      path: childRoute.path,
                      title: childRoute.data.title,
                      icon: childRoute.data.icon,
                      faIcon: childRoute.data.faIcon,
                      parent: route.path,
                      settings: childRoute.data,
                      children: []
                  };
              })
        };
    });
  }

}
