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

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit, OnDestroy {

  notifications: Notification[] = [];

  studentId: number | null = null;

  loading = true;
  errorMessage = '';

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

    if (!this.isBrowser) {
      return;
    }

    const savedStudent = localStorage.getItem('currentStudent');

    if (!savedStudent) {
      this.router.navigate(['/login']);
      return;
    }

    try {

      const student = JSON.parse(savedStudent);

      if (!student.id) {
        this.router.navigate(['/login']);
        return;
      }

      this.studentId = Number(student.id);

      // Load notifications immediately after rendering.
      setTimeout(() => {

        this.loadNotifications();

        // Automatically check for new notifications every 10 seconds.
        this.refreshSubscription = interval(10000).subscribe(() => {
          this.loadNotifications(false);
        });

      }, 0);

    } catch (error) {

      console.error('Error reading student information:', error);
      this.router.navigate(['/login']);

    }
  }

  // Load notifications from the backend.
  loadNotifications(showLoading = true): void {

    if (!this.studentId) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    if (showLoading) {
      this.loading = true;
    }

    this.errorMessage = '';

    this.notificationService
      .getNotifications(this.studentId)
      .subscribe({

        next: (notifications: Notification[]) => {

          this.notifications = notifications;
          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error('Error loading notifications:', error);

          this.errorMessage =
            'Unable to load notifications. Please try again.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });
  }

  // Mark one notification as read.
  markAsRead(notification: Notification): void {

    if (!this.studentId || notification.read) {
      return;
    }

    this.notificationService
      .markAsRead(notification.id, this.studentId)
      .subscribe({

        next: (updatedNotification: Notification) => {

          notification.read = updatedNotification.read;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error marking notification as read:',
            error
          );

        }

      });
  }

  // Mark all notifications as read.
  markAllAsRead(): void {

    if (!this.studentId) {
      return;
    }

    this.notificationService
      .markAllAsRead(this.studentId)
      .subscribe({

        next: () => {

          this.notifications.forEach(notification => {
            notification.read = true;
          });

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error marking all notifications as read:',
            error
          );

        }

      });
  }

  // Navigate back to the dashboard.
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // Stop automatic checking when leaving the page.
  ngOnDestroy(): void {

    this.refreshSubscription?.unsubscribe();

  }

}
