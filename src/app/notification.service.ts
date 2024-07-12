import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];
  private isOpen: boolean = false;
  private notificationSubject = new BehaviorSubject<string[]>(this.notifications);
  private isOpenSubject = new BehaviorSubject<boolean>(this.isOpen);
  private unreadCount: number = 0;

  getNotifications(): Observable<string[]> {
    return this.notificationSubject.asObservable();
  }
  resetNotifications(): Observable<string[]> {
    this.notifications = [];
    this.unreadCount = 0;
    this.notificationSubject.next([]);
    return this.notificationSubject.asObservable();
  }

  setOpenStatus(status: boolean){
    this.isOpenSubject.next(status)
  }

  getTrayOpenState() {
    return this.isOpenSubject.asObservable();
  }

  getUnreadCount() {
    return this.unreadCount;
  }

  addNotification(message: string) {
    this.notifications.push(message);
    this.unreadCount++;
    this.notificationSubject.next(this.notifications.slice());
  }

  resetUnreadCount() {
    this.unreadCount = 0;
  }
}
