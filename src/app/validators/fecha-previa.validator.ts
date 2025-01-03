import { AbstractControl, ValidatorFn } from "@angular/forms";


export function fechaPrevia(): ValidatorFn{
    return (control:AbstractControl)=>{
        const value = control.value;
        if (value === null || value === undefined) {
            return null; 
        }
        const fechaControl = new Date(control.value);
        const fechaActual = new Date();
        return fechaControl > fechaActual ? { fechaPrevia: true } : null;
    }
}