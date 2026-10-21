package com.tripgenie.destination;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationRepository repository;

    public DestinationController(DestinationRepository repository) {
        this.repository = repository;
    }

    // READ ALL
    @GetMapping
    public List<Destination> getAll() {
        return repository.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Destination getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Destination not found"
                        ));
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Destination create(
            @Valid @RequestBody Destination destination) {

        destination.setId(null);
        return repository.save(destination);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Destination update(
            @PathVariable Long id,
            @Valid @RequestBody Destination updated) {

        Destination existing = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Destination not found"
                        ));

        existing.setName(updated.getName());
        existing.setState(updated.getState());
        existing.setCountry(updated.getCountry());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        existing.setImageUrl(updated.getImageUrl());
        existing.setDailyCost(updated.getDailyCost());
        existing.setRating(updated.getRating());
        existing.setBestSeason(updated.getBestSeason());
        existing.setHighlights(updated.getHighlights());

        return repository.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Destination not found"
            );
        }

        repository.deleteById(id);
    }
}
