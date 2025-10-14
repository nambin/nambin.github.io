// _includes/movies.js

function initMovieFilter() {
  const movieCards = document.querySelectorAll('.movie-card');

  function filterMovies(director, masterpiece, myBest, award) {
    movieCards.forEach(card => {
      let shouldShow = true;
      if (director && card.getAttribute('data-director') !== director) {
        shouldShow = false;
      }
      if (masterpiece && !card.getAttribute('data-masterpiece')) {
        shouldShow = false;
      }
      if (myBest && (!card.getAttribute('data-my-best') && !card.getAttribute('data-masterpiece'))) {
        shouldShow = false;
      }
      const awardsAttr = card.getAttribute('data-awards');
      if (award && (!awardsAttr || !awardsAttr.includes(award))) {
        shouldShow = false;
      }

      card.style.display = shouldShow ? 'flex' : 'none';
    });
  }

  /**
   * When the page is loaded with a director query parameter, filters the movie list accordingly.
   */
  function applyFilterFromURL() {
    const params = new URLSearchParams(window.location.search);
    const directorParam = params.get('director');
    const masterpieceParam = params.get('masterpiece');
    const myBestParam = params.get('my_best');
    const awardParam = params.get('award');

    if (directorParam || masterpieceParam || myBestParam || awardParam) {
      filterMovies(
        directorParam ? decodeURIComponent(directorParam) : null,
        masterpieceParam, myBestParam, awardParam);
    } else {
      movieCards.forEach(card => {
        card.style.display = 'flex';
      });
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