import { Component, ViewEncapsulation }   from '@angular/core';
import {NavigationEnd, Router}            from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private router: Router){

  }
}
