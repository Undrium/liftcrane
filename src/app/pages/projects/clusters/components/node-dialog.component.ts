import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

@Component({
    selector: 'node-dialog',
    templateUrl: 'node-dialog.component.html',
})
export class NodeDialogComponent {
    node: any;
    showRaw = true;

    constructor(
        public dialogRef: MatDialogRef<NodeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.node = this.data.node;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    
    formChanged(){
        this.showRaw = false;
        setTimeout(() => {this.showRaw = true}, 100);
    }
    updateDeployment(): void{}
}