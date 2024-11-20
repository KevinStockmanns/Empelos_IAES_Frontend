import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service.service';
import { NotificationService } from '../services/notification.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsuarioService);
  let noti = inject(NotificationService);

  if(userService.isLogged()){
    return true;
  }
  noti.notificate('Error', 'Para acceder debes iniciar sesión', true, 7000);
  return false;
};
