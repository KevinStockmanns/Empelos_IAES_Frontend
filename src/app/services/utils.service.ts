import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Provincias } from '../models/provincia.model';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../env/env';
import { Paginacion } from '../models/paginacion.model';
import { TituloListado } from '../models/titulo.model';
import { Habilidad } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private plataformID;

  constructor(private http:HttpClient) {
    this.plataformID = inject(PLATFORM_ID);
   }


  getProvincias(){
    return this.http.get<Provincias>('https://apis.datos.gob.ar/georef/api/provincias');
  }
  getTitulos(){
    return this.http.get<Paginacion<TituloListado>>(`${environment.apiUrl}/titulos`);
  }
  getHabilidades(){
    return this.http.get<Habilidad[]>(`${environment.apiUrl}/habilidades`);
  }

  limpiarObjeto(objeto:any) {
    if (typeof objeto !== 'object' || objeto === null) {
      return objeto; // Si no es un objeto o es nulo, retornamos el valor original
    }
  
    let nuevoObjeto:any = Array.isArray(objeto) ? [] : {};
  
    for (const propiedad in objeto) {
      const valor = objeto[propiedad];
  
      if (valor !== null && valor !== "" && 
          (!Array.isArray(valor) || valor.length > 0)) {
        nuevoObjeto[propiedad] = this.limpiarObjeto(valor); // Llamada recursiva para objetos anidados
      }
    }
  
    return nuevoObjeto;
  }


  hasValue(form:FormGroup,controlName:string){
    return form.get(controlName)?.value;
  }
  getValue(form:FormGroup, controlName:string){
    return form.get(controlName)?.value;
  }
  hasOneError(form:FormGroup|AbstractControl,controlName:string){
    return form.get(controlName)?.invalid && form.get(controlName)?.touched;
  }
  hasError(form:FormGroup|AbstractControl,controlName:string, error:string){
    return form.get(controlName)?.hasError(error) && form.get(controlName)?.touched;
  }
  getError(form:FormGroup, controlName:string, error:string){
    return (form.get(controlName)?.errors as ValidationErrors)[error];
  }
  toggleInput(form:FormGroup, controlName: string){
    form.get(controlName)?.setValue(!form.get(controlName)?.value);
  }
  formWasChanged(form: FormGroup, initialValues: string): boolean {
  
    return JSON.stringify(form.value) != initialValues;
  }
  getChangedFields(form: FormGroup, initialValues: any): any {
    const initialValuesObj = JSON.parse(initialValues);
    const changedFields: any = {};
  
    for (const controlName in form.controls) {
      if (form.controls[controlName].value !== initialValuesObj[controlName]) {
        changedFields[controlName] = form.controls[controlName].value;
      }
    }
  
    return changedFields;
  }




  selectDashContent(page:string|null){
    if(isPlatformBrowser(this.plataformID)){
      if(page){
        localStorage.setItem('dashContent', page);
      }else{
        localStorage.removeItem('dashContent');
      }
    }
  }
  getSelectedDashContent(){
    if(isPlatformBrowser(this.plataformID)){
      return localStorage.getItem('dashContent');
    }
    return null;
  }
}
