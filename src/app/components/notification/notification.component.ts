import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification',
  standalone: true,
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

    this.notificationService.notificate('Prueba', 'descPrueba', true, 10000)
    this.notificationService.notificate('Prueba 2', 'descPrueba', false, 10000)
    this.notificationService.notificate('Prueba 5', 'descPrueba', false)
  }

  closeNotification(not:any){
    this.notificationService.removeNotification(not);
  }

  getDurationPercentage(duration: number, createdAt: number): number {
    const elapsedTime = Date.now() - createdAt;
    const percentage = (elapsedTime / duration) * 100;
    return Math.min(100, percentage);
}
}
