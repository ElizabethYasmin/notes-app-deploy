package com.ensolvers.notes_backend.service;

import com.ensolvers.notes_backend.dto.NoteRequestDto;
import com.ensolvers.notes_backend.dto.NoteResponseDto;
import com.ensolvers.notes_backend.entity.Note;
import com.ensolvers.notes_backend.repository.NoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public NoteResponseDto create(NoteRequestDto request) {
        Note note = new Note();
        note.setTitle(request.title());
        note.setContent(request.content());
        return toDto(noteRepository.save(note));
    }

    public NoteResponseDto update(Long id, NoteRequestDto request) {
        Note note = findOrThrow(id);
        note.setTitle(request.title());
        note.setContent(request.content());
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

    public List<NoteResponseDto> listActive() {
        return noteRepository.findByArchivedFalse().stream().map(this::toDto).toList();
    }

    public List<NoteResponseDto> listArchived() {
        return noteRepository.findByArchivedTrue().stream().map(this::toDto).toList();
    }

    private Note findOrThrow(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found: " + id));
    }

    private NoteResponseDto toDto(Note note) {
        return new NoteResponseDto(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.isArchived(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
