# TripGenie – Travel Planning Web Application

## 1. Project Description

TripGenie is a full-stack travel-planning web application designed to make trip planning simple, convenient, and budget-friendly. 
It allows users to search for destinations, check weather information, estimate travel expenses, generate day-by-day itineraries,
and save travel plans for future reference.

The application provides a user-friendly and responsive interface without requiring users to register or log in.

## 2. Features

* **Destination Search:** Search for locations using the Open-Meteo geocoding API.
* **Weather Information:** Retrieve weather information for supported locations.
* **Destination Management:** Add, view, update, and delete destination records.
* **Budget Estimation:** Estimate trip expenses based on travel-planning details.
* **Itinerary Generation:** Generate a day-by-day travel itinerary.
* **Saved Itineraries:** Save, view, and delete travel plans.
* **Database Persistence:** Store destination information and saved itineraries.
* **Responsive Design:** Access the application through desktop, tablet, and mobile browsers.
* **No Login Required:** Explore the application's features without creating an account.

## 3. Technologies Used

### Frontend

* React
* JavaScript
* CSS
* Vite

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven

### Database and External API

* H2 Database
* Open-Meteo API for location search and weather information

### Development and Testing Tools

* Visual Studio Code
* Thunder Client
* Git and GitHub

## 4. Project Structure

```text
TripGenie/
├── backend/
│   ├── data/                         # Local H2 database files
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tripgenie/
│   │       │   ├── config/
│   │       │   │   └── CorsConfig.java
│   │       │   ├── destination/
│   │       │   │   ├── Destination.java
│   │       │   │   ├── DestinationController.java
│   │       │   │   └── DestinationRepository.java
│   │       │   ├── itinerary/
│   │       │   │   ├── Itinerary.java
│   │       │   │   ├── ItineraryController.java
│   │       │   │   └── ItineraryRepository.java
│   │       │   ├── travel/
│   │       │   │   └── TravelController.java
│   │       │   └── TripGenieApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## 5. Prerequisites

Install the following software before running the application:

* Java Development Kit (JDK) 21
* Maven
* Node.js and npm
* Visual Studio Code or another suitable code editor
* Internet connection for external API functionality

## 6. Installation and Execution

### Backend Setup

1. Open the project in Visual Studio Code.

2. Open a terminal and navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Start the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

4. The backend normally runs at:

   ```text
   http://localhost:8080
   ```

### Frontend Setup

1. Open a new terminal.

2. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

3. Install the frontend dependencies:

   ```bash
   npm install
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal. The default Vite URL is usually:

   ```text
   http://localhost:5173
   ```

Keep the backend running while using the frontend.

## 7. API Endpoints

| HTTP Method | Endpoint                                                        | Description                  |
| ----------- | --------------------------------------------------------------- | ---------------------------- |
| GET         | `/api/destinations`                                             | Retrieve all destinations    |
| GET         | `/api/destinations/{id}`                                        | Retrieve a destination by ID |
| POST        | `/api/destinations`                                             | Add a destination            |
| PUT         | `/api/destinations/{id}`                                        | Update a destination         |
| DELETE      | `/api/destinations/{id}`                                        | Delete a destination         |
| GET         | `/api/travel/search?name={name}`                                | Search for locations         |
| GET         | `/api/travel/weather?latitude={latitude}&longitude={longitude}` | Retrieve weather information |
| GET         | `/api/itineraries`                                              | Retrieve saved itineraries   |
| POST        | `/api/itineraries`                                              | Save an itinerary            |
| DELETE      | `/api/itineraries/{id}`                                         | Delete an itinerary          |

## 8. Database

TripGenie uses an H2 relational database with Spring Data JPA and Hibernate for data persistence.

The main entities are:

### Destination

Stores information about travel destinations.

Fields include:

* ID
* Name
* State
* Country
* Category
* Description
* Image URL
* Estimated daily cost

### Itinerary

Stores generated travel plans.

Fields include:

* ID
* Destination name
* Trip duration
* Number of travellers
* Daily budget
* Estimated total cost
* Itinerary details in JSON format
* Creation timestamp

The destination entity supports Create, Read, Update, and Delete (CRUD) operations. The itinerary entity supports creating,
retrieving, and deleting saved itineraries.

## 9. External API Integration

TripGenie integrates with the Open-Meteo API to retrieve location and weather information.

The backend sends requests to the external service, processes the responses, and provides the relevant information to the frontend.

External API functionality requires an internet connection and depends on service availability.

## 10. Testing

The application has been tested during development using the web interface and Thunder Client.

Testing includes:

* Destination creation and retrieval.
* Destination update and deletion.
* Location search.
* Weather information retrieval.
* Trip planning and budget estimation.
* Itinerary generation.
* Saving and retrieving itineraries.
* Deleting saved itineraries.

Database persistence and external API functionality should be verified in the running environment before final deployment.

## 11. Limitations

* Estimated travel costs may differ from actual expenses.
* Location and weather information depend on external API availability.
* Flight and hotel booking and payment processing are outside the current scope.
* The application does not currently require user authentication.
* Saved itineraries are not associated with individual authenticated user accounts.

## 12. Future Enhancements

* Interactive maps and route planning.
* User accounts and personalised travel plans.
* PDF itinerary export.
* More detailed expense breakdowns.
* Favourite destinations and reviews.
* Automated testing.
* Production deployment with appropriate security measures.

## 13. Conclusion

TripGenie combines destination discovery, weather information, budget estimation, itinerary generation, and saved travel-plan management
in one web application.The project demonstrates full-stack development using React, Java Spring Boot, REST APIs, and an H2 relational database.
It provides a foundation for developing more advanced travel-planning features in the future.
