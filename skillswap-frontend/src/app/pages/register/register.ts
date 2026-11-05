import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentService, Student } from '../../services/student';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  message = '';
  errorMessage = '';
  loading = false;

  student: Student = {
    name: '',
    email: '',
    password: '',
    department: '',
    college: ''
  };

  constructor(private studentService: StudentService) {}

  registerStudent(form: NgForm): void {

    // Prevent submission if the form is invalid or already submitting
    if (form.invalid || this.loading) {
      form.control.markAllAsTouched();
      return;
    }

    this.message = '';
    this.errorMessage = '';
    this.loading = true;

    // Remove accidental spaces from the name and email
    const studentData: Student = {
      ...this.student,
      name: this.student.name.trim(),
      email: this.student.email.trim(),
      department: this.student.department.trim(),
      college: this.student.college.trim()
    };

    this.studentService.registerStudent(studentData).subscribe({
      next: (response) => {
        this.message = response.message || 'Account created successfully!';
        this.errorMessage = '';
        this.loading = false;

        // Reset the form after successful registration
        form.resetForm({
          name: '',
          email: '',
          password: '',
          department: '',
          college: ''
        });

        this.student = {
          name: '',
          email: '',
          password: '',
          department: '',
          college: ''
        };
      },

      error: (error) => {
        console.error('Registration error:', error);

        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Registration failed. Please check whether the backend is running and try again.';

        this.loading = false;
      }
    });
  }
}
