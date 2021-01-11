import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';


import { RegistryService }                from '../../services/registry.service';


@Component({
    selector: 'delete-registry-dialog',
    templateUrl: 'delete-registry-dialog.component.html'
})
export class DeleteRegistryDialogComponent {
    registry: any;

    constructor(
        public registryService: RegistryService,
        public dialogRef: MatDialogRef<DeleteRegistryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.registry = data.registry;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    delete(formatName: string): void{
        this.registryService.deleteRegistry(formatName).subscribe(resp =>{
            this.registryService.getRegistries(true)
            this.dialogRef.close();
        });
    }

}