import { AbstractControl, ValidatorFn } from "@angular/forms";


export function isInteger(): ValidatorFn{
    return (control:AbstractControl)=>{
        const value = control.value;
        // Ensure the value is a number
        if (value === null || value === undefined) {
        return null; // Allow empty or non-numeric values (adjust as needed)
        }

        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
        return { isinteger: true };
        }

        return null;
    }
}