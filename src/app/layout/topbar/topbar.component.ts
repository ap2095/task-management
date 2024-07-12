import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from './../../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private notificationservice: NotificationService,
  ) { }
  ngOnInit(): void {
    this.notificationservice.getNotifications().subscribe(notifications => {
      this.notificationCount = notifications.length;
      console.log(notifications.length)
    })
  }
  notificationCount = 0;  // Replace with actual notification count logic
  isTrayOpen = false;

  toggleNotificationTray() {
    this.isTrayOpen = !this.isTrayOpen;
    this.notificationservice.setOpenStatus(this.isTrayOpen)
    if (this.isTrayOpen) {
      this.notificationCount = 0;
    } else {
      this.notificationservice.resetNotifications();
    }
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.snackBar.open('Logged Out Successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.authService.logout();
      }
    });
  }

}
