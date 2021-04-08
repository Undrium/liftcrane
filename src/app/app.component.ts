import { 
  Component, 
  ViewEncapsulation  
}                               from '@angular/core';


import { MatSnackBar }          from '@angular/material/snack-bar';

import { AuthService }          from './services/auth.service';
import { LogService }           from './services/log.service';
import { PageService }          from './services/page.service';

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
      private snackBar: MatSnackBar,
    ) {

  }

  ngOnInit()
  {
    var errorObservable = this.logService.errorSubject.asObservable();
    errorObservable.subscribe((error) => {
      this.snackBar.openFromComponent(StatusBarComponent, {
        data: {error: this.logService.getMessageFromError(error)},
        duration: 5000,
      });
    });
    var messageObservable = this.pageService.messageSubject.asObservable();
    messageObservable.subscribe((message) => {
      this.snackBar.openFromComponent(StatusBarComponent, {
        data: message,
        duration: 4000,
      });
    });
  }

}
