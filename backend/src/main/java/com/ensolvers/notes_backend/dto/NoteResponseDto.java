package com.ensolvers.notes_backend.dto;

import java.time.Instant;
import java.util.List;

public record NoteResponseDto(
        Long id,
        String title,
        String content,
        boolean archived,
        Instant createdAt,
        Instant updatedAt,
        List<CategoryResponseDto> categories
) {}
