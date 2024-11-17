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
    const reqClone = req.clone({
      'headers': req.headers.set('Authorization', `Bearer ${token}`)
    })

    return next(reqClone).pipe(
      catchError(err=>{
        
        if(err.status==401){
          console.log(err.error.message);
          notificationService.notificate('Error', err.error.message, true, null);
        }
        return throwError(err)
      }),
    )
  }
  
  return next(req);
};
