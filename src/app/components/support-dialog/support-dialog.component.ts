import { Component, Inject }    from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';


@Component({
  selector: 'support-dialog',
  templateUrl: './support-dialog.component.html',
  styleUrls: ['./support-dialog.component.scss']
})
export class SupportDialogComponent {

  constructor(public dialogRef: MatDialogRef<SupportDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
