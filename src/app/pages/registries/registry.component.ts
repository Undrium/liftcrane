import { Component, OnInit }  from '@angular/core';
import { Observable }         from 'rxjs';
import { map, share }         from 'rxjs/operators';
import { Router,ActivatedRoute }       from '@angular/router';

import { LocalStorageService }          from './../../services/localstorage.service';

import { 
  MatDialog, 
  MAT_DIALOG_DATA 
}                             from '@angular/material/dialog';

import { PageService }        from '../../services/page.service';
import { ApiService }         from '../../services/api.service';


@Component({
  selector: 'app-registries',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent {
  id:number;
  formatName:string;
  public registries: Array<any>;
  public api: any;
  public registry: any;
  public projects: any;
  private sub: any;

  constructor(
    public pageService: PageService, 
    public apiService: ApiService, 
    public router: Router, 
    public route: ActivatedRoute, 
    public localStorageService: LocalStorageService, 
    public dialog: MatDialog
    ) { 
    this.pageService.pageTitle = "Registry";

    this.registries = this.localStorageService.getItem('registries') ? this.localStorageService.getItem('registries') : [];
    
    this.sub = this.route.params.subscribe(params => {
      this.formatName = params['formatName']; 
        this.registries.forEach((registry) => {
          if(registry.formatName === this.formatName){
            this.registry = registry;
            return;
          }
    
        });

      this.api = this.apiService.getRegistry(this.registry)

      this.api.getProjects().subscribe(
        (res:any) => {
          this.projects = res || []
          return res || []
        }
    );



   });
  }
  

}
