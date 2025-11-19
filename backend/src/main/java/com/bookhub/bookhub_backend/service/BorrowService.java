package com.bookhub.bookhub_backend.service;

import java.util.List;

import com.bookhub.bookhub_backend.dto.BorrowResponseDto;

public interface BorrowService {
    BorrowResponseDto borrowBook(String userEmail, Long bookId);
    BorrowResponseDto returnBook(String userEmail, Long borrowId);
    List<BorrowResponseDto> getUserBorrowHistory(String userEmail);
}
