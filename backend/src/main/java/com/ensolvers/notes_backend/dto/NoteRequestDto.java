package com.ensolvers.notes_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record NoteRequestDto(
        @NotBlank(message = "Title is required")
        String title,
        String content
) {}
