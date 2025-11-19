package com.bookhub.bookhub_backend.dto;

import java.time.OffsetDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowResponseDto {
    private Long borrowId;
    private Long bookId;
    private String bookTitle;
    private OffsetDateTime borrowedAt;
    private OffsetDateTime returnedAt;
    private String status;
}
