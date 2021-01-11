import { Component, OnInit }  from '@angular/core';
import { Observable }         from 'rxjs';
import { map, share }         from 'rxjs/operators';
import { Router }       from '@angular/router';

import { LocalStorageService }          from './../../services/localstorage.service';

import { 
  MatDialog, 
  MAT_DIALOG_DATA 
}                             from '@angular/material/dialog';

import { PageService }        from '../../services/page.service';
import { ApiService }         from '../../services/api.service';
import { RegistryService }         from '../../services/registry.service';
import { RegistryDialogComponent }       from './registry-dialog.component'
import { DeleteRegistryDialogComponent }       from './delete-registry-dialog.component'


@Component({
  selector: 'app-registries',
  templateUrl: './registries.component.html',
  styleUrls: ['./registries.component.scss']
})
export class RegistriesComponent {
  public registries: Array<any>;
  public secrets: any;

  public registriesObs:Observable<any>;
  constructor(
    public pageService: PageService, 
    public apiService: ApiService, 
    public registryService: RegistryService, 
    public router: Router, 
    public dialog: MatDialog
    ) { 
    this.pageService.pageTitle = "Registries";
    
  }

  registryDialog(): void {
    const dialogRef = this.dialog.open(RegistryDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  view(formatName:string): void{
    this.router.navigate(['/registries/'+formatName]); 
  }
  deleteDialog(registry:any): void{
    const dialogRef = this.dialog.open(DeleteRegistryDialogComponent, {
      width: '250px',
      data: {registry:registry}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
