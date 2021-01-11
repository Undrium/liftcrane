import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';
import { AuthService }        from '../../services/auth.service';
import { PageService }        from './../../services/page.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  public disableLogin = false;
  constructor(
    private authService: AuthService, 
    private router: Router, 
    public pageService: PageService
  ) {
    this.pageService.pageTitle = "Login";
  }

  login(){
    this.disableLogin = true;
    this.pageService.startLoader("Logging in..");
    this.authService.login(this.username, this.password).subscribe(
      user => {
        if(user.token){
          this.pageService.displayMessage("Welcome, "+user.username+"!");

          if(this.pageService.beforeLogin){
            this.router.navigate([this.pageService.beforeLogin]);
          }else{
            this.router.navigate(['/']);
          }
        }
        this.disableLogin = false;
        this.pageService.stopLoader();
      }, error => {
        this.disableLogin = false;
        console.log(error)
        if(error.status === 0){
          this.pageService.displayMessage("Login service offline, please contact ops if problem persists.");
        }else{
          this.pageService.displayMessage("Failed login.");
        }
        this.pageService.stopLoader();
      }
    );
  }

  ngOnInit(){
    
  }

}
