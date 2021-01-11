import { Component, OnInit, Input } from '@angular/core';

import { Router }                   from '@angular/router';

@Component({
  selector: 'docs-menu',
  templateUrl: './docs-menu.component.html',
  styleUrls: ['./docs-menu.component.scss']
})
export class DocsMenuComponent implements OnInit {

  constructor(
  	private router: Router
  ) { }

  ngOnInit() {}

  navigateDocs(menuItem:any):any{
    if(menuItem.children){
      return;
    }
    this.router.navigateByUrl('/docs/'+menuItem.url);
  }

  public menuItems = [
    { label: 'About', url: 'about'},
    { label: 'Dev Guide', children: [
      { label: 'Rollbacks', url: 'dev/rollback' }
    ]},
    { label: 'Changelog', url: 'CHANGELOG' },
    { label: 'FAQ', url: 'faq' }
  ];

}
