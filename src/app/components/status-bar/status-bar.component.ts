import { Component, Inject }    from '@angular/core';

import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

import { LogService }   from '../../services/log.service';


@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent {
    message: string = "";
    constructor(
      public logService: LogService, 
      @Inject(MAT_SNACK_BAR_DATA) public data: any
      ) {
        if(data.error){
          this.message = data.error;
        }else if(data){
          this.message = data;
        }else{
          this.message = "I Do not know why I am popping up!";
        }

      }



}
