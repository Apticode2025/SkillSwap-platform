package com.skillswap.skillswap_backend.repository;

import com.skillswap.skillswap_backend.entity.SkillSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillSessionRepository
        extends JpaRepository<SkillSession, Long> {

    List<SkillSession> findByRequesterId(Long requesterId);

    List<SkillSession> findByReceiverId(Long receiverId);
}
