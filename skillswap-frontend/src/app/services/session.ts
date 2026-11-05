import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SkillSession {
  id?: number;
  requesterId: number;
  receiverId: number;
  skillName: string;
  sessionDateTime: string;
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private apiUrl = 'http://localhost:8080/api/sessions';

  constructor(private http: HttpClient) {}

  createSession(session: SkillSession): Observable<SkillSession> {
    return this.http.post<SkillSession>(this.apiUrl, session);
  }

  getStudentSessions(studentId: number): Observable<SkillSession[]> {
    return this.http.get<SkillSession[]>(
      `${this.apiUrl}/student/${studentId}`
    );
  }

  acceptSession(sessionId: number): Observable<SkillSession> {
    return this.http.put<SkillSession>(
      `${this.apiUrl}/${sessionId}/accept`, {}
    );
  }

  rejectSession(sessionId: number): Observable<SkillSession> {
    return this.http.put<SkillSession>(
      `${this.apiUrl}/${sessionId}/reject`, {}
    );
  }

  completeSession(sessionId: number): Observable<SkillSession> {
    return this.http.put<SkillSession>(
      `${this.apiUrl}/${sessionId}/complete`, {}
    );
  }

  cancelSession(sessionId: number): Observable<SkillSession> {
    return this.http.put<SkillSession>(
      `${this.apiUrl}/${sessionId}/cancel`, {}
    );
  }
}
