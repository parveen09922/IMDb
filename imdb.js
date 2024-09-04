// Global variable to keep track of favorite movies
let favoriteMovies = [];

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById("main");
  const input = document.getElementById("input");
  const favoritesSection = document.getElementById("favoritesSection");
  const homeLink = document.getElementById("homeLink");
  const favoritesLink = document.getElementById("favoritesLink");
  const suggestionsBox = document.createElement('div');
  suggestionsBox.classList.add('suggestions-box');
  input.parentNode.appendChild(suggestionsBox);

  // Initialize the input movie function
  inputMovie();

  // Initialize the "Favorites" and "Home" navigation buttons
  initializeFavoritesButton();
  initializeHomeButton();

  // Initialize suggestion input
  initializeInputSuggestions();

  // Function to initialize input movie functionality
  function inputMovie() {
    const inputButton = document.getElementById("inputButton");

    inputButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent form submission
      const name = input.value; // Get the value from the input field
      if (!name) {
        alert('Please enter a movie name!');
        return;
      }
      await fetchMovies(name);
    });
  }

  // Function to fetch movies and display them
  async function fetchMovies(name) {
    const url = `https://www.omdbapi.com/?apikey=3b0ae308&s=${name}`;

    try {
      // Fetch movies matching the search keyword
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Response === "True") {
        displayMovies(data.Search); // Display the movies found
      } else {
        main.innerHTML = `<p class="text-center">No movies found. Try a different search.</p>`;
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      main.innerHTML = `<p class="text-center text-danger">Error fetching movies. Please try again later.</p>`;
    }
  }

  // Function to display movies in the main section
  function displayMovies(movies) {
    main.innerHTML = ''; // Clear previous results
    favoritesSection.classList.add('d-none'); // Hide favorites section
    main.classList.remove('d-none'); // Show main section

    const row = document.createElement('div'); // Create a row element
    row.classList.add('row', 'gy-4', 'justify-content-center'); // Add Bootstrap row class with gutter spacing

    movies.forEach((movie) => {
      const movieCol = document.createElement('div'); // Create a column element
      movieCol.classList.add('col-md-4', 'd-flex', 'justify-content-center'); // Use Bootstrap's grid system for column layout

      // Check if the movie is already in favorites
      const isFavorite = favoriteMovies.some(fav => fav.imdbID === movie.imdbID);

      movieCol.innerHTML = `
        <div class="card h-100">
          <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title} poster">
          <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <p class="card-text">Year: ${movie.Year}</p>
            <a href="#" class="btn btn-primary mb-2" onclick="getMovieDetails('${movie.imdbID}')">View Details</a>
            <button class="btn ${isFavorite ? 'btn-danger' : 'btn-success'}" onclick="toggleFavorite('${movie.imdbID}')">
              ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      `;

      row.appendChild(movieCol); // Append column to the row
    });

    main.appendChild(row); // Append the row to the main container
  }

  // Function to initialize the "Favorites" button
  function initializeFavoritesButton() {
    favoritesLink.addEventListener('click', () => {
      main.classList.add('d-none'); // Hide the main section
      favoritesSection.classList.remove('d-none'); // Show the favorites section
      displayFavorites(); // Display favorite movies
    });
  }

  // Function to initialize the "Home" button
  function initializeHomeButton() {
    homeLink.addEventListener('click', () => {
      favoritesSection.classList.add('d-none'); // Hide the favorites section
      main.classList.remove('d-none'); // Show the main section
    });
  }

  // Initialize input suggestions
  function initializeInputSuggestions() {
    input.addEventListener('input', async () => {
      const query = input.value;
      if (query.length < 3) {
        suggestionsBox.innerHTML = ''; // Clear suggestions if input is too short
        return;
      }

      const url = `https://www.omdbapi.com/?apikey=3b0ae308&s=${query}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.Response === "True") {
          displaySuggestions(data.Search);
        } else {
          suggestionsBox.innerHTML = '<p class="text-center">No suggestions available.</p>';
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsBox.innerHTML = '<p class="text-center text-danger">Error fetching suggestions.</p>';
      }
    });
  }

  // Function to display movie suggestions
  function displaySuggestions(suggestions) {
    suggestionsBox.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(movie => {
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.textContent = `${movie.Title} (${movie.Year})`;
      suggestionItem.addEventListener('click', () => {
        input.value = movie.Title; // Autofill the input field
        suggestionsBox.innerHTML = ''; // Clear suggestions
        fetchMovies(movie.Title); // Trigger search
      });

      suggestionsBox.appendChild(suggestionItem);
    });
  }
});

// Function to display favorite movies
function displayFavorites() {
  const favoritesSection = document.getElementById("favoritesSection");
  favoritesSection.innerHTML = ''; // Clear previous results

  const row = document.createElement('div'); // Create a row element
  row.classList.add('row', 'gy-4', 'justify-content-center'); // Add Bootstrap row class with gutter spacing

  favoriteMovies.forEach((movie) => {
    const movieCol = document.createElement('div'); // Create a column element
    movieCol.classList.add('col-md-4', 'd-flex', 'justify-content-center'); // Use Bootstrap's grid system for column layout

    movieCol.innerHTML = `
      <div class="card h-100">
        <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title} poster">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">Year: ${movie.Year}</p>
          <a href="#" class="btn btn-primary mb-2" onclick="getMovieDetails('${movie.imdbID}')">View Details</a>
          <button class="btn btn-danger" onclick="toggleFavorite('${movie.imdbID}')">Remove from Favorites</button>
        </div>
      </div>
    `;

    row.appendChild(movieCol); // Append column to the row
  });

  favoritesSection.appendChild(row); // Append the row to the favorites container
}

// Function to add or remove movies from favorites
function toggleFavorite(imdbID) {
  const movieIndex = favoriteMovies.findIndex(movie => movie.imdbID === imdbID);
  if (movieIndex === -1) {
    // Fetch movie details and add to favorites if not already added
    fetch(`https://www.omdbapi.com/?apikey=3b0ae308&i=${imdbID}`)
      .then(response => response.json())
      .then(movie => {
        favoriteMovies.push(movie);
        alert(`${movie.Title} has been added to your favorites!`);
        displayFavorites(); // Update the favorites display
      })
      .catch(error => console.error('Error fetching movie details:', error));
  } else {
    // Remove from favorites
    const removedMovie = favoriteMovies.splice(movieIndex, 1)[0];
    alert(`${removedMovie.Title} has been removed from your favorites!`);
    displayFavorites(); // Update the favorites display
  }
}

// Function to get and display movie details by IMDb ID
async function getMovieDetails(imdbID) {
  const url = `https://www.omdbapi.com/?apikey=3b0ae308&i=${imdbID}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    alert(`Title: ${data.Title}\nYear: ${data.Year}\nPlot: ${data.Plot}`);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}
