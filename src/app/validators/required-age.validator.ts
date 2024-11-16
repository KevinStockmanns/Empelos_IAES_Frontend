import { AbstractControl, ValidatorFn } from '@angular/forms';

export function requiredAge(requiredAge: number): ValidatorFn {
  return (control: AbstractControl) => {
    const inputDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > inputDate.getMonth() ||
      (today.getMonth() === inputDate.getMonth() &&
        today.getDate() >= inputDate.getDate());

    const calculatedAge = isBirthdayPassed ? age : age - 1;

    if (calculatedAge < requiredAge) {
      return {requiredAge: requiredAge};
    }
    return null;
  };
}
