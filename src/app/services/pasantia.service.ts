import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../env/env';
import { Paginacion } from '../models/paginacion.model';
import { PasantiaDetalle, PasantiaListado } from '../models/pasantia.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PasantiaService {
  plataformId;

  constructor(
    private http: HttpClient

  ) { 
    this.plataformId = inject(PLATFORM_ID);
  }




  listarPasantias(filtros?:{
    pendiente?:boolean,
    estado?:string,
    fecha?:string,
    page?:number,
    usuario?:string
  }){
    return this.http.get<Paginacion<PasantiaListado>>(`${environment.apiUrl}/pasantias`, {params: filtros});
  }


  getPasantia(id:number){
    return this.http.get<PasantiaDetalle>(`${environment.apiUrl}/pasantias/${id}`)
  }

  deletePasantia(id:number){
    return this.http.delete(`${environment.apiUrl}/pasantias/${id}`);
  }

  responderPasantia(id:number, body:any){
    return this.http.post(`${environment.apiUrl}/pasantias/${id}/responder`, body);
  }




  selectPasantia(pasantia: PasantiaListado|null){
    if(isPlatformBrowser(this.plataformId)){
      if(pasantia){
        localStorage.setItem('pasantiaSelected', JSON.stringify(pasantia));
      }else{
        localStorage.removeItem('pasantiaSelected')
      }
    }
  }

  getSelectedPasantia(): PasantiaListado|null{
    if(isPlatformBrowser(this.plataformId)){
      return JSON.parse(localStorage.getItem('pasantiaSelected') as string) as PasantiaListado|null;
    }
    return null;
  }


  pasantiaIsEditable(pasantia: PasantiaDetalle){
    return pasantia.estado == 'SOLICITADA';
  }
}
