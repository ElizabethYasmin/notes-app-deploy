package com.ensolvers.notes_backend.controller;

import com.ensolvers.notes_backend.dto.CategoryRequestDto;
import com.ensolvers.notes_backend.dto.CategoryResponseDto;
import com.ensolvers.notes_backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public CategoryResponseDto create(@Valid @RequestBody CategoryRequestDto request) {
        return categoryService.create(request);
    }

    @GetMapping
    public List<CategoryResponseDto> listAll() {
        return categoryService.listAll();
    }

    @PutMapping("/{id}")
    public CategoryResponseDto update(@PathVariable Long id, @Valid @RequestBody CategoryRequestDto request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
