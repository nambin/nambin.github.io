// _includes/movies.js

function initMovieFilter() {
  const movieCards = document.querySelectorAll('.movie-card');

  function _filterMovies(searchTerm, director, masterpiece, myBest, award) {
    const searchKeywords = searchTerm.toLowerCase().split(' ').filter(k => k);

    movieCards.forEach(card => {
      let shouldShow = true;
      if (director && card.getAttribute('data-director') !== director && card.getAttribute('data-director-2') !== director) {
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
      if (shouldShow && searchKeywords.length > 0) {
        const searchableText = card.dataset.searchText || '';
        const matchesAllKeywords = searchKeywords.every(keyword => searchableText.includes(keyword));
        if (!matchesAllKeywords) {
          shouldShow = false;
        }
      }

      card.style.display = shouldShow ? 'flex' : 'none';
    });
  }

  /**
   * When the page is loaded with a director query parameter, filters the movie list accordingly.
   */
  function _applyAllFilters() {
    const params = new URLSearchParams(window.location.search);
    const directorParam = params.get('director');
    const masterpieceParam = params.get('masterpiece');
    const myBestParam = params.get('my_best');
    const awardParam = params.get('award');

    if (searchInput.value || directorParam || masterpieceParam || myBestParam || awardParam) {
      _filterMovies(
        searchInput.value,
        directorParam ? decodeURIComponent(directorParam) : null,
        masterpieceParam, myBestParam, awardParam);
      // console.log('filters applied:', {
      //   search: searchInput.value,
      //   director: directorParam,
      //   masterpiece: masterpieceParam,
      //   myBest: myBestParam,
      //   award: awardParam
      // });
    } else {
      movieCards.forEach(card => {
        card.style.display = 'flex';
      });
      console.log('No filters applied, showing all movies.');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', _applyAllFilters);
  }
  _applyAllFilters();
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