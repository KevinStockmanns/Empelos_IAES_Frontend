import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private __notifications: WritableSignal<{title:string, desc:string, error:boolean, duration:number|null}[]> = signal([]);

  constructor() { }

  public notificate(title:string, desc:string, error=true, duration:number|null=null){
    const notification = {title, desc, error, duration};

    this.__notifications.update(current=>[...current, notification]);

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
}
