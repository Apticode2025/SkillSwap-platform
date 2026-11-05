import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student';

@Component({
selector: 'app-login',
standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
templateUrl: './login.html',
styleUrl: './login.css'
})
export class Login {

email = '';
password = '';
message = '';
errorMessage = '';
loading = false;

constructor(
private studentService: StudentService,
private router: Router
) {}

loginStudent(form: NgForm): void {
if (form.invalid || this.loading) {
return;
}


this.message = '';
this.errorMessage = '';
this.loading = true;

this.studentService.loginStudent({
  email: this.email,
  password: this.password
}).subscribe({
  next: (response) => {
    this.loading = false;
    this.message = 'Login successful!';

    // Save the logged-in student's basic details.
    localStorage.setItem(
      'currentStudent',
      JSON.stringify(response)
    );

    // Dashboard will be created in a later step.
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    this.loading = false;
    this.errorMessage =
      error.error?.message || 'Login failed. Please try again.';
  }
});

}
}
