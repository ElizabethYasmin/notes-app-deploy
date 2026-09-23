package com.ensolvers.notes_backend.controller;

import com.ensolvers.notes_backend.dto.NoteRequestDto;
import com.ensolvers.notes_backend.dto.NoteResponseDto;
import com.ensolvers.notes_backend.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public NoteResponseDto create(@Valid @RequestBody NoteRequestDto request) {
        return noteService.create(request);
    }

    @GetMapping("/{id}")
    public NoteResponseDto getById(@PathVariable Long id) {
        return noteService.getById(id);
    }

    @PutMapping("/{id}")
    public NoteResponseDto update(@PathVariable Long id, @Valid @RequestBody NoteRequestDto request) {
        return noteService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        noteService.delete(id);
    }

    @PatchMapping("/{id}/archive")
    public NoteResponseDto archive(@PathVariable Long id) {
        return noteService.archive(id);
    }

    @PatchMapping("/{id}/unarchive")
    public NoteResponseDto unarchive(@PathVariable Long id) {
        return noteService.unarchive(id);
    }

    @GetMapping("/active")
    public List<NoteResponseDto> listActive(@RequestParam(required = false) Long categoryId) {
        return noteService.listActive(categoryId);
    }

    @GetMapping("/archived")
    public List<NoteResponseDto> listArchived(@RequestParam(required = false) Long categoryId) {
        return noteService.listArchived(categoryId);
    }
}
