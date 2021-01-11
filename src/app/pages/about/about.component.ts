import { Component, OnInit } from '@angular/core';
import { PageService } from './../../services/page.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    public pageService: PageService
  ) { 
    this.pageService.pageTitle = "About";
  }

  ngOnInit() {
    
  }

}
