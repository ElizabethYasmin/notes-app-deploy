package com.ensolvers.notes_backend.controller;

import com.ensolvers.notes_backend.dto.NoteRequestDto;
import com.ensolvers.notes_backend.dto.NoteResponseDto;
import com.ensolvers.notes_backend.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteResponseDto create(Authentication authentication, @Valid @RequestBody NoteRequestDto request) {
        return noteService.create(authentication.getName(), request);
    }

    @GetMapping("/{id}")
    public NoteResponseDto getById(Authentication authentication, @PathVariable Long id) {
        return noteService.getById(authentication.getName(), id);
    }

    @PutMapping("/{id}")
    public NoteResponseDto update(Authentication authentication, @PathVariable Long id, @Valid @RequestBody NoteRequestDto request) {
        return noteService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        noteService.delete(authentication.getName(), id);
    }

    @PatchMapping("/{id}/archive")
    public NoteResponseDto archive(Authentication authentication, @PathVariable Long id) {
        return noteService.archive(authentication.getName(), id);
    }

    @PatchMapping("/{id}/unarchive")
    public NoteResponseDto unarchive(Authentication authentication, @PathVariable Long id) {
        return noteService.unarchive(authentication.getName(), id);
    }

    @GetMapping("/active")
    public List<NoteResponseDto> listActive(Authentication authentication, @RequestParam(required = false) Long categoryId) {
        return noteService.listActive(authentication.getName(), categoryId);
    }

    @GetMapping("/archived")
    public List<NoteResponseDto> listArchived(Authentication authentication, @RequestParam(required = false) Long categoryId) {
        return noteService.listArchived(authentication.getName(), categoryId);
    }
}
