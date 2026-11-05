import { Routes } from '@angular/router';

import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MyProfile } from './pages/my-profile/my-profile';
import { FindStudents } from './pages/find-students/find-students';
import { Sessions } from './pages/sessions/sessions';
import { Notifications } from './pages/notifications/notifications';

export const routes: Routes = [
  {
    path: 'register',
    component: Register
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'my-profile',
    component: MyProfile
  },
  {
    path: 'find-students',
    component: FindStudents
  },
  {
    path: 'sessions',
    component: Sessions
  },
  {
    path: 'notifications',
    component: Notifications
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'register'
  },
];
