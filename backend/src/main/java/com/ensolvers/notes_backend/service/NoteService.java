package com.ensolvers.notes_backend.service;

import com.ensolvers.notes_backend.dto.CategoryResponseDto;
import com.ensolvers.notes_backend.dto.NoteRequestDto;
import com.ensolvers.notes_backend.dto.NoteResponseDto;
import com.ensolvers.notes_backend.entity.AppUser;
import com.ensolvers.notes_backend.entity.Category;
import com.ensolvers.notes_backend.entity.Note;
import com.ensolvers.notes_backend.repository.NoteRepository;
import com.ensolvers.notes_backend.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final RealtimeNotifier realtimeNotifier;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository,
                        CategoryService categoryService, RealtimeNotifier realtimeNotifier) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.categoryService = categoryService;
        this.realtimeNotifier = realtimeNotifier;
    }

    public NoteResponseDto create(String username, NoteRequestDto request) {
        AppUser user = getUser(username);
        Note note = new Note();
        note.setTitle(request.title());
        note.setContent(request.content());
        note.setUser(user);
        note.setCategories(resolveCategories(user.getId(), request.categoryIds()));
        NoteResponseDto dto = toDto(noteRepository.save(note));
        realtimeNotifier.notifyUser(username);
        return dto;
    }

    public NoteResponseDto update(String username, Long id, NoteRequestDto request) {
        AppUser user = getUser(username);
        Note note = findOrThrow(id, user.getId());
        note.setTitle(request.title());
        note.setContent(request.content());
        note.setCategories(resolveCategories(user.getId(), request.categoryIds()));
        NoteResponseDto dto = toDto(noteRepository.save(note));
        realtimeNotifier.notifyUser(username);
        return dto;
    }

    public void delete(String username, Long id) {
        AppUser user = getUser(username);
        Note note = findOrThrow(id, user.getId());
        noteRepository.delete(note);
        realtimeNotifier.notifyUser(username);
    }

    public NoteResponseDto archive(String username, Long id) {
        AppUser user = getUser(username);
        Note note = findOrThrow(id, user.getId());
        note.setArchived(true);
        NoteResponseDto dto = toDto(noteRepository.save(note));
        realtimeNotifier.notifyUser(username);
        return dto;
    }

    public NoteResponseDto unarchive(String username, Long id) {
        AppUser user = getUser(username);
        Note note = findOrThrow(id, user.getId());
        note.setArchived(false);
        NoteResponseDto dto = toDto(noteRepository.save(note));
        realtimeNotifier.notifyUser(username);
        return dto;
    }

    public NoteResponseDto getById(String username, Long id) {
        AppUser user = getUser(username);
        return toDto(findOrThrow(id, user.getId()));
    }

    public List<NoteResponseDto> listActive(String username, Long categoryId) {
        AppUser user = getUser(username);
        List<Note> notes = categoryId == null
                ? noteRepository.findByUser_IdAndArchivedFalse(user.getId())
                : noteRepository.findByUser_IdAndArchivedFalseAndCategories_Id(user.getId(), categoryId);
        return notes.stream().map(this::toDto).toList();
    }

    public List<NoteResponseDto> listArchived(String username, Long categoryId) {
        AppUser user = getUser(username);
        List<Note> notes = categoryId == null
                ? noteRepository.findByUser_IdAndArchivedTrue(user.getId())
                : noteRepository.findByUser_IdAndArchivedTrueAndCategories_Id(user.getId(), categoryId);
        return notes.stream().map(this::toDto).toList();
    }

    private Set<Category> resolveCategories(Long userId, List<Long> categoryIds) {
        Set<Category> categories = new HashSet<>();
        if (categoryIds != null) {
            for (Long categoryId : categoryIds) {
                categories.add(categoryService.findOrThrow(categoryId, userId));
            }
        }
        return categories;
    }

    private AppUser getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found: " + username));
    }

    private Note findOrThrow(Long id, Long userId) {
        return noteRepository.findByIdAndUser_Id(id, userId)
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
