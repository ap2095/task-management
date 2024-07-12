import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: LayoutComponent, // Use LayoutComponent as the base component
    children: [
      { path: 'tasks', loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
        data: { breadcrumb: "" }, },
      { path: '', redirectTo: 'tasks/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
