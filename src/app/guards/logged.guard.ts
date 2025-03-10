import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service.service';
import { NotificationService } from '../services/notification.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  let userService = inject(UsuarioService);
  let noti = inject(NotificationService);
  let router = inject(Router)

  if(userService.isLogged()){
    if(userService.getUsuario()?.estado == 'SOLICITADO' && state.url !='/wait'){
      router.navigate(['/wait']);
    }
    return true;
  }
  noti.notificate('Error', 'Para acceder debes iniciar sesión', true, 7000);
  return false;
};
