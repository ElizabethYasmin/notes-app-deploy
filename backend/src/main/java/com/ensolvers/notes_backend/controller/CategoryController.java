package com.ensolvers.notes_backend.controller;

import com.ensolvers.notes_backend.dto.CategoryRequestDto;
import com.ensolvers.notes_backend.dto.CategoryResponseDto;
import com.ensolvers.notes_backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponseDto create(Authentication authentication, @Valid @RequestBody CategoryRequestDto request) {
        return categoryService.create(authentication.getName(), request);
    }

    @GetMapping
    public List<CategoryResponseDto> listAll(Authentication authentication) {
        return categoryService.listAll(authentication.getName());
    }

    @PutMapping("/{id}")
    public CategoryResponseDto update(Authentication authentication, @PathVariable Long id, @Valid @RequestBody CategoryRequestDto request) {
        return categoryService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        categoryService.delete(authentication.getName(), id);
    }
}
