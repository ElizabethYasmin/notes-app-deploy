package com.ensolvers.notes_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDto(
        @NotBlank(message = "Name is required") String name
) {
}
