import { 
  Component, 
  ViewEncapsulation  
}                               from '@angular/core';


import { MatDialog }            from '@angular/material/dialog';
import { MatSnackBar }          from '@angular/material/snack-bar';

import { AuthService }          from './services/auth.service';
import { LogService }           from './services/log.service';
import { PageService }          from './services/page.service';

import { SupportDialogComponent }  from './components/support-dialog/support-dialog.component'

import { StatusBarComponent }   from './components/status-bar/status-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'liftcrane';

  constructor(
      public authService: AuthService,
      public logService: LogService,
      public pageService: PageService,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
    ) {

  }

  supportDialog(){
    const dialogRef = this.dialog.open(SupportDialogComponent, {
      width: '650px',
      data: {}
    });
  }

  ngOnInit()
  {
    var messageObservable = this.logService.messageSubject.asObservable();
    messageObservable.subscribe((message) => {
      this.snackBar.openFromComponent(StatusBarComponent, {
        data: message,
        duration: 5000,
      });
    });
  }

}
