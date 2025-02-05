import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';
import { environment } from '../../env/env';
import { Observable, tap } from 'rxjs';
import { Contacto, Habilidad, PerfilProfesional, Usuario, UsuarioDetalle, UsuarioListado, UsuarioPerfilCompletado } from '../models/usuario.model';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Paginacion } from '../models/paginacion.model';
import { Roles } from '../models/rol.model';
import { Educacion } from '../models/educacion.model';

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



  createUser(body:any){
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, body);
  }
  getRoles(){
    return this.http.get<Roles>(`${environment.apiUrl}/usuarios/roles`)
  }
  listarUsuarios(page: number, filtros?: { rol?: string; nombre?: string }) {
    let params = new HttpParams();
    params = params.set('page', page.toString()); // Convierte 'page' a string

    if (filtros?.rol) {
        params = params.set('rol', filtros.rol);
    }
    if (filtros?.nombre) {
        params = params.set('nombre', filtros.nombre);
    }

    return this.http.get<Paginacion<Usuario | UsuarioListado>>(`${environment.apiUrl}/usuarios`, { params });
}

  getUsuarioDetalles(id:number): Observable<UsuarioDetalle>{
    return this.http.get<UsuarioDetalle>(`${environment.apiUrl}/usuarios/${id}/detalles`)
  }
  getPerfilCompletado(id:number){
    return this.http.get<UsuarioPerfilCompletado>(`${environment.apiUrl}/usuarios/${id}/completado`)
  }
  postPerfilProfesional(id:number, body:any){
    return this.http.post<PerfilProfesional>(`${environment.apiUrl}/usuarios/${id}/perfil_profesional`, body);
  }
  postContacto(id:number, body:any){
    return this.http.post<Contacto>(`${environment.apiUrl}/usuarios/${id}/contacto`, body);
  }
  putUsuario(id:number, body:any){
    return this.http.put(`${environment.apiUrl}/usuarios/${id}`, body);
  }
  postFotoPerfil(id:any, body:any){
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/imagen`, body)
  }
  postCV(id:any, body:any){
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/cv`, body);
  }
  postUbicacion(id:number, body:any){
    if(!body.ubicacion.piso){
      delete body.ubicacion.piso;
    }
    if(!body.ubicacion.numero){
      delete body.ubicacion.numero;
    }
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/ubicacion`, body);
  }
  postHabilidades(id:number, body:any){
    return this.http.post<{habilidades: Habilidad[]}>(`${environment.apiUrl}/usuarios/${id}/habilidades`, body);
  }
  postEducacion(id:any, body:any){
    return this.http.post<Educacion>(`${environment.apiUrl}/usuarios/${id}/titulo`, body);
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
          if(this.isAdmin()){
            this.router.navigate(['/dashboard']);

          }else{
            this.router.navigate(['/dashboard/profile'])
          }
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

  getUsuario(): Usuario | null {
    if(isPlatformBrowser(this.platformId)){
      let user:Usuario = JSON.parse(localStorage.getItem('user') as string);
      // this.setUsuario(user);
      return user;
    }
    return null;
  }

  isAdmin(): boolean {
    const user = this.getUsuario();
    return user 
      ? user.rol === 'ADMIN' || user.rol === 'DEV' 
      : false;
  }

  logout(): void {
    this._usuario.set(null); 
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    }
  }
  isLogged(){
    return this.getUsuario() !=null;
  }


  getFullName(usuario?:Usuario|UsuarioListado|UsuarioDetalle):string{
    return usuario 
      ?`${usuario.apellido}, ${usuario.nombre}`
      :`${this._usuario()?.apellido}, ${this._usuario()?.nombre}`;
  }
  getYearsOld(usuario?:Usuario|UsuarioListado|UsuarioDetalle){
    if (!usuario) {
      return null;
    }
  
    const nacimiento = new Date(usuario.fechaNacimiento);
    const now = new Date();
    const ageInMilliseconds = now.getTime() - nacimiento.getTime();
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
  
    return ageInYears;
  }

  isOwner(usuario:Usuario|UsuarioListado|UsuarioDetalle){
    if(isPlatformBrowser(this.platformId)){
      return this.getUsuario()?.id == usuario.id;
    }
    return false;
  }

  storageSkills(hab:Habilidad[]){
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem('habilidades', JSON.stringify(hab));
    }
  }
  getStoragedSkills(): Habilidad[]|null{
    if(isPlatformBrowser(this.platformId)){
      let data = localStorage.getItem('habilidades');
      
      return data ? JSON.parse(data) : [];
    }
    return null;
  }
  removeStoragedSkills(){
    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem('habilidades');
    }
  }


  storageEduacion(educacion:Educacion){
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem('ed', JSON.stringify(educacion));
    }
  }
  getStoragedEduacion(){
    if(isPlatformBrowser(this.platformId)){
      return localStorage.getItem('ed');
    }
    return null;
  }
  removeStoragedEducacion(){
    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem('ed');
    }
  }
}
