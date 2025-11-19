package com.bookhub.bookhub_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookhub.bookhub_backend.dto.BorrowResponseDto;
import com.bookhub.bookhub_backend.service.BorrowService;

@RestController
@RequestMapping("/api")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping("/borrow/{bookId}")
    public ResponseEntity<BorrowResponseDto> borrowBook(@PathVariable Long bookId,
                                                        Authentication authentication) {
        String email = authentication.getName();
        BorrowResponseDto dto = borrowService.borrowBook(email, bookId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/return/{borrowId}")
    public ResponseEntity<BorrowResponseDto> returnBook(@PathVariable Long borrowId,
                                                        Authentication authentication) {
        String email = authentication.getName();
        BorrowResponseDto dto = borrowService.returnBook(email, borrowId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/borrow/history")
    public ResponseEntity<List<BorrowResponseDto>> history(Authentication authentication) {
        String email = authentication.getName();
        List<BorrowResponseDto> list = borrowService.getUserBorrowHistory(email);
        return ResponseEntity.ok(list);
    }
}
