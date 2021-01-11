import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';

import { UsersService }                from './users.service';

@Component({
    selector: 'create-user-dialog',
    templateUrl: 'create-user-dialog.component.html',
})
export class CreateUserDialogComponent {
    newUser: any;

    constructor(
        public usersService: UsersService,
        public dialogRef: MatDialogRef<CreateUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.newUser = {
            username: "",
            email: ""
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    create(): void{
        this.usersService.create(this.newUser).subscribe(() => {
            this.dialogRef.close();
        });
    }

}