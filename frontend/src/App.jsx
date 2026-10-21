import { useEffect, useState } from "react";
import {
  Compass,
  Search,
  MapPin,
  CloudSun,
  Plus,
  Pencil,
  Trash2,
  X,
  LoaderCircle,
  Wallet,
  Users,
  CalendarDays,
  SlidersHorizontal,
  Star,
  Heart,
  Luggage,
  Car,
  BedDouble,
  Sparkles,
  Umbrella,
  Sun,
  CloudRain,
  CircleDollarSign
} from "lucide-react";

const API = "http://localhost:8080/api";

const emptyDestination = {
  name: "",
  state: "",
  country: "India",
  category: "Nature",
  description: "",
  imageUrl: "",
  dailyCost: 1500,
  rating: 4,
  bestSeason: "",
  highlights: ""
};

const categoryOptions = [
  "All", "Nature", "Beach", "Adventure", "Heritage", "City", "Culture"
];

const interestOptions = ["Sightseeing", "Local food", "Outdoors", "Culture", "Relaxation"];

const weatherDetails = {
  0: { label: "Clear sky", icon: Sun, advice: "Great conditions for outdoor plans. Carry sunscreen and water." },
  1: { label: "Mostly clear", icon: Sun, advice: "A light layer and sunscreen will keep you comfortable." },
  2: { label: "Partly cloudy", icon: CloudSun, advice: "Comfortable for exploring; keep a light layer handy." },
  3: { label: "Overcast", icon: CloudSun, advice: "Ideal for museums and walking tours; pack a light jacket." },
  45: { label: "Foggy", icon: CloudSun, advice: "Allow extra travel time and choose well-marked routes." },
  48: { label: "Foggy", icon: CloudSun, advice: "Allow extra travel time and choose well-marked routes." },
  51: { label: "Light drizzle", icon: CloudRain, advice: "Keep a compact umbrella and waterproof footwear ready." },
  53: { label: "Drizzle", icon: CloudRain, advice: "Keep a compact umbrella and waterproof footwear ready." },
  55: { label: "Heavy drizzle", icon: CloudRain, advice: "Favour indoor options and carry rain protection." },
  61: { label: "Light rain", icon: CloudRain, advice: "Keep an umbrella handy and allow extra travel time." },
  63: { label: "Rain", icon: CloudRain, advice: "Mix indoor stops into your day and wear waterproof shoes." },
  65: { label: "Heavy rain", icon: CloudRain, advice: "Plan indoor activities and check local travel conditions." },
  80: { label: "Rain showers", icon: CloudRain, advice: "Short showers are possible, so keep rain protection close." },
  81: { label: "Rain showers", icon: CloudRain, advice: "Short showers are possible, so keep rain protection close." },
  82: { label: "Heavy showers", icon: CloudRain, advice: "Prioritise flexible, indoor-friendly plans today." },
  95: { label: "Thunderstorm", icon: CloudRain, advice: "Avoid exposed outdoor activities and monitor local alerts." }
};

const weatherInfo = (code) => weatherDetails[code] || {
  label: "Mixed conditions",
  icon: CloudSun,
  advice: "Check the local forecast before heading out."
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);

function App() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);

  const [searching, setSearching] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");

  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [dailyBudget, setDailyBudget] = useState(2000);
  const [tripDestination, setTripDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [tripStyle, setTripStyle] = useState("Balanced");
  const [transportMode, setTransportMode] = useState("Train");
  const [stayType, setStayType] = useState("Comfort");
  const [interests, setInterests] = useState(["Sightseeing", "Local food"]);
  const [packingList, setPackingList] = useState([]);

  const [itinerary, setItinerary] = useState([]);
  const [itineraryMessage, setItineraryMessage] = useState("");

  const [savedItineraries, setSavedItineraries] = useState([]);
  const [savingItinerary, setSavingItinerary] = useState(false);

  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState(emptyDestination);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [libraryQuery, setLibraryQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("All budgets");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tripgenie-favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [notice, setNotice] = useState("");

  const activeDestinationName =
    tripDestination || selected?.name || destinations[0]?.name || "";
  const activeDestination = destinations.find(
    (destination) => destination.name.toLowerCase() === activeDestinationName.toLowerCase()
  );
  const tripCost = days * people * dailyBudget;
  const tripCostPerPerson = days * dailyBudget;

  const filteredDestinations = destinations
    .filter((destination) => {
      const searchableText = [
        destination.name,
        destination.state,
        destination.country,
        destination.category,
        destination.highlights
      ].join(" ").toLowerCase();
      const matchesQuery = searchableText.includes(libraryQuery.trim().toLowerCase());
      const matchesCategory = categoryFilter === "All" || destination.category === categoryFilter;
      const matchesBudget =
        budgetFilter === "All budgets" ||
        (budgetFilter === "Under ₹2,500" && destination.dailyCost < 2500) ||
        (budgetFilter === "₹2,500–₹4,000" && destination.dailyCost >= 2500 && destination.dailyCost <= 4000) ||
        (budgetFilter === "Above ₹4,000" && destination.dailyCost > 4000);
      const matchesFavorites = !showFavoritesOnly || favoriteIds.includes(destination.id);
      return matchesQuery && matchesCategory && matchesBudget && matchesFavorites;
    })
    .sort((a, b) => {
      if (sortBy === "Budget: low to high") return a.dailyCost - b.dailyCost;
      if (sortBy === "Budget: high to low") return b.dailyCost - a.dailyCost;
      if (sortBy === "Top rated") return (b.rating || 0) - (a.rating || 0);
      return (b.rating || 0) - (a.rating || 0) || a.dailyCost - b.dailyCost;
    });

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function loadDestinations() {
    try {
      const data = await request(`${API}/destinations`);
      setDestinations(data);
    } catch {
      setError(
        "Could not connect to the backend. Start Spring Boot on port 8080."
      );
    }
  }

  useEffect(() => {
    loadDestinations();
    loadSavedItineraries();
  }, []);

  useEffect(() => {
    localStorage.setItem("tripgenie-favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  async function loadSavedItineraries() {
  try {
    const data = await request(`${API}/itineraries`);
    setSavedItineraries(data);
  } catch (error) {
    console.error("Could not load saved itineraries:", error);
  }
}

  async function searchLocations(event) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Enter a destination to search.");
      return;
    }

    setSearching(true);
    setError("");
    setLocations([]);
    setSelected(null);
    setWeather(null);

    try {
      const data = await request(
        `${API}/travel/search?name=${encodeURIComponent(query.trim())}`
      );

      setLocations(data.results || []);

      if (!data.results?.length) {
        setError("No matching locations found. Try another name.");
      }
    } catch (e) {
      setError(e.message || "Location search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function selectLocation(location) {
    setSelected(location);
    setTripDestination(location.name);
    setWeather(null);
    setWeatherLoading(true);
    setError("");

    try {
      const data = await request(
        `${API}/travel/weather?latitude=${location.latitude}` +
        `&longitude=${location.longitude}`
      );

      setWeather(data);
    } catch (e) {
      setError(e.message || "Weather could not be loaded.");
    } finally {
      setWeatherLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyDestination);
    setShowForm(true);
  }

  function openEditForm(destination) {
    setEditingId(destination.id);

    setForm({
      name: destination.name || "",
      state: destination.state || "",
      country: destination.country || "India",
      category: destination.category || "Nature",
      description: destination.description || "",
      imageUrl: destination.imageUrl || "",
      dailyCost: destination.dailyCost ?? 1500,
      rating: destination.rating >= 1 ? destination.rating : 4,
      bestSeason: destination.bestSeason || "",
      highlights: destination.highlights || ""
    });

    setShowForm(true);
  }

  async function saveDestination(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        dailyCost: Number(form.dailyCost),
        rating: Number(form.rating)
      };

      if (editingId !== null) {
        await request(`${API}/destinations/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });

        setNotice("Destination updated successfully.");
      } else {
        await request(`${API}/destinations`, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        setNotice("Destination created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyDestination);

      await loadDestinations();
    } catch (e) {
      setError(e.message || "Could not save destination.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDestination(destination) {
    const confirmed = window.confirm(
      `Delete ${destination.name}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await request(`${API}/destinations/${destination.id}`, {
        method: "DELETE"
      });

      setNotice(`${destination.name} was deleted.`);
      await loadDestinations();
    } catch (e) {
      setError(e.message || "Could not delete destination.");
    }
  }

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  function toggleFavorite(destinationId) {
    setFavoriteIds((current) =>
      current.includes(destinationId)
        ? current.filter((id) => id !== destinationId)
        : [...current, destinationId]
    );
  }

  function chooseDestination(destination) {
    setTripDestination(destination.name);
    setItinerary([]);
    setItineraryMessage(`${destination.name} is now selected for your trip.`);
    document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
  }

  function buildPackingList() {
    const items = ["Photo ID and booking confirmations", "Reusable water bottle", "Phone charger and power bank"];
    const temperature = weather?.current?.temperature_2m;
    const weatherCode = weather?.current?.weather_code;

    if (temperature !== undefined && temperature <= 18) items.push("Warm layer or light jacket");
    if (temperature !== undefined && temperature >= 28) items.push("Sunscreen, sunglasses, and a hat");
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) {
      items.push("Compact umbrella or rain jacket", "Water-resistant footwear");
    }
    if (interests.includes("Outdoors")) items.push("Comfortable walking shoes", "Small daypack");
    if (interests.includes("Culture")) items.push("Modest clothing for places of worship");
    if (transportMode === "Flight") items.push("Boarding pass and luggage tag");

    setPackingList([...new Set(items)].map((item) => ({ item, checked: false })));
  }

  function generateItinerary() {
    const destinationName = activeDestinationName;

    if (!destinationName) {
      setItineraryMessage("Add or select a destination before generating your itinerary.");
      setItinerary([]);
      return;
    }

    const category = (activeDestination?.category || "Nature").toLowerCase();
    const activities = {
    nature: [
      "Explore scenic viewpoints and natural landscapes.",
      "Visit a nearby garden, park, or nature attraction.",
      "Enjoy a relaxed walk and photograph the scenery.",
      "Discover a nearby waterfall or nature trail.",
      "Explore a local market and enjoy regional food."
    ],
    beach: [
      "Explore the coastline and enjoy the sea views.",
      "Spend time at a beach and enjoy the sunset.",
      "Try locally available water activities with safety precautions.",
      "Discover nearby coastal attractions.",
      "Enjoy fresh local food and a relaxing beach walk."
    ],
    adventure: [
      "Explore an outdoor attraction or beginner-friendly trail.",
      "Plan an adventure activity with a reputable local operator.",
      "Visit a scenic viewpoint and enjoy the surroundings.",
      "Discover another nearby outdoor attraction.",
      "Keep time for rest and a relaxed local exploration."
    ],
    heritage: [
      "Explore a historic landmark or heritage district.",
      "Visit a museum or cultural attraction.",
      "Discover local architecture and historical sites.",
      "Explore traditional markets and regional cuisine.",
      "Visit another nearby cultural attraction."
    ],
    culture: [
      "Explore local neighbourhoods and cultural landmarks.",
      "Discover regional food and traditional markets.",
      "Visit a museum, gallery, or cultural centre.",
      "Learn about local traditions and crafts.",
      "Explore another cultural attraction nearby."
    ],
    city: [
      "Explore the city centre and its main landmarks.",
      "Visit a museum or popular urban attraction.",
      "Discover local cafés, markets, and neighbourhoods.",
      "Explore parks and notable city sights.",
      "Enjoy local cuisine and a relaxed evening."
    ]
    };
    const interestActivities = {
      Sightseeing: "Visit a must-see landmark at an unhurried pace.",
      "Local food": "Try a trusted local restaurant or speciality food market.",
      Outdoors: "Spend time in a park, waterfront, trail, or scenic public space.",
      Culture: "Visit a museum, gallery, craft district, or cultural performance.",
      Relaxation: "Leave time for a slow café break or restorative wellness stop."
    };
    const options = activities[category] || activities.nature;
    const paceActivities = tripStyle === "Relaxed" ? 2 : tripStyle === "Packed" ? 4 : 3;

    const plan = Array.from({ length: days }, (_, index) => {
      const dayActivities = [
        options[(index * 2) % options.length],
        ...interests.map((interest) => interestActivities[interest])
      ].filter(Boolean);

      return {
        day: index + 1,
        title:
          index === 0
            ? `Arrival and exploration in ${destinationName}`
            : index === days - 1
            ? "Final discoveries and departure"
            : `Explore ${destinationName}`,
        activities: dayActivities.slice(0, paceActivities),
        tip:
          index === 0
            ? `Arrive via ${transportMode.toLowerCase()}, check in, and keep the first day flexible.`
            : tripStyle === "Relaxed"
            ? "Keep space between stops so you can follow what feels interesting."
            : "Check opening hours, weather conditions, and transport before visiting."
      };
    });

    setItinerary(plan);
    buildPackingList();
    setItineraryMessage(`Your ${days}-day ${tripStyle.toLowerCase()} itinerary for ${destinationName} is ready!`);
  }

  async function saveItinerary() {
  if (itinerary.length === 0) {
    setItineraryMessage(
      "Generate an itinerary before saving it."
    );
    return;
  }

  const destinationName = activeDestinationName;

  if (!destinationName) {
    setItineraryMessage(
      "Select a destination before saving."
    );
    return;
  }

  const payload = {
    destinationName,
    durationDays: days,
    travelers: people,
    dailyBudget,
    estimatedTotal: tripCost,
    itineraryJson: JSON.stringify(itinerary),
    departureDate,
    tripStyle,
    transportMode,
    stayType
  };

  try {
    setSavingItinerary(true);

    await request(`${API}/itineraries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    await loadSavedItineraries();

    setItineraryMessage(
      `Your itinerary for ${destinationName} has been saved!`
    );
  } catch (error) {
    setItineraryMessage(
      error.message || "Could not save the itinerary."
    );
  } finally {
    setSavingItinerary(false);
  }
}

  const weatherCurrent = weather?.current;
  const daily = weather?.daily;
  const currentWeatherInfo = weatherInfo(weatherCurrent?.weather_code);
  const WeatherIcon = currentWeatherInfo.icon;

  return (
    <div className="app-shell">
      <div className="announcement">
        <Compass size={15} />
        <span>Your next favourite place is closer than you think.</span>
      </div>

      <header className="navbar">
        <a className="brand" href="#home" aria-label="TripGenie home">
          <span className="brand-icon">
            <Compass size={23} />
          </span>
          <span>tripgenie<span className="brand-dot">.</span></span>
        </a>

        <nav className="nav-links">
          <a href="#explore">Explore</a>
          <a href="#planner">Trip planner</a>
          <a href="#manage">Manage destinations</a>
        </nav>

        <a className="nav-button" href="#planner">
          Plan my trip <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-shade" />

          <div className="hero-content">
            <p className="eyebrow">LESS SCROLLING. MORE SOUL-SEARCHING.</p>

            <h1>
              Your budget.
              <br />
              Your kind of
              <br />
              <span>escape.</span>
            </h1>

            <p className="hero-description">
              Find beautiful destinations, check the weather,
              and plan a trip that fits your budget.
            </p>

            <a href="#explore" className="primary-button">
              Find my getaway <span>→</span>
            </a>

            <div className="hero-note">
              <span>✦</span>
              <div>
                <strong>Good trips, sensible budgets.</strong>
                <small>Explore destinations and plan with confidence.</small>
              </div>
            </div>
          </div>

          <div className="hero-badge">
            <MapPin size={19} />
            <div>
              <strong>Somewhere wonderful.</strong>
              <small>Your next adventure starts here.</small>
            </div>
          </div>
        </section>

        <section className="section search-section" id="explore">
          <div className="section-heading">
            <p className="eyebrow">EXPLORE THE WORLD</p>
            <h2>Where would you like to go?</h2>
            <p>
              Search for a city or destination to retrieve location
              information and weather forecasts.
            </p>
          </div>

          <form className="search-form" onSubmit={searchLocations}>
            <label htmlFor="destination-search">
              Destination
            </label>

            <div className="search-control">
              <Search size={21} />

              <input
                id="destination-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try Ooty, Goa, Tokyo..."
                maxLength={100}
              />

              <button type="submit" disabled={searching}>
                {searching ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="message error-message" role="alert">
              {error}
            </div>
          )}

          {notice && (
            <div className="message success-message" role="status">
              {notice}
            </div>
          )}

          {locations.length > 0 && (
            <div className="location-results">
              <h3>Search results</h3>

              {locations.map((location) => (
                <button
                  className="location-result"
                  key={`${location.id}-${location.latitude}`}
                  onClick={() => selectLocation(location)}
                  type="button"
                >
                  <MapPin size={20} />

                  <span>
                    <strong>{location.name}</strong>
                    <small>
                      {[location.admin1, location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </small>
                  </span>

                  <span className="result-arrow">→</span>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="weather-card">
              <div className="weather-top">
                <div>
                  <p className="eyebrow">LIVE WEATHER DATA</p>
                  <h3>
                    {selected.name}
                    {selected.country ? `, ${selected.country}` : ""}
                  </h3>

                  <p className="muted">
                    {selected.admin1 || "Selected destination"}
                  </p>
                </div>

                <WeatherIcon size={42} />
              </div>

              {weatherLoading && (
                <p className="muted">Loading weather forecast...</p>
              )}

              {weatherCurrent && (
                <>
                  <div className="weather-temperature">
                    {Math.round(weatherCurrent.temperature_2m)}°C
                  </div>

                  <div className="weather-condition">
                    <WeatherIcon size={18} />
                    <strong>{currentWeatherInfo.label}</strong>
                    <span>{currentWeatherInfo.advice}</span>
                  </div>

                  <div className="weather-stats">
                    <div>
                      <span>Feels like</span>
                      <strong>
                        {Math.round(weatherCurrent.apparent_temperature)}°C
                      </strong>
                    </div>

                    <div>
                      <span>Humidity</span>
                      <strong>
                        {weatherCurrent.relative_humidity_2m}%
                      </strong>
                    </div>

                    <div>
                      <span>Wind</span>
                      <strong>
                        {weatherCurrent.wind_speed_10m} km/h
                      </strong>
                    </div>
                  </div>

                  {daily?.time && (
                    <div className="forecast">
                      <h4>7-day forecast</h4>

                      <div className="forecast-grid">
                        {daily.time.map((date, index) => (
                          <div className="forecast-day" key={date}>
                            <span>
                              {new Date(`${date}T12:00:00`)
                                .toLocaleDateString("en-IN", {
                                  weekday: "short"
                                })}
                            </span>

                            <strong>
                              {Math.round(
                                daily.temperature_2m_max[index]
                              )}°
                            </strong>

                            <small>
                              {Math.round(
                                daily.temperature_2m_min[index]
                              )}° low
                            </small>

                            {daily.precipitation_probability_max?.[index] > 0 && (
                              <small className="rain-chance">
                                {daily.precipitation_probability_max[index]}% rain
                              </small>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="attribution">
                    Weather data: Open-Meteo
                  </p>
                </>
              )}
            </div>
          )}
        </section>

        <section className="section planner-section" id="planner">
          <div className="section-heading">
            <p className="eyebrow">THE GETAWAY FINDER</p>
            <h2>Build your trip</h2>
            <p>
              Adjust your travel details to estimate the total budget.
            </p>
          </div>

          <div className="planner-card">
            <div className="planner-fields">
              <div className="field">
                <label htmlFor="trip-destination">
                  <MapPin size={17} /> Destination
                </label>
                <select
                  id="trip-destination"
                  value={tripDestination}
                  onChange={(e) => setTripDestination(e.target.value)}
                >
                  <option value="">Choose from your library</option>
                  {selected && !destinations.some((destination) => destination.name === selected.name) && (
                    <option value={selected.name}>{selected.name} (search result)</option>
                  )}
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.name}>
                      {destination.name}, {destination.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="departure-date">
                  <CalendarDays size={17} /> Departure date
                </label>
                <input
                  id="departure-date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="days">
                  <CalendarDays size={17} /> Trip duration
                </label>

                <div className="input-suffix">
                  <input
                    id="days"
                    type="number"
                    min="1"
                    max="60"
                    value={days}
                    onChange={(e) =>
                      setDays(Math.min(60, Math.max(1, Number(e.target.value) || 1)))
                    }
                  />
                  <span>days</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="people">
                  <Users size={17} /> Travellers
                </label>

                <div className="input-suffix">
                  <input
                    id="people"
                    type="number"
                    min="1"
                    max="30"
                    value={people}
                    onChange={(e) =>
                      setPeople(Math.min(30, Math.max(1, Number(e.target.value) || 1)))
                    }
                  />
                  <span>people</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="daily-budget">
                  <Wallet size={17} /> Budget per person / day
                </label>

                <div className="input-suffix">
                  <span>₹</span>
                  <input
                    id="daily-budget"
                    type="number"
                    min="0"
                    max="1000000"
                    value={dailyBudget}
                    onChange={(e) =>
                      setDailyBudget(
                        Math.min(
                          1000000,
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="trip-style"><Sparkles size={17} /> Travel pace</label>
                <select id="trip-style" value={tripStyle} onChange={(e) => setTripStyle(e.target.value)}>
                  <option>Relaxed</option>
                  <option>Balanced</option>
                  <option>Packed</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="transport-mode"><Car size={17} /> Main transport</label>
                <select id="transport-mode" value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
                  <option>Train</option>
                  <option>Flight</option>
                  <option>Bus</option>
                  <option>Car</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="stay-type"><BedDouble size={17} /> Stay preference</label>
                <select id="stay-type" value={stayType} onChange={(e) => setStayType(e.target.value)}>
                  <option>Budget</option>
                  <option>Comfort</option>
                  <option>Premium</option>
                </select>
              </div>
            </div>

            <div className="interest-picker">
              <span><Sparkles size={17} /> What would you enjoy?</span>
              <div className="interest-chips">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={interests.includes(interest) ? "interest-chip active" : "interest-chip"}
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={interests.includes(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="budget-presets">
              <span><CircleDollarSign size={17} /> Quick daily budget</span>
              <div>
                {[
                  { label: "Saver", value: 1200 },
                  { label: "Comfort", value: 2500 },
                  { label: "Premium", value: 5000 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={dailyBudget === preset.value ? "budget-preset active" : "budget-preset"}
                    onClick={() => setDailyBudget(preset.value)}
                    aria-pressed={dailyBudget === preset.value}
                  >
                    {preset.label} · {money(preset.value)}
                  </button>
                ))}
              </div>
            </div>

            <div className="budget-result">
              <div>
                <p className="eyebrow">ESTIMATED TOTAL BUDGET</p>
                <div className="budget-number">{money(tripCost)}</div>
                <p className="muted">
                  Based on the values you entered. Actual prices may differ.
                </p>
              </div>

              <div className="budget-breakdown">
                <div>
                  <span>Duration</span>
                  <strong>{days} days</strong>
                </div>

                <div>
                  <span>Travellers</span>
                  <strong>{people}</strong>
                </div>

                <div>
                  <span>Per person</span>
                  <strong>{money(tripCostPerPerson)}</strong>
                </div>

                <div>
                  <span>Stay / food / activities</span>
                  <strong>{money(tripCost * 0.45)} / {money(tripCost * 0.30)} / {money(tripCost * 0.15)}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section itinerary-section" id="itinerary">
  <div className="section-heading">
    <p className="eyebrow">YOUR PERSONAL TRAVEL PLAN</p>
    <h2>Your trip, day by day</h2>
    <p>
      Turn your travel duration and destination into a suggested itinerary.
    </p>
  </div>

  <div className="itinerary-panel">
    <div className="itinerary-summary">
      <div>
        <span>Destination</span>
        <strong>
          {activeDestinationName || "Not selected"}
        </strong>
      </div>

      <div>
        <span>Duration</span>
        <strong>{days} days</strong>
      </div>

      <div>
        <span>Travellers</span>
        <strong>{people}</strong>
      </div>

      <div>
        <span>Estimated budget</span>
        <strong>{money(tripCost)}</strong>
      </div>
    </div>

    <button
      type="button"
      className="primary-button"
      onClick={generateItinerary}
    >
      Generate my itinerary →
    </button>

    {itinerary.length > 0 && (
  <button
    type="button"
    className="secondary-button"
    onClick={saveItinerary}
    disabled={savingItinerary}
  >
    {savingItinerary ? "Saving..." : "Save itinerary"}
  </button>
)}

    {itineraryMessage && (
      <p className="message" role="status">
        {itineraryMessage}
      </p>
    )}

    {itinerary.length > 0 && (
      <div className="itinerary-list">
        {itinerary.map((item) => (
          <article className="itinerary-day" key={item.day}>
            <span className="itinerary-day-number">
              DAY {item.day}
            </span>

            <h3>{item.title}</h3>

            <ul>
              {item.activities.map((activity, index) => (
                <li key={`${item.day}-${index}`}>{activity}</li>
              ))}
            </ul>

            <p className="itinerary-tip">
              <strong>Travel tip:</strong> {item.tip}
            </p>
          </article>
        ))}
      </div>
    )}

    {packingList.length > 0 && (
      <aside className="packing-card">
        <div>
          <p className="eyebrow">READY-TO-PACK</p>
          <h3><Luggage size={20} /> Smart packing checklist</h3>
          <p className="muted">Built from your interests, transport, and the latest available weather.</p>
        </div>
        <ul className="packing-list">
          {packingList.map((entry, index) => (
            <li key={entry.item}>
              <label>
                <input
                  type="checkbox"
                  checked={entry.checked}
                  onChange={() => setPackingList((current) => current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, checked: !item.checked } : item
                  ))}
                />
                <span>{entry.item}</span>
              </label>
            </li>
          ))}
        </ul>
      </aside>
    )}

    <p className="muted">
      Activities are suggestions. Verify attraction opening hours,
      travel times, local conditions, and costs before travelling.
    </p>
  </div>
</section>

<div className="saved-itineraries">
  <div className="section-heading">
    <p className="eyebrow">YOUR SAVED TRIPS</p>
    <h2>My saved itineraries</h2>
    <p>Return to your saved travel plans whenever you need them.</p>
  </div>

  {savedItineraries.length === 0 ? (
    <p className="muted">
      You haven't saved any itineraries yet.
    </p>
  ) : (
    <div className="saved-itinerary-grid">
      {savedItineraries.map((saved) => (
        <article
          className="saved-itinerary-card"
          key={saved.id}
        >
          <h3>{saved.destinationName}</h3>

          <p>
            {saved.durationDays} days · {saved.travelers} traveller(s)
          </p>

          {(saved.tripStyle || saved.transportMode || saved.stayType) && (
            <p className="saved-trip-preferences">
              {[saved.tripStyle, saved.transportMode, saved.stayType]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}

          {saved.departureDate && (
            <p className="muted">Leaving {new Date(`${saved.departureDate}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          )}

          <p>
            Estimated total: {money(saved.estimatedTotal)}
          </p>

          <p className="muted">
            Saved:{" "}
            {saved.createdAt
              ? new Date(saved.createdAt).toLocaleString("en-IN")
              : "Date unavailable"}
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              try {
                setItinerary(
                  JSON.parse(saved.itineraryJson || "[]")
                );
                setDays(saved.durationDays);
                setPeople(saved.travelers);
                setDailyBudget(saved.dailyBudget);
                setTripDestination(saved.destinationName);
                setDepartureDate(saved.departureDate || "");
                setTripStyle(saved.tripStyle || "Balanced");
                setTransportMode(saved.transportMode || "Train");
                setStayType(saved.stayType || "Comfort");
                setPackingList([]);
                setItineraryMessage(
                  `Loaded your saved itinerary for ${saved.destinationName}.`
                );
                document
                  .getElementById("itinerary")
                  ?.scrollIntoView({ behavior: "smooth" });
              } catch {
                setItineraryMessage(
                  "This saved itinerary could not be loaded."
                );
              }
            }}
          >
            Load itinerary
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={async () => {
              const confirmed = window.confirm(
                `Delete the saved itinerary for ${saved.destinationName}?`
              );

              if (!confirmed) return;

              try {
                await request(`${API}/itineraries/${saved.id}`, {
                  method: "DELETE"
                });

                await loadSavedItineraries();
                setItineraryMessage("Saved itinerary deleted.");
              } catch (error) {
                setItineraryMessage(
                  error.message || "Could not delete the itinerary."
                );
              }
            }}
          >
            Delete
          </button>
        </article>
      ))}
    </div>
  )}
</div>

        <section className="section manage-section" id="manage">
          <div className="section-heading manage-heading">
            <div>
              <p className="eyebrow">YOUR DESTINATION LIBRARY</p>
              <h2>Manage destinations</h2>
              <p>
                Add, view, edit, and delete records stored in your database.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={openCreateForm}
            >
              <Plus size={18} /> Add destination
            </button>
          </div>

          <div className="library-controls" aria-label="Filter destinations">
            <label className="library-search">
              <Search size={18} />
              <input
                value={libraryQuery}
                onChange={(e) => setLibraryQuery(e.target.value)}
                placeholder="Search destinations, regions, or highlights"
              />
            </label>

            <label>
              <span className="visually-hidden">Category</span>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categoryOptions.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>

            <label>
              <span className="visually-hidden">Daily budget</span>
              <select value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)}>
                <option>All budgets</option>
                <option>Under ₹2,500</option>
                <option>₹2,500–₹4,000</option>
                <option>Above ₹4,000</option>
              </select>
            </label>

            <label>
              <SlidersHorizontal size={17} />
              <span className="visually-hidden">Sort destinations</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Recommended</option>
                <option>Top rated</option>
                <option>Budget: low to high</option>
                <option>Budget: high to low</option>
              </select>
            </label>

            <button
              type="button"
              className={showFavoritesOnly ? "favorites-filter active" : "favorites-filter"}
              onClick={() => setShowFavoritesOnly((current) => !current)}
              aria-pressed={showFavoritesOnly}
            >
              <Heart size={16} fill={showFavoritesOnly ? "currentColor" : "none"} />
              {showFavoritesOnly ? "Saved only" : "Show saved"}
            </button>
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="empty-state">
              <MapPin size={35} />
              <h3>{destinations.length === 0 ? "No saved destinations yet" : "No destinations match those filters"}</h3>
              <p>{destinations.length === 0 ? "Add a destination to begin building your library." : "Try clearing a filter or searching for something else."}</p>
            </div>
          ) : (
            <div className="destination-grid">
              {filteredDestinations.map((destination) => (
                <article className="destination-card" key={destination.id}>
                  {destination.imageUrl ? (
                    <img
                      className="destination-image"
                      src={destination.imageUrl}
                      alt={destination.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="destination-placeholder">
                      <Compass size={40} />
                    </div>
                  )}

                  <div className="destination-body">
                    <div className="destination-card-topline">
                      <span className="category-tag">
                        {destination.category || "Destination"}
                      </span>
                      <span className="rating"><Star size={15} fill="currentColor" /> {Number(destination.rating || 0).toFixed(1)}</span>
                    </div>

                    <h3>{destination.name}</h3>

                    <p className="muted">
                      {[destination.state, destination.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <p>{destination.description}</p>

                    {destination.highlights && (
                      <p className="destination-highlights"><strong>Don't miss:</strong> {destination.highlights}</p>
                    )}

                    {destination.bestSeason && (
                      <p className="best-season"><Sun size={15} /> Best time: {destination.bestSeason}</p>
                    )}

                    <div className="destination-bottom">
                      <strong>{money(destination.dailyCost)} / day</strong>

                      <div className="card-actions">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => openEditForm(destination)}
                          aria-label={`Edit ${destination.name}`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className={favoriteIds.includes(destination.id) ? "icon-button favorite-button is-favorite" : "icon-button favorite-button"}
                          onClick={() => toggleFavorite(destination.id)}
                          aria-label={`${favoriteIds.includes(destination.id) ? "Remove" : "Save"} ${destination.name} ${favoriteIds.includes(destination.id) ? "from" : "to"} favourites`}
                        >
                          <Heart size={17} fill={favoriteIds.includes(destination.id) ? "currentColor" : "none"} />
                        </button>

                        <button
                          type="button"
                          className="icon-button delete-button"
                          onClick={() => deleteDestination(destination)}
                          aria-label={`Delete ${destination.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <button type="button" className="plan-destination-button" onClick={() => chooseDestination(destination)}>
                      Plan this trip →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">
            <Compass size={20} />
          </span>
          <span>tripgenie<span className="brand-dot">.</span></span>
        </a>

        <p>Explore thoughtfully. Travel within your budget.</p>
      </footer>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-form-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">DESTINATION DETAILS</p>
                <h2 id="destination-form-title">
                  {editingId !== null
                    ? "Edit destination"
                    : "Add destination"}
                </h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowForm(false)}
                type="button"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="destination-form" onSubmit={saveDestination}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="dest-name">Destination name *</label>
                  <input
                    id="dest-name"
                    required
                    maxLength="100"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="dest-state">State / region *</label>
                  <input
                    id="dest-state"
                    required
                    maxLength="100"
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="dest-country">Country</label>
                  <input
                    id="dest-country"
                    maxLength="100"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="dest-category">Category</label>
                  <select
                    id="dest-category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option>Nature</option>
                    <option>Beach</option>
                    <option>Adventure</option>
                    <option>Heritage</option>
                    <option>City</option>
                    <option>Culture</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="dest-cost">Estimated daily cost (₹)</label>
                  <input
                    id="dest-cost"
                    type="number"
                    min="0"
                    max="1000000"
                    required
                    value={form.dailyCost}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dailyCost: e.target.value
                      })
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="dest-rating">Traveller rating (1–5)</label>
                  <input
                    id="dest-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="dest-season">Best time to visit</label>
                  <input
                    id="dest-season"
                    maxLength="120"
                    placeholder="e.g. October to March"
                    value={form.bestSeason}
                    onChange={(e) =>
                      setForm({ ...form, bestSeason: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label htmlFor="dest-image">Image URL (optional)</label>
                  <input
                    id="dest-image"
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="dest-highlights">Highlights</label>
                <input
                  id="dest-highlights"
                  maxLength="500"
                  placeholder="e.g. Tea gardens, viewpoints, local food"
                  value={form.highlights}
                  onChange={(e) =>
                    setForm({ ...form, highlights: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="dest-description">Description</label>
                <textarea
                  id="dest-description"
                  rows="3"
                  maxLength="1000"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Save changes"
                    : "Create destination"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
