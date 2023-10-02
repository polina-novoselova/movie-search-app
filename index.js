const inputMovieAdderNode = document.getElementById("inputMovieAdder");
const btnAddMovieNode = document.getElementById("btnAddMovie");
const moviesNode = document.getElementById("movie-items");

let movies = [];

init();

const getMovie = async (filmName) => {
  
  try {
    const response = await fetch(`https://www.omdbapi.com/?t=${filmName}&apikey=6152c476`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const {
      Title,
      imdbID,
      Year,
      Country,
      Genre,
      Director,
      Type,
      imdbRating,
      Poster
    } = data;

    setMovie(data);
    console.log(data);
    renderMovies();
    saveMoviesToStorage();
    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }

};

async function addMovie() {
  const filmName = getMovieNameFromUser();

  if (await validateTitle(filmName)) {
    try {
      await getMovie(filmName);
      clearInput();
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please, enter the correct movie title");
  }

};

function getMovieNameFromUser() {
  const filmName = inputMovieAdderNode.value;
  return filmName;
};

function setMovie(data) {
  movies.push({
    name: data.Title,
    id: data.imdbID,
    year: data.Year,
    country: data.Country,
    genre: data.Genre,
    director: data.Director,
    type: data.Type,
    rating: data.imdbRating,
    poster: data.Poster,
  });
};

function saveMoviesToStorage() {
  localStorage.setItem("movies", JSON.stringify(movies));
};

function getMoviesFromStorage() {
  const savedMovies = localStorage.getItem("movies");
  if (savedMovies) {
    movies = JSON.parse(savedMovies);
  }
};

function clearInput() {
  inputMovieAdderNode.value = "";
};

function renderMovies() {
  moviesNode.innerHTML = "";
  movies.forEach((movie) => {
    const movieItem = document.createElement("li");
    movieItem.className = "movie-item";
    movieItem.setAttribute("id", movie.id);

    const poster = document.createElement("img");
    poster.className = "poster";
    poster.setAttribute("src", movie.poster);
    poster.setAttribute("alt", "movie poster");

    const infoBlock = document.createElement("div");
    infoBlock.className = "info-block";

    const movieInfo = document.createElement("div");
    movieInfo.className = "movie-info";

    const movieName = document.createElement("h2");
    movieName.className = "movie-name";
    movieName.innerHTML = movie.name;

    const year = document.createElement("p");
    year.className = "year";
    year.innerHTML = movie.year;

    const about = document.createElement("p");
    about.className = "about";
    about.innerHTML = `${movie.country} • ${movie.genre}`;

    const director = document.createElement("p");
    director.className = "director";
    director.innerHTML = `Director: ${movie.director}`;

    const type = document.createElement("p");
    type.className = "type";
    type.innerHTML = `Category: ${movie.type}`;
    

    const secondBlock = document.createElement("div");
    secondBlock.className = "second-block";

    const deleteItemBtn = document.createElement("button");
    deleteItemBtn.className = "btn-delete-item";
    deleteItemBtn.setAttribute("id", movie.id);
    deleteItemBtn.setAttribute("title", "Delete");

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.innerHTML = `IMDb: ${movie.rating}`;

    movieItem.appendChild(poster);
    movieItem.appendChild(infoBlock);
    infoBlock.appendChild(movieInfo);
    movieInfo.appendChild(movieName); 
    movieInfo.appendChild(year);
    movieInfo.appendChild(about);
    movieInfo.appendChild(director);
    movieInfo.appendChild(type);
    movieItem.appendChild(secondBlock); 
    secondBlock.appendChild(deleteItemBtn);
    secondBlock.appendChild(rating);    

    moviesNode.appendChild(movieItem);
  });
};

function init() {
  getMoviesFromStorage();
  renderMovies();
};


function deleteMovie(event) {
  if (event.target.classList.contains("btn-delete-item")) {

    const parentNode = event.target.closest(".movie-item");
    const idParentNode = parentNode.id;

    const index = movies.findIndex(movie => movie.id === idParentNode);

    movies.splice(index, 1);
    parentNode.remove();
    saveMoviesToStorage();
  }
};

async function validateTitle(title) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=6152c476`);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    if (!data.Title || data.Title.trim() === "") {
      return false;
    }

    return true; 
  } catch (error) {
    console.error(error);
    return false;
  }
}

function handlerKeyDown(event) {

  if (event.key == "Enter") {
    addMovie();
  }
};

// function reedMore(event) {
//  открытие попапа с инфой о фильме
// };

btnAddMovieNode.addEventListener("click", addMovie);
moviesNode.addEventListener("click", deleteMovie);
// moviesNode.addEventListener("click", reedMore);
inputMovieAdderNode.addEventListener("keydown", handlerKeyDown);