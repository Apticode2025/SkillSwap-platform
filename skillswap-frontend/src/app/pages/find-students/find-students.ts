import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService, Student } from '../../services/student';

@Component({
  selector: 'app-find-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './find-students.html',
  styleUrl: './find-students.css'
})
export class FindStudents implements OnInit {

  students: Student[] = [];
  filteredStudents: Student[] = [];

  searchText = '';
  loading = true;
  errorMessage = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = [...data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.errorMessage =
          'Unable to load students. Please check whether the backend is running.';
        this.loading = false;
      }
    });
  }

  searchStudents(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredStudents = this.students.filter(student =>
      (student.name || '').toLowerCase().includes(search) ||
      (student.department || '').toLowerCase().includes(search) ||
      (student.college || '').toLowerCase().includes(search) ||
      (student.skillsToTeach || '').toLowerCase().includes(search) ||
      (student.skillsToLearn || '').toLowerCase().includes(search)
    );
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}