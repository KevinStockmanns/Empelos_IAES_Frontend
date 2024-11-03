import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  return true;
  let userService = inject(UsuarioService);
  let router = inject(Router);

  if(!userService.isLogged()){
    router.navigate(['/login']);
    return false;
  }
  return true;
};
