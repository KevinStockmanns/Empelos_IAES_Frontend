import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


  hasValue(form:FormGroup,controlName:string){
    return form.get(controlName)?.value;
  }
  hasOneError(form:FormGroup,controlName:string){
    return form.get(controlName)?.invalid && form.get(controlName)?.touched;
  }
  hasError(form:FormGroup,controlName:string, error:string){
    return form.get(controlName)?.hasError(error) && form.get(controlName)?.touched;
  }
  getError(form:FormGroup, controlName:string, error:string){
    return (form.get(controlName)?.errors as ValidationErrors)[error];
  }
}
