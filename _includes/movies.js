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

function initLazyImagesLoader() {
  const lazyImages = document.querySelectorAll('img.lazy');

  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // For old browsers which doesn't support Intersection Observer.
    lazyImages.forEach(lazyImage => {
      lazyImage.src = lazyImage.dataset.src;
    });
  }
}

initMovieFilter();
initLazyImagesLoader();