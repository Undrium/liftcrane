import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(
    public pageService: PageService
  ) { 
    this.pageService.pageTitle = "Project";
  }
  ngOnInit() {
  }

}