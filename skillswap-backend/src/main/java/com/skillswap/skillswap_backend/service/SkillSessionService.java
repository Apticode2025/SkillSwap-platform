package com.skillswap.skillswap_backend.service;

import com.skillswap.skillswap_backend.entity.SkillSession;
import com.skillswap.skillswap_backend.repository.SkillSessionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillSessionService {

    private final SkillSessionRepository sessionRepository;
    private final NotificationService notificationService;

    public SkillSessionService(
            SkillSessionRepository sessionRepository,
            NotificationService notificationService) {
        this.sessionRepository = sessionRepository;
        this.notificationService = notificationService;
    }

    // 1. Create a session request
    public SkillSession createSession(SkillSession session) {

        if (session.getRequesterId() == null ||
                session.getReceiverId() == null) {
            throw new IllegalArgumentException(
                    "Requester ID and Receiver ID are required.");
        }

        if (session.getRequesterId().equals(session.getReceiverId())) {
            throw new IllegalArgumentException(
                    "You cannot request a session with yourself.");
        }

        if (session.getSkillName() == null ||
                session.getSkillName().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Skill name is required.");
        }

        session.setStatus("PENDING");

        SkillSession savedSession = sessionRepository.save(session);

        // Notify the student receiving the request
        notificationService.createNotification(
                savedSession.getReceiverId(),
                savedSession.getRequesterId(),
                savedSession.getId(),
                "You received a session request for "
                        + savedSession.getSkillName() + ".",
                "SESSION_REQUEST"
        );

        return savedSession;
    }

    // 2. Get sessions sent and received by a student
    public List<SkillSession> getStudentSessions(Long studentId) {

        List<SkillSession> sessions = new ArrayList<>();

        sessions.addAll(
                sessionRepository.findByRequesterId(studentId));

        for (SkillSession session :
                sessionRepository.findByReceiverId(studentId)) {

            boolean alreadyAdded = sessions.stream()
                    .anyMatch(existing ->
                            existing.getId().equals(session.getId()));

            if (!alreadyAdded) {
                sessions.add(session);
            }
        }

        return sessions;
    }

    // 3. Accept a session request
    public SkillSession acceptSession(Long sessionId) {

        SkillSession session = findSession(sessionId);

        if (!"PENDING".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Only pending sessions can be accepted.");
        }

        session.setStatus("ACCEPTED");

        SkillSession savedSession = sessionRepository.save(session);

        // Notify the student who sent the request
        notificationService.createNotification(
                savedSession.getRequesterId(),
                savedSession.getReceiverId(),
                savedSession.getId(),
                "Your session request for "
                        + savedSession.getSkillName() + " was accepted.",
                "SESSION_ACCEPTED"
        );

        return savedSession;
    }

    // 4. Reject a session request
    public SkillSession rejectSession(Long sessionId) {

        SkillSession session = findSession(sessionId);

        if (!"PENDING".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Only pending sessions can be rejected.");
        }

        session.setStatus("REJECTED");

        SkillSession savedSession = sessionRepository.save(session);

        // Notify the student who sent the request
        notificationService.createNotification(
                savedSession.getRequesterId(),
                savedSession.getReceiverId(),
                savedSession.getId(),
                "Your session request for "
                        + savedSession.getSkillName() + " was rejected.",
                "SESSION_REJECTED"
        );

        return savedSession;
    }

    // 5. Complete an accepted session
    public SkillSession completeSession(Long sessionId) {

        SkillSession session = findSession(sessionId);

        if (!"ACCEPTED".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Only accepted sessions can be completed.");
        }

        session.setStatus("COMPLETED");

        SkillSession savedSession = sessionRepository.save(session);

        // Notify both students that the session is completed
        notificationService.createNotification(
                savedSession.getRequesterId(),
                savedSession.getReceiverId(),
                savedSession.getId(),
                "The session for "
                        + savedSession.getSkillName() + " has been completed.",
                "SESSION_COMPLETED"
        );

        notificationService.createNotification(
                savedSession.getReceiverId(),
                savedSession.getRequesterId(),
                savedSession.getId(),
                "The session for "
                        + savedSession.getSkillName() + " has been completed.",
                "SESSION_COMPLETED"
        );

        return savedSession;
    }

    // 6. Cancel a session
    public SkillSession cancelSession(Long sessionId) {

        SkillSession session = findSession(sessionId);

        if (!"PENDING".equals(session.getStatus()) &&
                !"ACCEPTED".equals(session.getStatus())) {
            throw new IllegalStateException(
                    "Only pending or accepted sessions can be cancelled.");
        }

        session.setStatus("CANCELLED");

        SkillSession savedSession = sessionRepository.save(session);

        // Notify both students that the session is cancelled
        notificationService.createNotification(
                savedSession.getRequesterId(),
                savedSession.getReceiverId(),
                savedSession.getId(),
                "The session for "
                        + savedSession.getSkillName() + " has been cancelled.",
                "SESSION_CANCELLED"
        );

        notificationService.createNotification(
                savedSession.getReceiverId(),
                savedSession.getRequesterId(),
                savedSession.getId(),
                "The session for "
                        + savedSession.getSkillName() + " has been cancelled.",
                "SESSION_CANCELLED"
        );

        return savedSession;
    }

    // 7. Find a session using its ID
    private SkillSession findSession(Long sessionId) {

        return sessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Session not found with ID: " + sessionId));
    }
}
