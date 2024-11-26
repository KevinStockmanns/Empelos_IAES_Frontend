import { AfterViewInit, Component, ElementRef, viewChildren } from '@angular/core';
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
export class UploadFilePage implements AfterViewInit {
  selectedFile: any;
  style = {
    width: '0px',
    left: '0px'
  }
  selectedType:string = 'perfil';
  private slectors = viewChildren<ElementRef<HTMLElement>>('selection');

  constructor(
    private usuarioService:UsuarioService
  ){
    
  }

  ngAfterViewInit(): void {
    let target = this.selectedType == 'cv'
    ? this.slectors()[1].nativeElement as HTMLDivElement
    : this.slectors()[0].nativeElement as HTMLDivElement

    this.style = {
      left: (target.offsetLeft-14) +'px',
      width: (target.offsetWidth+28) + 'px'
    }
  }

  selectType(type:string, event:MouseEvent){
    this.selectedType = type;
    let target = event.target as HTMLDivElement;
    
    this.style = {
      left: (target.offsetLeft-14) +'px',
      width: (target.offsetWidth+28) + 'px'
    }
  }
  drop(e: DragEvent){
    e.preventDefault();
    console.log(e);
    
    console.log('drop');
    
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
