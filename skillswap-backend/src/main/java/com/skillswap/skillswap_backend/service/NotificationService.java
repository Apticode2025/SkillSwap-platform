package com.skillswap.skillswap_backend.service;

import com.skillswap.skillswap_backend.dto.NotificationResponse;
import com.skillswap.skillswap_backend.entity.Notification;
import com.skillswap.skillswap_backend.entity.Student;
import com.skillswap.skillswap_backend.repository.NotificationRepository;
import com.skillswap.skillswap_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            StudentRepository studentRepository) {
        this.notificationRepository = notificationRepository;
        this.studentRepository = studentRepository;
    }

    // 1. Create and save a notification
    public Notification createNotification(
            Long recipientId,
            Long senderId,
            Long sessionId,
            String message,
            String type) {

        Notification notification = new Notification();

        notification.setRecipientId(recipientId);
        notification.setSenderId(senderId);
        notification.setSessionId(sessionId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    // Convert a Notification entity into a response containing the sender's name
    private NotificationResponse toResponse(Notification notification) {

        String senderName = "Unknown student";

        if (notification.getSenderId() != null) {
            senderName = studentRepository
                    .findById(notification.getSenderId())
                    .map(Student::getName)
                    .orElse("Unknown student");
        }

        return new NotificationResponse(
                notification.getId(),
                notification.getRecipientId(),
                notification.getSenderId(),
                senderName,
                notification.getSessionId(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }

    // 2. Get all notifications for a student, including sender names
    public List<NotificationResponse> getNotifications(Long studentId) {
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 3. Get unread notifications
    public List<NotificationResponse> getUnreadNotifications(Long studentId) {
        return notificationRepository
                .findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 4. Count unread notifications
    public long getUnreadCount(Long studentId) {
        return notificationRepository
                .countByRecipientIdAndIsReadFalse(studentId);
    }

    // 5. Mark a notification as read
    public NotificationResponse markAsRead(
            Long notificationId,
            Long studentId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Notification not found."));

        if (notification.getRecipientId() == null ||
                !notification.getRecipientId().equals(studentId)) {
            throw new IllegalArgumentException(
                    "You cannot access this notification.");
        }

        notification.setRead(true);

        Notification savedNotification =
                notificationRepository.save(notification);

        return toResponse(savedNotification);
    }

    // 6. Mark all notifications as read
    public void markAllAsRead(Long studentId) {

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(
                                studentId);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }
}
