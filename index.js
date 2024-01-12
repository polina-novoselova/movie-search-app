const inputMovieAdderNode = document.getElementById("inputMovieAdder");
const btnAddMovieNode = document.getElementById("btnAddMovie");
const moviesNode = document.getElementById("movie-items");
const searchList = document.getElementById("search-list");

let dataSearch = [];
let currentFocus = -1;
let items;
let movies = [];
init();

//Code for searching

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=6152c476`;

  const res = await fetch(URL);
  const data = await res.json();

  if (data.Response === "True") {
    dataSearch = data.Search;
  }
}

function findMovies() {
  const searchTerm = inputMovieAdderNode.value.trim();
  console.log("Search Term:", searchTerm);

  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
    displayMovieSearchList(dataSearch);
    items = searchList.querySelectorAll('.search-list__item');
  } else {
    searchList.classList.add("hide-search-list");
    items = [];
  }
}

function displayMovieSearchList(dataSearch) {
  searchList.innerHTML = "";
  searchList.scrollTop = 0;

  for (let i = 0; i < dataSearch.length; i++) {
    let movieSearchListItem = document.createElement("li");
    movieSearchListItem.dataset.id = dataSearch[i].imdbID;
    movieSearchListItem.classList.add("search-list__item");

    let movieSearchPoster;

    if (dataSearch[i].Poster !== "N/A") {
      movieSearchPoster = dataSearch[i].Poster;
    } else {
      movieSearchPoster = "resources/image-not-found.png";
    }

    movieSearchListItem.innerHTML = `
      <div class="search-list__thumbnail">
        <img src="${movieSearchPoster}">
      </div>
      <div class="search-item__info">
        <h3>${dataSearch[i].Title}</h3>
        <p>${dataSearch[i].Year}</p>
        <p>${dataSearch[i].Type}</p>
      </div>
    `;

    searchList.appendChild(movieSearchListItem);
  }

  items = searchList.querySelectorAll('.search-list__item');
  setActiveItem(currentFocus, items);
  console.log("Displaying movie search list with items:", items);
}

function setActiveItem(index, items) {
  if (index >= 0 && index < items.length) {
    if (currentFocus > -1 && currentFocus < items.length) {
      items[currentFocus].classList.remove("active");
      console.log("Removed class 'active' from element:", items[currentFocus]);
    }

    currentFocus = index;
    items[index].classList.add("active");
    console.log("Added class 'active' to element:", items[index]);

    // Прокручиваем окно, чтобы активный элемент был виден
    const activeItem = items[currentFocus];
    if (activeItem) {
      const itemRect = activeItem.getBoundingClientRect();
      const searchListRect = searchList.getBoundingClientRect();

      if (itemRect.bottom > searchListRect.bottom) {
        searchList.scrollTop += itemRect.bottom - searchListRect.bottom;
      } else if (itemRect.top < searchListRect.top) {
        searchList.scrollTop -= searchListRect.top - itemRect.top;
      }
    }
  }
}

inputMovieAdderNode.addEventListener("input", function () {
  findMovies();
});

inputMovieAdderNode.addEventListener("keydown", function (event) {
  console.log("Current Focus (before):", currentFocus);
  console.log("Items:", items);

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    if (searchList.classList.contains("hide-search-list")) {
      return;
    }

    event.preventDefault();

    if (items.length > 0) {
      if (currentFocus === -1) {
        currentFocus = 0;
      } else {
        currentFocus = (currentFocus + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      }

      setActiveItem(currentFocus, items);

      const activeItem = items[currentFocus];
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
        });
      }

      console.log("Current Focus (during):", currentFocus);
    }
  } else if (event.key === "Enter") {
    if (currentFocus !== -1) {
      const selectedMovie = dataSearch.find((movie) => movie.imdbID === items[currentFocus].dataset.id);
      if (selectedMovie) {
        inputMovieAdderNode.value = selectedMovie.Title;
        searchList.classList.add("hide-search-list");
        currentFocus = -1;

        inputMovieAdderNode.blur();
      }
    }
  }

  console.log("Current Focus (after):", currentFocus);
});

searchList.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    const selectedMovie = dataSearch.find((movie) => movie.imdbID === event.target.dataset.id);
    if (selectedMovie) {
      inputMovieAdderNode.value = selectedMovie.Title;
      searchList.classList.add("hide-search-list");
      currentFocus = -1;
    }
  }
});

// Добавлены дополнительные обработчики для скрытия списка при потере фокуса и клике вне списка
document.addEventListener("click", function (event) {
  if (!searchList.contains(event.target) && !inputMovieAdderNode.contains(event.target)) {
    searchList.classList.add("hide-search-list");
    currentFocus = -1;
  }
});

inputMovieAdderNode.addEventListener("blur", function () {
  setTimeout(() => {
    if (!searchList.contains(document.activeElement)) {
      searchList.classList.add("hide-search-list");
      currentFocus = -1;
    }
  }, 200);
});

// my code for movie list

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

btnAddMovieNode.addEventListener("click", addMovie);
moviesNode.addEventListener("click", deleteMovie);
inputMovieAdderNode.addEventListener("keydown", handlerKeyDown);