import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/env';
import { EmpresaDetalle, Empresas } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http:HttpClient
  ) { 

  }


  selectEmpresa(id:any){
    if(id){
      localStorage.setItem('selectedEmpresa', JSON.stringify(id));
    }else{
      localStorage.removeItem('selectedEmpresa')
    }
  }
  getSelectedEmpresa(){
    let selectedEmpresa = localStorage.getItem('selectedEmpresa');
    if(selectedEmpresa){
      return selectedEmpresa;
    }
    return null;
  }



  getEmpresas(page:number=0, size:number=15, filtros?:any){
    return this.http.get<Empresas>(`${environment.apiUrl}/empresas`, {
      headers: new HttpHeaders({
        page, size
      }),
      params: filtros
    });
  }

  getEmpresa(id:number){
    return this.http.get<EmpresaDetalle>(`${environment.apiUrl}/empresas/${id}`);
  }


  postEmpresa(body:any){
    return this.http.post(`${environment.apiUrl}/empresas`, body);
  }

  deleteEmpresa(idEmpresa:number, IdActualUser:number){
    return this.http.delete(`${environment.apiUrl}/empresas/${idEmpresa}`, {
      body: {
        idUsuario: IdActualUser
      }
    })
  }
}
