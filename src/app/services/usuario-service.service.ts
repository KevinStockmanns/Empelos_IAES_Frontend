import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID, Signal, signal } from '@angular/core';
import { environment } from '../../env/env';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Contacto, ExperienciaLaboral, Habilidad, PerfilProfesional, Usuario, UsuarioDetalle, UsuarioListado, UsuarioPerfilCompletado } from '../models/usuario.model';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Paginacion } from '../models/paginacion.model';
import { Roles } from '../models/rol.model';
import { Educacion } from '../models/educacion.model';
import { PasantiaUsuario } from '../models/pasantia.model';
import { UsuarioEmpresaPasantia } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _usuario = signal<Usuario | null>(null);

  private selectedUsuarioSubject = new BehaviorSubject<Usuario|UsuarioDetalle|UsuarioEmpresaPasantia|UsuarioListado|null>(null);

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
  getGeneros(){
    return this.http.get<string[]>(`${environment.apiUrl}/usuarios/generos`)
  }
  getEstadoCivil(){
    return this.http.get<string[]>(`${environment.apiUrl}/usuarios/estado-civil`)
  }
  listarUsuarios(page: number, filtros?: {
    nombre?:string,
    edad?:number,
    correo?:string,
    estado?:string,
    rol?:string,
  }) {
    let params = new HttpParams().set('page', page.toString());

    if (filtros) {
      Object.keys(filtros).forEach((key) => {
        const k = key as keyof typeof filtros;
        if (filtros[k] !== undefined && filtros[k] !== null) {
          params = params.set(key, filtros[k].toString());
        }
      });
    }

    return this.http.get<Paginacion<Usuario | UsuarioListado>>(`${environment.apiUrl}/usuarios`, { params });
}

  restoreClave(id:number){
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/clave-restore`, {})
  }
  changePassword(id:number, body:any){
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/change-password`, body)
  }

  getDisponibilidades(){
    return this.http.get<string[]>(`${environment.apiUrl}/disponiblidad`);
  }
  getLicenciasCategorias(){
    return this.http.get<string[]>(`${environment.apiUrl}/licenciaConducir/categorias`);
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
    return this.http.post<{titulos: Educacion[]}>(`${environment.apiUrl}/usuarios/${id}/titulo`, body);
  }

  postExperiencia(id:any, body:any){
    return this.http.post<{experienciasLaborales: ExperienciaLaboral[]}>(`${environment.apiUrl}/usuarios/${id}/expLaboral`, body);
  }
  postLicenciaConducir(id:any, body:any){
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/licenciaConducir`, body);
  }
  postPasantia(body:any){
    return this.http.post(`${environment.apiUrl}/pasantias`, body);
  }

  postUsuarioEstado(id:number, body:any){
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/estado`, body);
  }
  postPerfilEstado(){
    return this.http.post<string>(`${environment.apiUrl}/usuarios/public-ocult`, {});
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
          this.selectUser(res)
          if(this.isAdmin()){
            this.router.navigate(['/dashboard']);

          }else{
            if(res.estado == 'SOLICITADO'){
              this.router.navigate(['/wait'])
            }else{
              this.router.navigate(['/dashboard/profile'])
            }
          }
        }
      })
    );
  }

  register(body:any){
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, body).pipe(
      tap(res=>{
        this.storeToken(res.token as string);
        this.setUsuario(res);
        this.selectUser(res);

        this.router.navigate(['/wait'])
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
  isAlumn(usuario?:UsuarioDetalle|null): boolean{
    const user = usuario ? usuario : this.getUsuario();
    return user
      ? user.rol == 'EGRESADO' || user.rol == 'ALUMNO'
      : false;
  }

  logout(): void {
    this.selectUser(null);
    this._usuario.set(null); 
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedEmpresa');
      localStorage.removeItem('pasantiaSelected');
      localStorage.removeItem('usuarioSelected');
      localStorage.removeItem('dashContent');
      this.router.navigate(['/']);
    }
  }
  isLogged(){
    return this.getUsuario() !=null;
  }


  selectUser(usuario: Usuario|UsuarioDetalle|UsuarioListado|UsuarioEmpresaPasantia|null){

    this.selectedUsuarioSubject.next(usuario);
    if(isPlatformBrowser(this.platformId)){
      if(usuario){
        localStorage.setItem('usuarioSelected', JSON.stringify(usuario));
      }else{
        localStorage.removeItem('usuarioSelected')
      }
    }
  }

  getSelectedUsuario():Usuario|UsuarioDetalle|UsuarioEmpresaPasantia|UsuarioListado|null{
    if(isPlatformBrowser(this.platformId)){
      let usuario = localStorage.getItem('usuarioSelected');
      if(usuario){
        let parsedUser = JSON.parse(usuario) as Usuario|UsuarioDetalle|UsuarioEmpresaPasantia|UsuarioListado;
        this.selectedUsuarioSubject.next(parsedUser);
        return parsedUser;
      }else{
        this.selectedUsuarioSubject.next(null);
      }
    }
    return null;
  }
  getSelectedUsuario$(): Observable<Usuario|UsuarioDetalle|UsuarioEmpresaPasantia|UsuarioListado|null> {
    return this.selectedUsuarioSubject.asObservable();
  }


  getFullName(usuario?:Usuario|UsuarioListado|UsuarioDetalle|PasantiaUsuario|UsuarioEmpresaPasantia|null):string{
    return usuario 
      ?`${usuario.apellido}, ${usuario.nombre}`
      :`${this._usuario()?.apellido}, ${this._usuario()?.nombre}`;
  }
  getFirstName(usuario?: Usuario | UsuarioListado | UsuarioDetalle | PasantiaUsuario | UsuarioEmpresaPasantia | null): string {
    let nombre = usuario ? usuario.nombre : this.getUsuario()?.nombre;
    nombre = (nombre?.split(' ')[0] || '');
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
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

  isOwner(usuario?:Usuario|UsuarioListado|UsuarioDetalle|UsuarioEmpresaPasantia|undefined){
    if(!usuario){
      usuario = this.getUsuario() as Usuario;
    }
    if(isPlatformBrowser(this.platformId)){
      return this.getUsuario()?.id == usuario?.id;
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



  selectExperiencia(exp:ExperienciaLaboral|null){
    if(isPlatformBrowser(this.platformId)){
      if(exp){
        localStorage.setItem('selectedExp', JSON.stringify(exp))
      }else{
        localStorage.removeItem('selectedExp')
      }
    }
  }

  getSelectedExp(): ExperienciaLaboral|null{
    if(isPlatformBrowser(this.platformId)){
      return JSON.parse(localStorage.getItem('selectedExp') as string) as ExperienciaLaboral|null;
    }
    return null;
  }
}
