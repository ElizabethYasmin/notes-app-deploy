package com.ensolvers.notes_backend.repository;

import com.ensolvers.notes_backend.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByArchivedFalse();

    List<Note> findByArchivedTrue();

    List<Note> findByArchivedFalseAndCategories_Id(Long categoryId);

    List<Note> findByArchivedTrueAndCategories_Id(Long categoryId);
}
