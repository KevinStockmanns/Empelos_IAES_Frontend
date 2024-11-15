import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsuarioService } from '../services/usuario-service.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let usuarioService = inject(UsuarioService);
  let token = usuarioService.getToken();

  if(token){

    const reqClone = req.clone({
      'headers': req.headers.set('Authorization', `Bearer ${token}`)
    })

    return next(reqClone).pipe(
      catchError(err=>{
        
        if(err.status==401){
          console.log(err.error.message);
          
        }
        return throwError(err)
      }),
    )
  }
  
  return next(req);
};
