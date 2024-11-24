import { Component } from '@angular/core';
import { Event } from '@angular/router';
import { File } from 'buffer';
import { UsuarioService } from '../../services/usuario-service.service';

@Component({
  selector: 'app-upload-file-page',
  standalone: true,
  imports: [],
  templateUrl: './upload-file-page.component.html',
  styleUrl: './upload-file-page.component.css'
})
export class UploadFilePage {
  selectedFile: any;

  constructor(
    private usuarioService:UsuarioService
  ){

  }

  onFileSelected(target: HTMLInputElement) {
    // const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      console.log(target.files);
      
      this.selectedFile = target.files[0];
    }
    console.log(target);
    
    // ... process file
  }
  onSubmit(){
    console.log(this.selectedFile);
    const formData = new FormData();
    formData.append('imagen', this.selectedFile);
    this.usuarioService.postFotoPerfil(formData).subscribe({
      next:res=> console.log(res),
      error: err=> console.log(err)
    })
  }
}
