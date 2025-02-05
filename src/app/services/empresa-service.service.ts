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



  getEmpresas(page:number=0, size:number=15){
    return this.http.get<Empresas>(`${environment.apiUrl}/empresas`, {
      headers: new HttpHeaders({
        page, size
      })
    });
  }

  getEmpresa(id:number){
    return this.http.get<EmpresaDetalle>(`${environment.apiUrl}/empresas/${id}`);
  }


  postEmpresa(body:any){
    return this.http.post(`${environment.apiUrl}/empresas`, body);
  }
}
