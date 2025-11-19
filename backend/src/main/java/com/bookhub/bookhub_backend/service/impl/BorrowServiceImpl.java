package com.bookhub.bookhub_backend.service.impl;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bookhub.bookhub_backend.dto.BorrowResponseDto;
import com.bookhub.bookhub_backend.entity.BorrowRecord;
import com.bookhub.bookhub_backend.entity.Book;
import com.bookhub.bookhub_backend.model.User;
import com.bookhub.bookhub_backend.repository.BorrowRecordRepository;
import com.bookhub.bookhub_backend.repository.BookRepository;
import com.bookhub.bookhub_backend.repository.UserRepository;
import com.bookhub.bookhub_backend.service.BorrowService;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordRepository borrowRepo;
    private final BookRepository bookRepo;
    private final UserRepository userRepo;

    public BorrowServiceImpl(BorrowRecordRepository borrowRepo,
                             BookRepository bookRepo,
                             UserRepository userRepo) {
        this.borrowRepo = borrowRepo;
        this.bookRepo = bookRepo;
        this.userRepo = userRepo;
    }

    private BorrowResponseDto toDto(BorrowRecord r) {
        return BorrowResponseDto.builder()
                .borrowId(r.getId())
                .bookId(r.getBook().getId())
                .bookTitle(r.getBook().getTitle())
                .borrowedAt(r.getBorrowedAt())
                .returnedAt(r.getReturnedAt())
                .status(r.getStatus())
                .build();
    }

    @Override
    @Transactional
    public BorrowResponseDto borrowBook(String userEmail, Long bookId) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        int avail = book.getAvailableCopies();
        if (avail <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No copies available");
        }

        boolean already = borrowRepo.existsByUserIdAndBookIdAndStatus(user.getId(), bookId, "BORROWED");
        if (already) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You already borrowed this book");
        }

        BorrowRecord rec = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowedAt(OffsetDateTime.now())
                .status("BORROWED")
                .build();

        book.setAvailableCopies(avail - 1);
        bookRepo.save(book);

        BorrowRecord saved = borrowRepo.save(rec);
        return toDto(saved);
    }

    @Override
    @Transactional
    public BorrowResponseDto returnBook(String userEmail, Long borrowId) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        BorrowRecord rec = borrowRepo.findById(borrowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Borrow record not found"));

        if (!rec.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to return this record");
        }

        if ("RETURNED".equals(rec.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already returned");
        }

        rec.setReturnedAt(OffsetDateTime.now());
        rec.setStatus("RETURNED");
        borrowRepo.save(rec);

    Book book = rec.getBook();
    int availNow = book.getAvailableCopies();
    book.setAvailableCopies(availNow + 1);
        bookRepo.save(book);

        return toDto(rec);
    }

    @Override
    public List<BorrowResponseDto> getUserBorrowHistory(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return borrowRepo.findByUserIdOrderByBorrowedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
