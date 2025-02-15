import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-empresa',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>
      ¿Estás seguro que deseas eliminar la empresa con id {{data.id}}? 
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Eliminar</button>
    </mat-dialog-actions>
  `,
  styles: ``
})
export class DeleteEmpresaModal {
  data = inject(MAT_DIALOG_DATA);
  constructor(public dialogRef: MatDialogRef<DeleteEmpresaModal>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
