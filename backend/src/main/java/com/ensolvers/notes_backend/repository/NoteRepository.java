package com.ensolvers.notes_backend.repository;

import com.ensolvers.notes_backend.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    Optional<Note> findByIdAndUser_Id(Long id, Long userId);

    List<Note> findByUser_IdAndArchivedFalse(Long userId);

    List<Note> findByUser_IdAndArchivedTrue(Long userId);

    List<Note> findByUser_IdAndArchivedFalseAndCategories_Id(Long userId, Long categoryId);

    List<Note> findByUser_IdAndArchivedTrueAndCategories_Id(Long userId, Long categoryId);
}
