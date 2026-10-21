package com.tripgenie.destination;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DestinationDataInitializer {

    @Bean
    CommandLineRunner seedDestinations(DestinationRepository repository) {
        return args -> {
            repository.findAll().stream()
                    .filter(destination -> destination.getRating() < 1)
                    .forEach(destination -> {
                        destination.setRating(4.0);
                        repository.save(destination);
                    });

            List<Destination> starters = List.of(
                    destination("Munnar", "Kerala", "India", "Nature", 2200, 4.7,
                            "September to March", "Tea gardens, misty viewpoints, waterfalls",
                            "Cool hill-country escapes with tea estates, scenic trails, and relaxed stays.",
                            "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=80"),
                    destination("Jaipur", "Rajasthan", "India", "Heritage", 2600, 4.6,
                            "October to March", "Amber Fort, City Palace, local crafts",
                            "A colourful heritage city known for grand forts, lively bazaars, and Rajasthani food.",
                            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"),
                    destination("Goa", "Goa", "India", "Beach", 3200, 4.5,
                            "November to February", "Beaches, sunset cruises, Portuguese heritage",
                            "A laid-back coastal break with beaches, seafood, and colourful old neighbourhoods.",
                            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"),
                    destination("Rishikesh", "Uttarakhand", "India", "Adventure", 2100, 4.7,
                            "September to April", "Rafting, yoga, Ganga aarti",
                            "A riverside hub for gentle adventure, yoga retreats, and mountain views.",
                            "https://images.unsplash.com/photo-1626014303757-63682a887d67?auto=format&fit=crop&w=1200&q=80"),
                    destination("Kochi", "Kerala", "India", "Culture", 2400, 4.4,
                            "October to February", "Fort Kochi, spice markets, art cafés",
                            "A harbour city where historic streets, galleries, and coastal flavours meet.",
                            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"),
                    destination("Bengaluru", "Karnataka", "India", "City", 2800, 4.3,
                            "October to February", "Gardens, cafés, museums",
                            "A lively urban escape with green spaces, food neighbourhoods, and culture.",
                            "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80")
            );

            starters.stream()
                    .filter(destination -> !repository.existsByNameIgnoreCase(destination.getName()))
                    .forEach(repository::save);
        };
    }

    private Destination destination(
            String name, String state, String country, String category, double dailyCost,
            double rating, String bestSeason, String highlights, String description, String imageUrl) {
        Destination destination = new Destination();
        destination.setName(name);
        destination.setState(state);
        destination.setCountry(country);
        destination.setCategory(category);
        destination.setDailyCost(dailyCost);
        destination.setRating(rating);
        destination.setBestSeason(bestSeason);
        destination.setHighlights(highlights);
        destination.setDescription(description);
        destination.setImageUrl(imageUrl);
        return destination;
    }
}
