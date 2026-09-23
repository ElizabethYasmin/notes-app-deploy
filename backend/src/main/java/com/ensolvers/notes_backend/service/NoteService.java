package com.ensolvers.notes_backend.service;

import com.ensolvers.notes_backend.dto.CategoryResponseDto;
import com.ensolvers.notes_backend.dto.NoteRequestDto;
import com.ensolvers.notes_backend.dto.NoteResponseDto;
import com.ensolvers.notes_backend.entity.Category;
import com.ensolvers.notes_backend.entity.Note;
import com.ensolvers.notes_backend.repository.NoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryService categoryService;

    public NoteService(NoteRepository noteRepository, CategoryService categoryService) {
        this.noteRepository = noteRepository;
        this.categoryService = categoryService;
    }

    public NoteResponseDto create(NoteRequestDto request) {
        Note note = new Note();
        note.setTitle(request.title());
        note.setContent(request.content());
        note.setCategories(resolveCategories(request.categoryIds()));
        return toDto(noteRepository.save(note));
    }

    public NoteResponseDto update(Long id, NoteRequestDto request) {
        Note note = findOrThrow(id);
        note.setTitle(request.title());
        note.setContent(request.content());
        note.setCategories(resolveCategories(request.categoryIds()));
        return toDto(noteRepository.save(note));
    }

    public void delete(Long id) {
        Note note = findOrThrow(id);
        noteRepository.delete(note);
    }

    public NoteResponseDto archive(Long id) {
        Note note = findOrThrow(id);
        note.setArchived(true);
        return toDto(noteRepository.save(note));
    }

    public NoteResponseDto unarchive(Long id) {
        Note note = findOrThrow(id);
        note.setArchived(false);
        return toDto(noteRepository.save(note));
    }

    public NoteResponseDto getById(Long id) {
        return toDto(findOrThrow(id));
    }

    public List<NoteResponseDto> listActive(Long categoryId) {
        List<Note> notes = categoryId == null
                ? noteRepository.findByArchivedFalse()
                : noteRepository.findByArchivedFalseAndCategories_Id(categoryId);
        return notes.stream().map(this::toDto).toList();
    }

    public List<NoteResponseDto> listArchived(Long categoryId) {
        List<Note> notes = categoryId == null
                ? noteRepository.findByArchivedTrue()
                : noteRepository.findByArchivedTrueAndCategories_Id(categoryId);
        return notes.stream().map(this::toDto).toList();
    }

    private Set<Category> resolveCategories(List<Long> categoryIds) {
        Set<Category> categories = new HashSet<>();
        if (categoryIds != null) {
            for (Long categoryId : categoryIds) {
                categories.add(categoryService.findOrThrow(categoryId));
            }
        }
        return categories;
    }

    private Note findOrThrow(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found: " + id));
    }

    private NoteResponseDto toDto(Note note) {
        List<CategoryResponseDto> categories = note.getCategories().stream()
                .map(c -> new CategoryResponseDto(c.getId(), c.getName()))
                .toList();
        return new NoteResponseDto(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.isArchived(),
                note.getCreatedAt(),
                note.getUpdatedAt(),
                categories
        );
    }
}
