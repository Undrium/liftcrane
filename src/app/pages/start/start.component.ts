import {Component} from '@angular/core';

@Component({
  selector: 'start',
  templateUrl: './start.component.html'
})

export class StartComponent {

  toplist: Array<any> = [];
  tweets: string = "";
  
  constructor() {

  }

  updateToplist(){
  }
}
