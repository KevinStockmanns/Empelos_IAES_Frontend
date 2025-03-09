import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private __notifications: WritableSignal<{title:string, desc:string, error:boolean, duration:number|null, date:Date}[]> = signal([]);

  constructor() { }

  public notificate(title: string, desc: string, error = true, duration: number | null = null) {
    const notification = { title, desc, error, duration, date: new Date() };
  
    this.__notifications.update(current => {
      // Verifica si ya existe una notificación con el mismo título y descripción
      const exists = current.some(n => n.title === title && n.desc === desc);
      
      if (!exists) {
        return [...current, notification];
      }
      
      return current; // Si ya existe, no la agrega
    });
  
    if (duration !== null) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);
    }
  }
  


  public removeNotification(notification: { title: string, desc: string, error: boolean, duration: number | null }): void {
    this.__notifications.update((notifications) =>
      notifications.filter((n) => n !== notification)
    );
  }

  public getNotifications(){
    return this.__notifications.asReadonly();
  }


  public notificateErrorsResponse(err:any, message?:string){
    message = message ?  message : 'Ocurrio un error. Intentalo de nuevo más tarde.';
    if( (!err.message.includes('token') && !err.message.includes('Token') && !err.message.startsWith('Tu cuenta ha sido')) &&( err.errors && Object.keys(err.errors).length>0)){
      let duration = 6000;
      for( const [key, value] of Object.entries(err.errors)){
        if(Array.isArray(value)){
          value.forEach(el=>{
            if(!value.toLocaleString().toLocaleLowerCase().includes('token')){
              this.notificate('Error', el, true, duration);
              duration += 6000;
            }
          })
        }else{
          this.notificate('Error', value as string, true, duration);
        }
      }
    }else{
      if(!err.message.includes('token') && !err.message.includes('Token') && !err.message.startsWith('Tu cuenta ha sido')){
        this.notificate('Error', message)
      }
    }
  }
}
