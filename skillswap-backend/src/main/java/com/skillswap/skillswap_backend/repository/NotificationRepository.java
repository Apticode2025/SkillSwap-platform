 package com.skillswap.skillswap_backend.repository;

import com.skillswap.skillswap_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Find all notifications received by a student
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(
            Long recipientId);

    // Find unread notifications received by a student
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(
            Long recipientId);

    // Count unread notifications
    long countByRecipientIdAndIsReadFalse(Long recipientId);
}
