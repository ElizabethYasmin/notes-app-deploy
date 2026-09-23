package com.ensolvers.notes_backend.service;

import com.ensolvers.notes_backend.dto.CategoryRequestDto;
import com.ensolvers.notes_backend.dto.CategoryResponseDto;
import com.ensolvers.notes_backend.entity.AppUser;
import com.ensolvers.notes_backend.entity.Category;
import com.ensolvers.notes_backend.repository.CategoryRepository;
import com.ensolvers.notes_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public CategoryResponseDto create(String username, CategoryRequestDto request) {
        AppUser user = getUser(username);
        categoryRepository.findByUser_IdAndName(user.getId(), request.name()).ifPresent(c -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists: " + request.name());
        });
        Category category = new Category();
        category.setName(request.name());
        category.setUser(user);
        return toDto(categoryRepository.save(category));
    }

    public List<CategoryResponseDto> listAll(String username) {
        AppUser user = getUser(username);
        return categoryRepository.findAllByUser_Id(user.getId()).stream().map(this::toDto).toList();
    }

    public CategoryResponseDto update(String username, Long id, CategoryRequestDto request) {
        AppUser user = getUser(username);
        Category category = findOrThrow(id, user.getId());
        categoryRepository.findByUser_IdAndName(user.getId(), request.name()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists: " + request.name());
            }
        });
        category.setName(request.name());
        return toDto(categoryRepository.save(category));
    }

    public void delete(String username, Long id) {
        AppUser user = getUser(username);
        Category category = findOrThrow(id, user.getId());
        categoryRepository.delete(category);
    }

    Category findOrThrow(Long id, Long userId) {
        return categoryRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + id));
    }

    private AppUser getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found: " + username));
    }

    private CategoryResponseDto toDto(Category category) {
        return new CategoryResponseDto(category.getId(), category.getName());
    }
}
