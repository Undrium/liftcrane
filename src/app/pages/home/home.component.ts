import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PageService } from '../../services/page.service';



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  data: any
  options: any
  constructor(
    public authService: AuthService,
    public pageService: PageService,
  ) {
    this.pageService.pageTitle = "Start";
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
            {
                label: 'AWS',
                data: [28, 48, 40, 19, 86, 27, 90],
                backgroundColor: '#7E57C2'
              },
              {
                label: 'Azure',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: '#42A5F5'
            }
        ]
    };
    this.options = {
        title: {
            display: true,
            text: 'Cloud Infra historic usage',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        }
    };
  }

}
