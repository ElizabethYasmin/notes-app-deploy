package com.ensolvers.notes_backend.dto;

import java.time.Instant;

public record NoteResponseDto(
        Long id,
        String title,
        String content,
        boolean archived,
        Instant createdAt,
        Instant updatedAt
) {}
