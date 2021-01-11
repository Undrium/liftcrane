import { Component, Inject }    from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';


@Component({
  selector: 'object-editor-dialog',
  templateUrl: './object-editor-dialog.component.html',
  styleUrls: ['./object-editor-dialog.component.scss']
})
export class ObjectEditorDialogComponent {

  constructor(public dialogRef: MatDialogRef<ObjectEditorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}
