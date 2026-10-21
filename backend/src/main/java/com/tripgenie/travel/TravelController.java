package com.tripgenie.travel;

import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    private final RestClient restClient;

    public TravelController() {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5_000);
        requestFactory.setReadTimeout(8_000);

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    // Search locations using live geocoding data.
    @GetMapping("/search")
    public Map<?, ?> searchLocation(
            @RequestParam String name) {

        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a destination name"
            );
        }

        try {
            return restClient.get()
                    .uri(
                        "https://geocoding-api.open-meteo.com/v1/search"
                        + "?name={name}&count=10&language=en&format=json",
                        name
                    )
                    .retrieve()
                    .body(Map.class);

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Location search service is unavailable"
            );
        }
    }

    // Retrieve live forecast data for coordinates.
    @GetMapping("/weather")
    public Map<?, ?> getWeather(
            @RequestParam double latitude,
            @RequestParam double longitude) {

        if (latitude < -90 || latitude > 90
                || longitude < -180 || longitude > 180) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid coordinates"
            );
        }

        try {
            return restClient.get()
                    .uri(
                        "https://api.open-meteo.com/v1/forecast"
                        + "?latitude={latitude}"
                        + "&longitude={longitude}"
                        + "&current=temperature_2m,relative_humidity_2m,"
                        + "apparent_temperature,is_day,precipitation,"
                        + "weather_code,wind_speed_10m"
                        + "&daily=temperature_2m_max,temperature_2m_min,"
                        + "precipitation_probability_max"
                        + "&forecast_days=7"
                        + "&timezone=auto",
                        latitude,
                        longitude
                    )
                    .retrieve()
                    .body(Map.class);

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Weather service is unavailable"
            );
        }
    }
}
