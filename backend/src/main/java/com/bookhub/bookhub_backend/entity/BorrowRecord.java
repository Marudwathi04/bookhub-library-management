package com.bookhub.bookhub_backend.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "borrow_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ FetchType.EAGER use cheyyi to avoid LazyInitializationException
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private com.bookhub.bookhub_backend.model.User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private com.bookhub.bookhub_backend.entity.Book book;

    @Column(name = "borrowed_at", nullable = false)
    private OffsetDateTime borrowedAt;

    @Column(name = "returned_at")
    private OffsetDateTime returnedAt;

    @Column(nullable = false)
    private String status; // "BORROWED" or "RETURNED"
}
