package com.tripgenie.itinerary;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
public class ItineraryController {

    private final ItineraryRepository repository;

    public ItineraryController(ItineraryRepository repository) {
        this.repository = repository;
    }

    // Get all saved itineraries
    @GetMapping
    public List<Itinerary> getAllItineraries() {
        return repository.findAll();
    }

    // Save a new itinerary
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Itinerary saveItinerary(
            @Valid @RequestBody Itinerary itinerary) {

        itinerary.setItineraryJson(
                itinerary.getItineraryJson() == null
                        ? "[]"
                        : itinerary.getItineraryJson()
        );

        return repository.save(itinerary);
    }

    // Delete a saved itinerary
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItinerary(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Itinerary not found"
            );
        }

        repository.deleteById(id);
    }
}