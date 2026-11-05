package com.skillswap.skillswap_backend.controller;

import com.skillswap.skillswap_backend.entity.SkillSession;
import com.skillswap.skillswap_backend.service.SkillSessionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:4200")
public class SkillSessionController {

    private final SkillSessionService sessionService;

    public SkillSessionController(
            SkillSessionService sessionService) {
        this.sessionService = sessionService;
    }

    // 1. Create a session request
    @PostMapping
    public ResponseEntity<?> createSession(
            @RequestBody SkillSession session) {
        try {
            SkillSession savedSession =
                    sessionService.createSession(session);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedSession);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 2. Get sent and received sessions for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SkillSession>> getStudentSessions(
            @PathVariable Long studentId) {

        List<SkillSession> sessions =
                sessionService.getStudentSessions(studentId);

        return ResponseEntity.ok(sessions);
    }

    // 3. Accept a session request
    @PutMapping("/{sessionId}/accept")
    public ResponseEntity<?> acceptSession(
            @PathVariable Long sessionId) {
        try {
            SkillSession session =
                    sessionService.acceptSession(sessionId);

            return ResponseEntity.ok(session);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 4. Reject a session request
    @PutMapping("/{sessionId}/reject")
    public ResponseEntity<?> rejectSession(
            @PathVariable Long sessionId) {
        try {
            SkillSession session =
                    sessionService.rejectSession(sessionId);

            return ResponseEntity.ok(session);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 5. Mark an accepted session as completed
    @PutMapping("/{sessionId}/complete")
    public ResponseEntity<?> completeSession(
            @PathVariable Long sessionId) {
        try {
            SkillSession session =
                    sessionService.completeSession(sessionId);

            return ResponseEntity.ok(session);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 6. Cancel a pending or accepted session
    @PutMapping("/{sessionId}/cancel")
    public ResponseEntity<?> cancelSession(
            @PathVariable Long sessionId) {
        try {
            SkillSession session =
                    sessionService.cancelSession(sessionId);

            return ResponseEntity.ok(session);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
