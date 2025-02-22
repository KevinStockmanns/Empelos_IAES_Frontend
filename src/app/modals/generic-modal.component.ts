import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-empresa',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{data.textTitle}}</h2>
    <mat-dialog-content>
      {{data.text}} 
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">{{data.textCancelar}}</button>
      <button mat-button [mat-dialog-close]="true" color="warn">{{data.textConfirmar}}</button>
    </mat-dialog-actions>
  `,
  styles: ``
})
export class GenericModal {
  data = inject(MAT_DIALOG_DATA);
  constructor(public dialogRef: MatDialogRef<GenericModal>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
