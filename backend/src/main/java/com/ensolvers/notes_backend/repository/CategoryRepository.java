package com.ensolvers.notes_backend.repository;

import com.ensolvers.notes_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByUser_IdAndName(Long userId, String name);
    Optional<Category> findByIdAndUser_Id(Long id, Long userId);
    List<Category> findAllByUser_Id(Long userId);
}
