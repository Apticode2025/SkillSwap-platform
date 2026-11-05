package com.skillswap.skillswap_backend.controller;

import com.skillswap.skillswap_backend.dto.NotificationResponse;
import com.skillswap.skillswap_backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // 1. Get all notifications for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                notificationService.getNotifications(studentId));
    }

    // 2. Get unread notifications
    @GetMapping("/student/{studentId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(studentId));
    }

    // 3. Get unread notification count
    @GetMapping("/student/{studentId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long studentId) {

        long count = notificationService.getUnreadCount(studentId);

        return ResponseEntity.ok(Map.of("count", count));
    }

    // 4. Mark one notification as read
    @PutMapping("/{notificationId}/read/student/{studentId}")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long notificationId,
            @PathVariable Long studentId) {

        try {
            NotificationResponse notification =
                    notificationService.markAsRead(
                            notificationId, studentId);

            return ResponseEntity.ok(notification);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 5. Mark all notifications as read
    @PutMapping("/student/{studentId}/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @PathVariable Long studentId) {

        notificationService.markAllAsRead(studentId);

        return ResponseEntity.ok(
                Map.of("message", "All notifications marked as read."));
    }
}

