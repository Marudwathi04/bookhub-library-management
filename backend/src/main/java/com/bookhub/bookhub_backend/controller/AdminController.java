package com.bookhub.bookhub_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookhub.bookhub_backend.entity.Book;
import com.bookhub.bookhub_backend.repository.BookRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @PostMapping("/books")
    public ResponseEntity<String> addBook(@RequestBody @NonNull Book book) {
        bookRepository.save(book);
        return ResponseEntity.ok("Book added successfully!");
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<String> updateBook(@PathVariable @NonNull Long id, @RequestBody @NonNull Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setCategory(bookDetails.getCategory());
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        bookRepository.save(book);
        return ResponseEntity.ok("Book updated successfully!");
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable @NonNull Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
        return ResponseEntity.ok("Book deleted successfully!");
    }
}
