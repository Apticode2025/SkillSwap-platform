import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  name: string;
  email: string;
  password?: string;
  department: string;
  college: string;
  skillsToTeach?: string;
  skillsToLearn?: string;
}

@Injectable({
providedIn: 'root'
})
export class StudentService {

private apiUrl = 'http://localhost:8080/api/students';

constructor(private http: HttpClient) {}

registerStudent(student: Student): Observable<{ message: string }> {
return this.http.post<{ message: string }>(
`${this.apiUrl}/register`,
student
);
}
loginStudent(credentials: {
  email: string;
  password: string;
}) {
  return this.http.post<{
    message: string;
    id: number;
    name: string;
    email: string;
    department: string;
    college: string;
  }>(
    `${this.apiUrl}/login`,
    credentials
  );
}
getStudentProfile(id: number) {
  return this.http.get<Student>(
    `${this.apiUrl}/${id}`
  );
}

updateStudentProfile(
  id: number,
  profile: {
    department: string;
    college: string;
    skillsToTeach: string;
    skillsToLearn: string;
  }
) {
  return this.http.put<{ message: string }>(
    `${this.apiUrl}/${id}/profile`,
    profile
  );
}

getAllStudents(): Observable<Student[]> {
  return this.http.get<Student[]>(
    `${this.apiUrl}/all`
  );
}

}
