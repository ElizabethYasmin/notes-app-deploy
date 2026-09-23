package com.ensolvers.notes_backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record NoteRequestDto(
        @NotBlank(message = "Title is required")
        String title,
        String content,
        List<Long> categoryIds
) {}
