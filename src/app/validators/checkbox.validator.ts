import { AbstractControl, FormArray, ValidatorFn } from "@angular/forms";



export function oneCheckboxRequired(): ValidatorFn {
    return (control: AbstractControl) => {
        const formArray = control as FormArray;
        const hasChecked = formArray.controls.some(control => control.value === true);
        return hasChecked ? null : { requiredCheckbox: true };
    };
}