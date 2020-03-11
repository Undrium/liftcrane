import {Component, Inject, OnInit}  from '@angular/core';

import { AppConfig }                from '../../app.config';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit {
  menuItems: any[];


  constructor() {}
  ngOnInit() {
    this.loadMenus();
  }



  private loadMenus(): void {
    this.menuItems = [
      {link: '/', name: "Start"}
    ];
  }
}
