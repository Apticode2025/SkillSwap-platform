import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService, Student } from '../../services/student';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {

  student: Student = {
    name: '',
    email: '',
    department: '',
    college: '',
    skillsToTeach: '',
    skillsToLearn: ''
  };

  loading = true;
  saving = false;
  message = '';
  errorMessage = '';

  private isBrowser: boolean;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {

    // Do not access browser storage during server rendering.
    if (!this.isBrowser) {
      return;
    }

    const savedStudent = localStorage.getItem('currentStudent');

    if (!savedStudent) {
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    let currentStudent: Student;

    try {
      currentStudent = JSON.parse(savedStudent);
    } catch {
      localStorage.removeItem('currentStudent');
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    if (!currentStudent.id) {
      this.errorMessage = 'Student ID not found. Please log in again.';
      this.loading = false;
      return;
    }

    this.studentService.getStudentProfile(currentStudent.id).subscribe({
      next: (data) => {
        this.student = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Profile loading error:', error);
        this.errorMessage = 'Unable to load your profile. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile(): void {

    if (!this.isBrowser) {
      return;
    }

    if (!this.student.id) {
      this.errorMessage = 'Student ID not found. Please log in again.';
      return;
    }

    this.saving = true;
    this.message = '';
    this.errorMessage = '';

    this.studentService.updateStudentProfile(this.student.id, {
      department: this.student.department,
      college: this.student.college,
      skillsToTeach: this.student.skillsToTeach || '',
      skillsToLearn: this.student.skillsToLearn || ''
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Profile update error:', error);
        this.errorMessage = 'Unable to update your profile.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}