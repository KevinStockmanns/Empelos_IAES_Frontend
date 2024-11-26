import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-notification',
    imports: [MatIconModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent {

  notifications;

  constructor(
    private notificationService: NotificationService
  ){
    this.notifications = notificationService.getNotifications();
  }

  closeNotification(not:any){
    this.notificationService.removeNotification(not);
  }
}
