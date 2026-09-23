package com.ensolvers.notes_backend.service;

import com.ensolvers.notes_backend.dto.CategoryRequestDto;
import com.ensolvers.notes_backend.dto.CategoryResponseDto;
import com.ensolvers.notes_backend.entity.Category;
import com.ensolvers.notes_backend.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponseDto create(CategoryRequestDto request) {
        categoryRepository.findByName(request.name()).ifPresent(c -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists: " + request.name());
        });
        Category category = new Category();
        category.setName(request.name());
        return toDto(categoryRepository.save(category));
    }

    public List<CategoryResponseDto> listAll() {
        return categoryRepository.findAll().stream().map(this::toDto).toList();
    }

    public CategoryResponseDto update(Long id, CategoryRequestDto request) {
        Category category = findOrThrow(id);
        categoryRepository.findByName(request.name()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists: " + request.name());
            }
        });
        category.setName(request.name());
        return toDto(categoryRepository.save(category));
    }

    public void delete(Long id) {
        Category category = findOrThrow(id);
        categoryRepository.delete(category);
    }

    Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + id));
    }

    private CategoryResponseDto toDto(Category category) {
        return new CategoryResponseDto(category.getId(), category.getName());
    }
}
