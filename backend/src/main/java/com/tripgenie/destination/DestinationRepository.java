package com.tripgenie.destination;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository
        extends JpaRepository<Destination, Long> {

    boolean existsByNameIgnoreCase(String name);
}
