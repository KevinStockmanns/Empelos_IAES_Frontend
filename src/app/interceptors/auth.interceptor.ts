import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsuarioService } from '../services/usuario-service.service';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let usuarioService = inject(UsuarioService);
  let token = usuarioService.getToken();

  if(token){
    let notificationService = inject(NotificationService);
    let usuarioService = inject(UsuarioService);
    const reqClone = req.clone({
      'headers': req.headers.set('Authorization', `Bearer ${token}`)
    })

    return next(reqClone).pipe(
      catchError(err=>{
        if(err.error.message.startsWith('Tu cuenta ha sido')){
          usuarioService.logout()
          notificationService.notificate('Error', err.error.message, true, null);
          
        }
        
        if(err.status==401 && err.error.message.toLowerCase().includes('token')){
          usuarioService.logout();
          notificationService.notificate('Error', err.error.message + '. Debes iniciar sesión.', true, null);
        }
        return throwError(err)
      }),
    )
  }
  
  return next(req);
};
