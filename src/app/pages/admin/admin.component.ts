import { AdminRoutingModule, adminRoutes } from './admin-routing.module';
import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    public pageService: PageService,
    public adminRoutes: ActivatedRoute,
    ) { 
      this.pageService.pageTitle = "Admin";
    }

  ngOnInit() {
    
  }

}
