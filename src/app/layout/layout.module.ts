import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    TopbarComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
  ],
  exports: [
    LayoutComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }

