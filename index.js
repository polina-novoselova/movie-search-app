const inputMovieAdderNode = document.getElementById("inputMovieAdder");
const btnAddMovieNode = document.getElementById("btnAddMovie");
const moviesListNode = document.getElementById("movie-items");

let moviesList = [];

init();

function addMovie() {
  const filmName = getMovieNameFromUser();
  const movieId = moviesList.length + 1;

  if (!validate(filmName)) {
    alert("Пожалуйста, введите корректное название фильма (не более 50 символов).");
    return;
  }

  setMovie(filmName, movieId);
  saveMoviesToStorage();
  clearInput();
  renderMovies();
};

function getMovieNameFromUser() {
  const filmName = inputMovieAdderNode.value;
  return filmName;
};

function setMovie(filmName, movieId) {
  moviesList.push({
    name: filmName,
    id: movieId,
    checked: false,
  });
};

function saveMoviesToStorage() {
  localStorage.setItem("movies", JSON.stringify(moviesList));
};

function getMoviesFromStorage() {
  const savedMovies = localStorage.getItem("movies");
  if (savedMovies) {
    moviesList = JSON.parse(savedMovies);
  }
};

function clearInput() {
  inputMovieAdderNode.value = "";
};

function renderMovies() {
  moviesListNode.innerHTML = "";
  moviesList.forEach((movie) => {
    const movieItem = document.createElement("li");
    movieItem.className = "movie-item";
    movieItem.setAttribute("id", movie.id);

    const movieCheckbox = document.createElement("input");
    movieCheckbox.className = "checkbox";
    movieCheckbox.setAttribute("type", "checkbox");
    movieCheckbox.setAttribute("checked", "false");
    movieCheckbox.checked = movie.checked;

    const fakecheckbox = document.createElement("span");
    fakecheckbox.className = "fakecheckbox";
    fakecheckbox.checked = movie.checked;

    const movieLabel = document.createElement("label");
    movieLabel.className = "label";

    const movieName = document.createElement("span");
    movieName.className = "movie-name";
    movieName.innerHTML = movie.name;

    const deleteMovieBtn = document.createElement("button");
    deleteMovieBtn.className = "btn-delete-item";
    deleteMovieBtn.setAttribute("id", movie.id);
    deleteMovieBtn.setAttribute("title", "Удалить");

    movieLabel.appendChild(movieCheckbox);
    movieItem.appendChild(movieLabel);
    movieLabel.appendChild(fakecheckbox); 
    movieLabel.appendChild(movieName);
    movieItem.appendChild(deleteMovieBtn);

    moviesListNode.appendChild(movieItem);
  });
};

function init() {
  getMoviesFromStorage();
  renderMovies();
};


function deleteMovie(event) {
  if (event.target.classList.contains("btn-delete-item")) {
    const parentNode = event.target.closest(".movie-item");

    const idParentNode = Number(parentNode.id);

    const index = moviesList.findIndex(function (movie) {
      if (movie.id === idParentNode) {
        return true;
      }
    });

    moviesList.splice(index, 1);

    parentNode.remove();

    saveMoviesToStorage();
  }
};

function checkedMovie(event) {
  if (event.target.classList.contains("label")) {
    const parentNode = event.target.closest(".movie-item");

    const idParentNode = Number(parentNode.id);

    const index = moviesList.findIndex(function (movie) {
      if (movie.id === idParentNode) {
        return true;
      }
    });

    if (moviesList[index].checked === true) {
      moviesList[index].checked = false;
    } else {
      moviesList[index].checked = true;
    }
    
    saveMoviesToStorage();
  }
};

function validate(filmName) {
  if (!filmName) {
    return false;
  }

  if (filmName.length > 50) {
    return false;
  }

  if (!filmName.trim()) {
    return false;
  }

  return true;
}

function handlerKeyDown(event) {

  if (event.key == "Enter") {
    
    addMovie();
  }
}

btnAddMovieNode.addEventListener("click", addMovie);
moviesListNode.addEventListener("click", deleteMovie);
moviesListNode.addEventListener("click", checkedMovie);
inputMovieAdderNode.addEventListener("keydown", handlerKeyDown);