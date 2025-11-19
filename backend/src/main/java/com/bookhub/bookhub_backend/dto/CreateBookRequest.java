package com.bookhub.bookhub_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookRequest {
    @NotBlank
    private String title;
    private String author;
    private String category;
    @Min(0)
    @Builder.Default
    private int totalCopies = 1;
    private String description;
}
