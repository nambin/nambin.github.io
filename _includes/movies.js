// _includes/movies.js

function initMovieFilter() {
  const movieCards = document.querySelectorAll('.movie-card');

  function filterMoviesByDirector(director) {
    movieCards.forEach(card => {
      if (card.getAttribute('data-director') === director) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /**
   * When the page is loaded with a director query parameter, filters the movie list accordingly.
   */
  function applyFilterFromURL() {
    const params = new URLSearchParams(window.location.search);
    const directorParam = params.get('director');

    if (directorParam) {
      const decodedDirector = decodeURIComponent(directorParam);
      filterMoviesByDirector(decodedDirector);
    }
  }

  applyFilterFromURL();
}

initMovieFilter();

// document.addEventListener('DOMContentLoaded', () => {
//   initMovieFilter();
// });