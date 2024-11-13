import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { ButtonComponent } from '../../../components/button/button.component';
import { Usuario } from '../../../models/usuario.model';
import { LoaderComponent } from '../../../components/loader/loader.component';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [HeaderComponent, ButtonComponent, LoaderComponent],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.css'
})
export class UsersListPage {
  loading = true;
  usuarios: WritableSignal<Usuario[]> = signal([]);


  constructor(
    protected usuarioService: UsuarioService
  ){
    usuarioService.listarUsuarios(1).subscribe({
      next: res=>{
        this.loading = false;
        this.usuarios.update(prevUsuarios => [...prevUsuarios, ...res.content]);
        console.log(res);
        
      }, 
      error: err=>{
        this.loading = false;
        console.log(err);
        
        //logica de error
      }
    })
  }
}
