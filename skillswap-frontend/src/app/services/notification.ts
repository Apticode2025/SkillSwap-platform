import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  recipientId: number;
  senderId: number;
  senderName: string;
  sessionId: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(studentId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  getUnreadCount(studentId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/student/${studentId}/unread-count`
    );
  }

  markAsRead(notificationId: number, studentId: number): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.apiUrl}/${notificationId}/read/student/${studentId}`,
      {}
    );
  }

  markAllAsRead(studentId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/student/${studentId}/read-all`,
      {}
    );
  }
}
