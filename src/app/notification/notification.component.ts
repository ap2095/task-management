import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: string[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false; // Track whether the tray is open or not

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getTrayOpenState().subscribe(state => {
      this.isOpen = state;
      console.log(this.isOpen)
    });
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      console.log(this.notifications)
    });
    this.unreadCount = this.notificationService.getUnreadCount();
  }

  markAsRead() {
    this.notificationService.resetUnreadCount();
    this.unreadCount = 0;
  }

  toggleTray() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.markAsRead();
    }
  }
}

