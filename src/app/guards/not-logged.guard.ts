import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service.service';
import { NotificationService } from '../services/notification.service';

export const notLoggedGuard: CanActivateFn = (route, state) => {
  let usuarioService = inject(UsuarioService);
  let router = inject(Router);
  
  if(usuarioService.isLogged()){
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
