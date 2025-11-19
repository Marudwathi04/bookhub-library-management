package com.bookhub.bookhub_backend.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bookhub.bookhub_backend.dto.BookDto;
import com.bookhub.bookhub_backend.dto.CreateBookRequest;
import com.bookhub.bookhub_backend.entity.Book;
import com.bookhub.bookhub_backend.repository.BookRepository;
import com.bookhub.bookhub_backend.service.BookService;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository repo) {
        this.bookRepository = repo;
    }

    // Convert Entity -> DTO
    private BookDto mapToDto(Book b) {
        return BookDto.builder()
                .id(b.getId())
                .title(b.getTitle())
                .author(b.getAuthor())
                .category(b.getCategory())
                .totalCopies(b.getTotalCopies())
                .availableCopies(b.getAvailableCopies())
                .description(b.getDescription())
                .build();
    }

    @Override
    public BookDto createBook(CreateBookRequest request) {
        int total = request.getTotalCopies();
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .totalCopies(total)
                .availableCopies(total)
                .description(request.getDescription())
                .build();
        Book saved = bookRepository.save(book);
        return mapToDto(saved);
    }

    @Override
    public BookDto updateBook(Long id, CreateBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        // Update fields safely
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setDescription(request.getDescription());

        // totalCopies is a primitive now in DTO; update accordingly
        int reqTotal = request.getTotalCopies();
        int prevTotal = book.getTotalCopies();
        int diff = reqTotal - prevTotal;
        book.setTotalCopies(reqTotal);
        int prevAvailable = book.getAvailableCopies();
        int newAvailable = prevAvailable + diff;
        book.setAvailableCopies(Math.max(newAvailable, 0));

        Book saved = bookRepository.save(book);
        return mapToDto(saved);
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return mapToDto(book);
    }

    @Override
    public Page<BookDto> searchBooks(String q, Pageable pageable) {
        Page<Book> page;
        if (q == null || q.isBlank()) {
            page = bookRepository.findAll(pageable);
        } else {
            page = bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(q, q, pageable);
        }
        return page.map(this::mapToDto);
    }
}
