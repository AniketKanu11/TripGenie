package com.tripgenie.itinerary;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_itineraries")
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String destinationName;

    @Min(1)
    private int durationDays;

    @Min(1)
    private int travelers;

    @Min(0)
    private double dailyBudget;

    @Min(0)
    private double estimatedTotal;

    @Lob
    @Column(nullable = false)
    private String itineraryJson;

    private String departureDate;

    private String tripStyle;

    private String transportMode;

    private String stayType;

    private LocalDateTime createdAt;

    public Itinerary() {
    }

    @PrePersist
    public void beforeSave() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public int getTravelers() {
        return travelers;
    }

    public void setTravelers(int travelers) {
        this.travelers = travelers;
    }

    public double getDailyBudget() {
        return dailyBudget;
    }

    public void setDailyBudget(double dailyBudget) {
        this.dailyBudget = dailyBudget;
    }

    public double getEstimatedTotal() {
        return estimatedTotal;
    }

    public void setEstimatedTotal(double estimatedTotal) {
        this.estimatedTotal = estimatedTotal;
    }

    public String getItineraryJson() {
        return itineraryJson;
    }

    public void setItineraryJson(String itineraryJson) {
        this.itineraryJson = itineraryJson;
    }

    public String getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(String departureDate) {
        this.departureDate = departureDate;
    }

    public String getTripStyle() {
        return tripStyle;
    }

    public void setTripStyle(String tripStyle) {
        this.tripStyle = tripStyle;
    }

    public String getTransportMode() {
        return transportMode;
    }

    public void setTransportMode(String transportMode) {
        this.transportMode = transportMode;
    }

    public String getStayType() {
        return stayType;
    }

    public void setStayType(String stayType) {
        this.stayType = stayType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
