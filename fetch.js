function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

window.addEventListener(
  "resize",
  debounce(() => {
    const swiperContainer = document.querySelector(".slider-track");
    swiperContainer.innerHTML = "";
    getBestRatedMovies();
  }, 200)
);

document.getElementById("hero-detail-btn").addEventListener("click", async () => {
  try {
    const resp = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    const response = await resp.json();
    const bestMovie = response.results[0];

    const detailResp = await fetch(`http://localhost:8000/api/v1/titles/${bestMovie.id}`);
    const detailData = await detailResp.json();

    document.getElementById("TitleFilmMoment-modal").textContent = detailData.title;
    document.getElementById("filmMoment-modal").src = detailData.image_url || "./img/DefaultImg.webp";
    document.getElementById("description-modal").textContent = detailData.description || "No description available.";
    document.getElementById("year-film-modal").textContent = detailData.year;
    document.getElementById("acteur-modal").textContent = detailData.actors;
    const genresString = detailData.genres.join(" - ");
    document.getElementById("genre-film-modal").textContent = genresString;

    const scoreElementModal = document.getElementById("score-film-modal");
    scoreElementModal.innerHTML = `
      <img src="img/material-symbols--star.svg" alt="Star" style="width: 15px; height: 15px;">
      ${detailData.imdb_score}
    `;

    document.getElementById("direction-film-modal").textContent = detailData.directors;

    const modal = document.querySelector(".modal-hero");
    modal.classList.remove("modal-hero-closed");
    modal.classList.add("modal-hero-open");
  } catch (error) {
    console.error("Error al cargar detalles de la película destacada:", error);
  }
});

// MODAL PARA TODDAS LAS CARDS

document.addEventListener("click", async (event) => {
  const card = event.target.closest(".card-single");

  if (card && card.hasAttribute("data-movie-id")) {
    const movieId = card.getAttribute("data-movie-id");

    try {
      const resp = await fetch(`http://localhost:8000/api/v1/titles/${movieId}`);
      const data = await resp.json();

      document.getElementById("TitleFilmMoment-modal").textContent = data.title;
      document.getElementById("filmMoment-modal").src = data.image_url || "./img/DefaultImg.webp";
      document.getElementById("description-modal").textContent = data.description;
      document.getElementById("year-film-modal").textContent = data.year;
      document.getElementById("acteur-modal").textContent = data.actors;

      const genresString = data.genres.join(" - ");
      document.getElementById("genre-film-modal").textContent = genresString;

      const scoreElementModal = document.getElementById("score-film-modal");
      scoreElementModal.innerHTML = `
      <img src="img/material-symbols--star.svg" alt="Star" style="width: 15px; height: 15px;">
      ${data.imdb_score}
      `;

      document.getElementById("direction-film-modal").textContent = data.directors;

      const modal = document.querySelector(".modal-hero");
      modal.classList.remove("modal-hero-closed");
      modal.classList.add("modal-hero-open");
    } catch (error) {
      console.error("Error al cargar detalles de la película:", error);
    }
  }
});

// MODAL PARA TODDAS LAS CARDS

async function getAllGenres() {
  try {
    const resp = await fetch("http://localhost:8000/api/v1/genres/");
    let response = await resp.json();
    let allGenres = [];

    while (true) {
      const genres = response.results.map((genre) => genre.name);
      allGenres.push(...genres);

      if (response.next) {
        const nextResp = await fetch(response.next);
        response = await nextResp.json();
      } else {
        break;
      }
    }

    return allGenres;
  } catch (error) {
    console.error("Error fetching all genres:", error);
  }
}

document.addEventListener("DOMContentLoaded", getAllGenres);

async function getSixGenre() {
  try {
    const resp = await fetch("http://localhost:8000/api/v1/genres/");
    let response = await resp.json();
    let allGenres = [];

    while (true) {
      const genres = response.results.map((genre) => genre.name);
      allGenres.push(...genres);

      if (response.next) {
        const nextResp = await fetch(response.next);
        response = await nextResp.json();
      } else {
        break;
      }
    }

    const validGenres = [];

    for (const genre of allGenres) {
      const resp = await fetch(`http://localhost:8000/api/v1/titles/?genre=${genre}&page_size=6`);
      const data = await resp.json();

      if (data.results.length === 6) {
        validGenres.push(genre);
      }
    }

    return validGenres;
  } catch (error) {
    console.error("Error fetching genres with at least 6 movies:", error);
    return [];
  }
}

async function getTopMovie() {
  try {
    const resp = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    const response = await resp.json();

    if (response.results.length > 0) {
      TopOneMovie = response.results[0];
      return TopOneMovie;
    }
  } catch (error) {
    console.error("Error fetching top movie:", error);
  }
}

// HERO SECTION
async function getBestMovie() {
  try {
    const bestMovie = await getTopMovie();

    const detailleFilm = await fetch(`http://localhost:8000/api/v1/titles/${bestMovie.id}`);
    const detailleFilmJson = await detailleFilm.json();

    document.getElementById("TitleFilmMoment").textContent = bestMovie.title;
    document.getElementById("filmMoment").src = bestMovie.image_url;
    document.getElementById("filmMoment").alt = bestMovie.title;
    document.getElementById("year-film").textContent = bestMovie.year;
    document.getElementById("genre-film").textContent = bestMovie.genres;

    const scoreElement = document.getElementById("score-film-span");
    scoreElement.textContent = bestMovie.imdb_score;

    document.getElementById("direction-film").textContent = bestMovie.directors;

    const scoreElementModal = document.getElementById("score-film-modal");
    scoreElementModal.innerHTML = `
      <img src="img/material-symbols--star.svg" alt="Star" style="width: 15px; height: 15px;">
      ${bestMovie.imdb_score}
    `;

    document.getElementById("direction-film-modal").textContent = bestMovie.directors;
  } catch (error) {
    console.error("Error al obtener la mejor película:", error);
  }
}

document.addEventListener("DOMContentLoaded", getBestMovie);

async function getBestRatedMovies() {
  try {
    const resp = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
    const response = await resp.json();

    const track = document.querySelector(".slider-track");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    track.innerHTML = "";

    const bestMovie = await getTopMovie();
    const films = [];

    for (let film of response.results) {
      if (film.id !== bestMovie.id) {
        films.push(film);
      }
      if (films.length === 6) break;
    }

    let nextUrl = response.next;
    while (films.length < 6 && nextUrl) {
      const nextResp = await fetch(nextUrl);
      const nextData = await nextResp.json();
      for (let film of nextData.results) {
        if (film.id !== bestMovie.id) {
          films.push(film);
        }
        if (films.length === 6) break;
      }
      nextUrl = nextData.next;
    }

    let groupSize;
    if (window.innerWidth < 1024) {
      groupSize = 2;
    } else {
      groupSize = 3;
    }

    const totalSlides = Math.ceil(films.length / groupSize);
    const imgUrlDefault = "./img/DefaultImg.webp";
    for (let i = 0; i < totalSlides; i++) {
      const slide = document.createElement("div");
      slide.classList.add("slide");

      for (let j = i * groupSize; j < (i + 1) * groupSize && j < films.length; j++) {
        const film = films[j];

        const card = document.createElement("div");
        card.classList.add("card-single");

        card.innerHTML = `
        <img src="${film.image_url || imgUrlDefault}" alt="${film.title}" onerror="this.onerror=null; this.src='${imgUrlDefault}'">
        <div class="overlay">
            <span>
                <img src="img/material-symbols--star.svg" alt="Star" style="width: 16px; height: 16px;">
                ${film.imdb_score}
            </span>
            <h3 class="title-categorie-1">${film.title}</h3>
        </div>
        `;

        card.setAttribute("data-movie-id", film.id);
        slide.appendChild(card);
      }

      track.appendChild(slide);
    }

    let currentIndex = 0;

    function updateSlider() {
      const slideWidth = track.querySelector(".slide").offsetWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    nextBtn.addEventListener("click", () => {
      const maxIndex = totalSlides - 1;
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

    updateSlider();
  } catch (error) {
    console.error("Error al cargar películas mejor puntuadas:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getBestRatedMovies();
  getBestMovie();
});

/// FUNCION CON PARA METROS PARA RECUPERAR PELICULAS POR GENERO
async function getMoviesByGenre(genre) {
  try {
    const resp = await fetch(`http://localhost:8000/api/v1/titles/?genre=${genre}&page_size=6`);
    const respGenre = await resp.json();

    return respGenre;
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error);
  }
}

async function getSixMovie(response) {
  listeFilms = [];

  const nextUrl = response.next;

  while (listeFilms.length < 6) {
    for (const film of response.results) {
      if (listeFilms.length < 6) {
        listeFilms.push(film);
      } else {
        break;
      }
    }

    if (listeFilms.length < 6 && nextUrl) {
      const nextResp = await fetch(nextUrl);
      const nextResponse = await nextResp.json();

      for (const film of nextResponse.results) {
        if (listeFilms.length < 6) {
          listeFilms.push(film);
        } else {
          break;
        }
      }
    }
  }
  return listeFilms;
}

async function getMovieGenre() {
  try {
    Genres = await getSixGenre();

    let x = 1;

    genreSelect = [];

    const imgUrlDefault = "./img/DefaultImg.webp";

    while (x <= 3) {
      let randomGenre = Genres[Math.floor(Math.random() * Genres.length)];
      if (genreSelect.includes(randomGenre)) {
        randomGenre = Genres[Math.floor(Math.random() * Genres.length)];
      }
      const resp = await fetch(`http://localhost:8000/api/v1/titles/?genre=${randomGenre}&page_size=6`);
      const respGenre = await resp.json();
      sixMovie = await getSixMovie(respGenre);

      genreSelect.push(randomGenre);

      document.querySelector(`.genre-${x} h2`).textContent = randomGenre;
      let cardElements = document.querySelectorAll(`.categorie-${x} .card-single`);

      x++;

      sixMovie.forEach((film, index) => {
        if (film.image_url === undefined) {
          film.image_url = "./img/DefaultImg.webp";
        }

        const card = cardElements[index];

        if (card) {
          card.innerHTML = `
              <img src="${film.image_url}" alt="${film.title}" onerror="this.onerror=null; this.src='${imgUrlDefault}'">
              <div class="overlay">
                  <span>
                      <img src="img/material-symbols--star.svg" alt="Star" style="width: 16px; height: 16px;">
                      ${film.imdb_score}
                  </span>
                  <h3 class="title-categorie-1">${film.title}</h3>
              </div>
          `;
          card.setAttribute("data-movie-id", film.id);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching  movies:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getMovieGenre();
});

async function initializeSelect1() {
  const selectElement = document.getElementById("select-categorie");
  const allGenres = await getAllGenres();

  if (allGenres.length > 0) {
    const defaultGenre = allGenres[0];

    for (let genre of allGenres) {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      if (genre === defaultGenre) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    }

    viewFilmSelect(defaultGenre, ".categorie-select");
  }

  selectElement.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    viewFilmSelect(selectedCategory, ".categorie-select");
  });
}

async function initializeSelect2() {
  const selectElement = document.getElementById("select-categorie-2");
  const allGenres = await getAllGenres();

  if (allGenres.length > 0) {
    const defaultGenre = allGenres[0];

    for (let genre of allGenres) {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      if (genre === defaultGenre) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    }

    viewFilmSelect(defaultGenre, ".categorie-select-2");
  }

  selectElement.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    viewFilmSelect(selectedCategory, ".categorie-select-2");
  });
}

// Boton show more

function setupShowMore() {
  const sections = document.querySelectorAll(".sec");

  sections.forEach((section) => {
    const existingBtn = section.querySelector(".btn-show-more");
    if (existingBtn) {
      existingBtn.remove();
    }

    const hiddenCards = section.querySelectorAll(".card-single.show");

    if (hiddenCards.length === 0) return;

    const showMoreBtn = document.createElement("button");
    showMoreBtn.className = "btn-show-more";
    showMoreBtn.textContent = "Show More";

    showMoreBtn.addEventListener("click", () => {
      hiddenCards.forEach((item) => {
        item.classList.toggle("show-more");
      });

      showMoreBtn.textContent = showMoreBtn.textContent === "Show More" ? "Show Less" : "Show More";
    });

    section.appendChild(showMoreBtn);
  });
}

setupShowMore();

async function viewFilmSelect(category, containerSelector) {
  try {
    const respCategorie = await getMoviesByGenre(category);
    const boxCard = document.querySelector(`${containerSelector} .box-card`);
    const imgUrlDefault = "./img/DefaultImg.webp";

    boxCard.innerHTML = "";

    for (let i = 0; i < Math.min(6, respCategorie.results.length); i++) {
      const film = respCategorie.results[i];

      const card = document.createElement("div");
      card.classList.add("card-single", "card-film4");

      if (i >= 4) {
        card.classList.add("show");
      }

      card.innerHTML = `
        <img src="${film.image_url || imgUrlDefault}" alt="${film.title}" 
             onerror="this.onerror=null; this.src='${imgUrlDefault}'">
      `;

      card.setAttribute("data-movie-id", film.id);
      boxCard.appendChild(card);
    }

    setupShowMore();
  } catch (error) {
    console.error(`Error mostrando películas para la categoría ${category}:`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSelect1();
  initializeSelect2();
});
