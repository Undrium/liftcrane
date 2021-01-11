import { Component, OnInit, Input } from '@angular/core';

import { Router, ActivatedRoute, Params }   from '@angular/router';

import { PageService } from './../../services/page.service';

@Component({
  selector: 'docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  markdownUrl = "";

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public pageService: PageService
  ) { 
    this.pageService.pageTitle = "Docs";
  }


  ngOnInit() {
    
    this.activatedRoute.params.subscribe((params: Params) => {
        let fullPath = "";
        if(params['path1']) fullPath += params['path1'];
        if(params['path2']) fullPath += "/"+params['path2'];
        if(params['path3']) fullPath += "/"+params['path3'];
        fullPath = fullPath || "about";
        this.markdownUrl = "app/pages/docs/docs/"+fullPath + ".md";
    });

  }
}
