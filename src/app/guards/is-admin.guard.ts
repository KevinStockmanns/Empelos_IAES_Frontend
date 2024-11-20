import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario-service.service';
import { NotificationService } from '../services/notification.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  let usuarioService = inject(UsuarioService);
  let noti = inject(NotificationService);
  
  if(usuarioService.isAdmin()){
    return true;
  }

  noti.notificate('Error', 'No tienes los permisos necesarios para acceder', true, 10000);
  return false;
};
