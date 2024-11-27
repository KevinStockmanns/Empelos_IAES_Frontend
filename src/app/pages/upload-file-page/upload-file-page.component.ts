import { AfterViewInit, Component, ElementRef, signal, viewChild, viewChildren } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service.service';
import { ButtonComponent } from '../../components/button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, Location } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-upload-file-page',
  standalone: true,
  imports: [ButtonComponent, MatIconModule , DecimalPipe, LoaderComponent],
  templateUrl: './upload-file-page.component.html',
  styleUrl: './upload-file-page.component.css'
})
export class UploadFilePage implements AfterViewInit {
  selectedFile: File|undefined;
  style = {
    width: '0px',
    left: '0px'
  }
  selectedType:string = 'perfil';
  private slectors = viewChildren<ElementRef<HTMLElement>>('selection');
  private inputFile = viewChild.required<HTMLInputElement>('fileInput');
  isDragInArea=false;
  imgRsc = '';
  error = '';
  loading = signal(false);
  id;

  constructor(
    private usuarioService:UsuarioService,
    private activatedRoute:ActivatedRoute,
    private location:Location,
    private noti:NotificationService
  ){
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let target = this.selectedType === 'cv'
        ? this.slectors()[1].nativeElement as HTMLDivElement
        : this.slectors()[0].nativeElement as HTMLDivElement;
  
      this.style = {
        left: (target.offsetLeft - 14) + 'px',
        width: (target.offsetWidth + 28) + 'px'
      };
    });
  }

  selectType(type:string, event:MouseEvent){
    this.selectedType = type;
    let target = event.target as HTMLDivElement;
    
    this.style = {
      left: (target.offsetLeft-14) + 'px',
      width: (target.offsetWidth+28) + 'px'
    };
  }

  processFile(files: FileList|null|undefined) {
    if (files && files.length > 0) {
      let file = files[0];
      if(!file.type.startsWith('image')){
        this.error = 'Archivo inválido.'
        return
      }
      let validImages = ['webp', 'png', 'jpg', 'jpeg'];
      let ext = file.name.split('.')[1];
      if(!validImages.some(el=>el==ext)){
        this.error = 'Formato permitido: .png, p.webp, .jpg o .jpeg'
        return
      }

      let reader = new FileReader();
      reader.onload = ((e)=>{
        this.imgRsc = e.target?.result as string;
      });
      reader.readAsDataURL(file)
      
      this.error='';
      this.selectedFile = file;
    }
    
  }
  onSubmit(){
    if(this.error==''){
      if(this.selectedType=='cv'){

      }else{
        this.loading.set(true);
        const formData = new FormData();
        formData.append('imagen', this.selectedFile as File);
        this.usuarioService.postFotoPerfil(this.id, formData).subscribe({
          next:res=> {
            this.noti.notificate(`${this.selectedType=='cv' ? 'Currículum Subido' : 'Foto Subida'}`, '', false, 5000);
            this.location.back();
            this.loading.set(false);
          },
          error: err=>{
            this.loading.set(false);
            console.log(err)
          }
        })
      }
    }
  }


  onDragOver(e:DragEvent){
    e.preventDefault();
    this.isDragInArea = true;
  }
  onDragLeave(e:DragEvent){
    e.preventDefault();
    this.isDragInArea = false;
  }
  onDrop(e:DragEvent){
    e.preventDefault();
    this.isDragInArea = false;
    this.processFile(e.dataTransfer?.files);
  }


  getSize(){
    return this.selectedFile
      ? this.selectedFile.size / 1024
      : 0;
  }
}
