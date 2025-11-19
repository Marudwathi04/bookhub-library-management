package com.bookhub.bookhub_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookhub.bookhub_backend.entity.BorrowRecord;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserIdOrderByBorrowedAtDesc(Long userId);
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, String status);
}
