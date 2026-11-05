import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { NotificationService } from '../../services/notification';
import { Notification } from '../../services/notification';

interface Student {
  id?: number;
  name: string;
  email: string;
  department: string;
  college: string;
  skillsToTeach?: string;
  skillsToLearn?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  student: Student = {
    name: '',
    email: '',
    department: '',
    college: '',
    skillsToTeach: '',
    skillsToLearn: ''
  };

  unreadCount = 0;
  notifications: Notification[] = [];

  private isBrowser = false;
  private refreshSubscription?: Subscription;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

    // Prevent localStorage access during server-side rendering.
    if (!this.isBrowser) {
      return;
    }

    const savedStudent = localStorage.getItem('currentStudent');

    // Redirect to login if no student is logged in.
    if (!savedStudent) {
      this.router.navigate(['/login']);
      return;
    }

    try {

      const currentStudent: Student = JSON.parse(savedStudent);

      // Check whether the student information is valid.
      if (!currentStudent.id || !currentStudent.name) {
        localStorage.removeItem('currentStudent');
        this.router.navigate(['/login']);
        return;
      }

      this.student = currentStudent;

      // Load notifications immediately.
      this.loadNotifications();

      // Automatically refresh the unread count every 10 seconds.
      this.refreshSubscription = interval(10000).subscribe(() => {
        this.loadNotifications(false);
      });

    } catch (error) {

      console.error('Error reading student information:', error);

      localStorage.removeItem('currentStudent');
      this.router.navigate(['/login']);

    }
  }

  // Load notifications and calculate the unread count.
  loadNotifications(showErrors = true): void {

    if (!this.student.id) {
      return;
    }

    this.notificationService
      .getNotifications(this.student.id)
      .subscribe({

        next: (notifications: Notification[]) => {

          this.notifications = notifications;

          this.unreadCount = notifications.filter(
            notification => !notification.read
          ).length;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error('Error loading notifications:', error);

          if (showErrors) {
            console.warn('The unread notification count could not be refreshed.');
          }

        }

      });
  }

  // Open the notifications page.
  openNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  // Navigate to a selected dashboard feature.
  openPage(path: string): void {
    this.router.navigate([path]);
  }

  // Log out the current student.
  logout(): void {

    if (!this.isBrowser) {
      return;
    }

    // Stop background polling before logging out.
    this.refreshSubscription?.unsubscribe();

    localStorage.removeItem('currentStudent');

    this.router.navigate(['/login']);
  }

  // Stop polling when the dashboard component is destroyed.
  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

}
