package com.bookhub.bookhub_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import com.bookhub.bookhub_backend.entity.Book;
import com.bookhub.bookhub_backend.repository.BookRepository;

@RestController
@RequestMapping("/api/return")
public class ReturnController {

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/{bookId}")
    public ResponseEntity<String> returnBook(@PathVariable @NonNull Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        return ResponseEntity.ok("Book returned successfully!");
    }
}
