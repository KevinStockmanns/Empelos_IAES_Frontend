import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';
import { environment } from '../../env/env';
import { tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Paginacion } from '../models/paginacion.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _usuario = signal<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router:Router
  ) {}

  listarUsuarios(page:number, rol?:string){
    let querys = `page=${page}`
    if (rol){
      querys += `&rol=${rol}`
    }
    return this.http.get<Paginacion<Usuario>>(`${environment.apiUrl}/usuarios?${querys}`)
  }

  login(correo: string, clave: string) {
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios/login`, {
      username: correo,
      clave: clave
    }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          this.storeToken(res.token as string);
          this.setUsuario(res);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken'); 
    }
    return null;
  }

  setUsuario(user: Usuario): void {
    this._usuario.set(user); 
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user)); 
    }
  }

  getUsuario(): Signal<Usuario | null> {
    if(isPlatformBrowser(this.platformId)){
      let user:Usuario = JSON.parse(localStorage.getItem('user') as string);
      this.setUsuario(user);
      return this._usuario.asReadonly();
    }
    return signal(null).asReadonly();
  }

  isAdmin(): boolean {
    const user = this.getUsuario()();
    return user 
      ? user.rol === 'ADMIN' || user.rol === 'DEV' 
      : false;
  }

  logout(): void {
    this._usuario.set(null); 
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }
  isLogged(){
    return this.getUsuario()() !=null;
  }


  getFullName(usuario?:Usuario):string{
    return usuario 
      ?`${usuario.apellido}, ${usuario.nombre}`
      :`${this._usuario()?.apellido}, ${this._usuario()?.nombre}`;
  }
}
