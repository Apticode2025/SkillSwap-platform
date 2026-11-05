import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';

import { SessionService } from '../../services/session';
import type { SkillSession } from '../../services/session';

import { StudentService } from '../../services/student';
import type { Student } from '../../services/student';

interface CurrentStudent {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './sessions.html',
  styleUrl: './sessions.css'
})
export class Sessions implements OnInit {

  currentStudent: CurrentStudent | null = null;

  sessions: SkillSession[] = [];
  students: Student[] = [];

  loading = false;
  submitting = false;

  errorMessage = '';
  successMessage = '';

  receiverId: number | null = null;
  skillName = '';
  sessionDateTime = '';
  message = '';

  // Minimum date and time allowed in the date/time input.
  minDateTime = '';

  private isBrowser: boolean;

  constructor(
    private sessionService: SessionService,
    private studentService: StudentService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

    console.log('SESSIONS COMPONENT INITIALIZED');

    // Set the minimum date and time.
    this.minDateTime = this.getCurrentDateTime();

    if (!this.isBrowser) {
      return;
    }

    const savedStudent = localStorage.getItem('currentStudent');

    if (!savedStudent) {
      this.router.navigate(['/login']);
      return;
    }

    try {

      this.currentStudent = JSON.parse(
        savedStudent
      ) as CurrentStudent;

      if (!this.currentStudent?.id) {
        this.router.navigate(['/login']);
        return;
      }

      this.loadStudents();
      this.loadSessions();

    } catch (error) {

      console.error(
        'Error reading student information:',
        error
      );

      this.router.navigate(['/login']);
    }
  }

  // Get the current local date and time in datetime-local format.
  private getCurrentDateTime(): string {

    const now = new Date();

    const localTime = new Date(
      now.getTime() -
      now.getTimezoneOffset() * 60000
    );

    return localTime.toISOString().slice(0, 16);
  }

  // Load all registered students.
  loadStudents(): void {

    this.studentService.getAllStudents().subscribe({

      next: (data: Student[]) => {

        this.students = data;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {

        console.error(
          'Failed to load students:',
          error
        );

        this.errorMessage =
          'Unable to load students. Please check your backend server.';
      }
    });
  }

  // Load sessions belonging to the logged-in student.
  loadSessions(): void {

    console.log(
      'Loading sessions for student:',
      this.currentStudent?.id
    );

    if (!this.currentStudent?.id) {

      console.error('Student ID is missing!');

      this.loading = false;

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.sessionService
      .getStudentSessions(this.currentStudent.id)
      .subscribe({

        next: (data: SkillSession[]) => {

          console.log('Sessions received:', data);

          this.sessions = data;

          this.loading = false;

          this.cdr.detectChanges();

          console.log(
            'Total sessions:',
            this.sessions.length
          );
        },

        error: (error: unknown) => {

          console.error(
            'Failed to load sessions:',
            error
          );

          this.sessions = [];

          this.loading = false;

          this.errorMessage =
            'Unable to load sessions. Please check your backend server.';
        }
      });
  }

  // Create a new session request.
  createSession(): void {

    if (!this.currentStudent?.id) {

      this.router.navigate(['/login']);

      return;
    }

    if (
      this.receiverId === null ||
      this.receiverId <= 0 ||
      !this.skillName.trim() ||
      !this.sessionDateTime
    ) {

      this.errorMessage =
        'Please complete all required fields.';

      this.successMessage = '';

      return;
    }

    if (
      Number(this.receiverId) ===
      Number(this.currentStudent.id)
    ) {

      this.errorMessage =
        'You cannot request a session with yourself.';

      this.successMessage = '';

      return;
    }

    const selectedDateTime = new Date(
      this.sessionDateTime
    ).getTime();

    if (
      !Number.isFinite(selectedDateTime) ||
      selectedDateTime <= Date.now()
    ) {

      this.errorMessage =
        'Please select a valid future date and time.';

      this.successMessage = '';

      return;
    }

    this.submitting = true;

    this.errorMessage = '';
    this.successMessage = '';

    const newSession: SkillSession = {

      requesterId: Number(this.currentStudent.id),

      receiverId: Number(this.receiverId),

      skillName: this.skillName.trim(),

      sessionDateTime: this.sessionDateTime,

      message: this.message.trim(),

      status: 'PENDING'
    };

    this.sessionService
      .createSession(newSession)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Session request sent successfully!';

          this.errorMessage = '';

          this.receiverId = null;
          this.skillName = '';
          this.sessionDateTime = '';
          this.message = '';

          // Update the minimum date/time after submission.
          this.minDateTime = this.getCurrentDateTime();

          this.loadSessions();
        },

        error: (
          error: { error?: { message?: string } }
        ) => {

          console.error(
            'Failed to create session:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to send the session request.';
        }
      });
  }

  // Accept a received request.
  acceptSession(sessionId: number): void {

    this.updateSessionStatus(
      this.sessionService.acceptSession(sessionId),
      'Session request accepted successfully.'
    );
  }

  // Reject a received request.
  rejectSession(sessionId: number): void {

    this.updateSessionStatus(
      this.sessionService.rejectSession(sessionId),
      'Session request rejected.'
    );
  }

  // Mark an accepted session as completed.
  completeSession(sessionId: number): void {

    this.updateSessionStatus(
      this.sessionService.completeSession(sessionId),
      'Session marked as completed.'
    );
  }

  // Cancel a pending or accepted session.
  cancelSession(sessionId: number): void {

    this.updateSessionStatus(
      this.sessionService.cancelSession(sessionId),
      'Session cancelled successfully.'
    );
  }

  // Handle session status updates.
  private updateSessionStatus(
    request: Observable<SkillSession>,
    successText: string
  ): void {

    this.errorMessage = '';
    this.successMessage = '';

    request.subscribe({

      next: () => {

        this.successMessage = successText;

        this.loadSessions();
      },

      error: (
        error: { error?: { message?: string } }
      ) => {

        console.error(
          'Failed to update session:',
          error
        );

        this.errorMessage =
          error.error?.message ||
          'Unable to update the session.';
      }
    });
  }

  // Get a student's name using their ID.
  getStudentName(studentId: number): string {

    const student = this.students.find(
      student =>
        Number(student.id) === Number(studentId)
    );

    return student?.name || `Student ${studentId}`;
  }

  // Identify sent and received requests.
  getSessionType(session: SkillSession): string {

    if (!this.currentStudent) {
      return '';
    }

    return Number(session.requesterId) ===
      Number(this.currentStudent.id)
      ? 'Request Sent'
      : 'Request Received';
  }

  // Navigate to the dashboard.
  goToDashboard(): void {

    this.router.navigate(['/dashboard']);
  }

  // Log out.
  logout(): void {

    if (this.isBrowser) {
      localStorage.removeItem('currentStudent');
    }

    this.router.navigate(['/login']);
  }
isCurrentStudent(studentId: number | string | undefined | null): boolean {
  return (
    studentId != null &&
    this.currentStudent?.id != null &&
    String(studentId) === String(this.currentStudent.id)
  );
}

}