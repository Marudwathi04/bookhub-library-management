package com.bookhub.bookhub_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bookhub.bookhub_backend.dto.BookDto;
import com.bookhub.bookhub_backend.dto.CreateBookRequest;

public interface BookService {
    BookDto createBook(CreateBookRequest request);
    BookDto updateBook(Long id, CreateBookRequest request);
    void deleteBook(Long id);
    BookDto getBookById(Long id);
    Page<BookDto> searchBooks(String q, Pageable pageable);
}
