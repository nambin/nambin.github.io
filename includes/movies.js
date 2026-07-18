// includes/movies.js

function initMovieFilter() {
  const movieCards = document.querySelectorAll('.movie-card');
  const recentToggle = document.getElementById('recentToggle');
  const clearFilterLink = document.getElementById('clear-filter');

  const recentCutoff = new Date();
  recentCutoff.setHours(0, 0, 0, 0);
  recentCutoff.setFullYear(recentCutoff.getFullYear() - 1);

  // Keep their href's `recent` param in sync with the toggle's current state
  // so Recent stays applied on top of whichever of those filters gets clicked next,
  // instead of being overridden by it.
  function _syncFilterLinksWithRecent(recentActive) {
    document.querySelectorAll('.director-filter-link, .badge-link').forEach(link => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      if (recentActive) {
        url.searchParams.set('recent', 'true');
      } else {
        url.searchParams.delete('recent');
      }
      link.setAttribute('href', url.pathname + url.search);
    });
  }

  // The "×" clear-filter link drops the named filter (director/masterpiece/
  // my_best/award) — but if Recent is active it should stay active, not get
  // wiped along with the rest, so this rebuilds the link's href to only ever
  // carry `recent` forward.
  function _updateClearFilterHref(recentActive) {
    if (!clearFilterLink) return;
    const url = new URL(window.location.pathname, window.location.href);
    if (recentActive) {
      url.searchParams.set('recent', 'true');
    }
    clearFilterLink.setAttribute('href', url.pathname + url.search);
  }

  function _filterMovies(searchTerm, director, masterpiece, myBest, award, recentOnly) {
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
      if (recentOnly) {
        const dateCommitted = card.getAttribute('data-date-committed');
        if (!dateCommitted || new Date(dateCommitted) < recentCutoff) {
          shouldShow = false;
        }
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
    const recentParam = params.get('recent');

    if (recentToggle) {
      recentToggle.classList.toggle('active', !!recentParam);
      recentToggle.setAttribute('aria-pressed', recentParam ? 'true' : 'false');
    }
    _syncFilterLinksWithRecent(!!recentParam);
    _updateClearFilterHref(!!recentParam);

    if (searchInput.value || directorParam || masterpieceParam || myBestParam || awardParam || recentParam) {
      decodedDirectorParam = directorParam ? decodeURIComponent(directorParam) : null;
      _filterMovies(
        searchInput.value,
        decodedDirectorParam,
        masterpieceParam, myBestParam, awardParam, recentParam);

      // console.log('filters applied:', {
      //   search: searchInput.value,
      //   director: directorParam,
      //   masterpiece: masterpieceParam,
      //   myBest: myBestParam,
      //   award: awardParam,
      //   recent: recentParam
      // });

      let displayText = null;
      if (directorParam) {
        displayText = `Directed by ${decodedDirectorParam}`;
      } else if (masterpieceParam) {
        displayText = 'Masterpiece';
      } else if (myBestParam) {
        displayText = 'My Inspiration';
      } else if (awardParam) {
        switch (awardParam) {
          case 'oscar': displayText = 'Oscar Best Picture or International Feature Film'; break;
          case 'cannes': displayText = 'Cannes Palme d\'Or'; break;
          case 'berlin': displayText = 'Berlin Goldener Bär'; break;
          case 'venice': displayText = 'Venice Leone d\'oro'; break;
          case 'blue_dragon': displayText = 'Korean Blue Dragon Best Film'; break;
        }
      }
      // No separate banner text for "recent" — the toggle button's own
      // active/inactive color is the indicator for that filter, so it doesn't
      // steal the banner from a director/masterpiece/my-best/award filter
      // that's active at the same time.

      const filterDisplay = document.getElementById('filter-display');
      const filterText = document.getElementById('filter-text');
      if (displayText && filterDisplay && filterText) {
        filterText.textContent = displayText;
        filterDisplay.style.display = 'flex';
      } else if (filterDisplay) {
        filterDisplay.style.display = 'none';
      }
    } else {
      movieCards.forEach(card => {
        card.style.display = 'flex';
      });
      const filterDisplay = document.getElementById('filter-display');
      filterDisplay.style.display = 'none';

      console.log('No filters applied, showing all movies.');
    }
  }

  // Clicking a director name, award badge, or the clear-filter "×" used to
  // be a full page navigation, which re-downloaded movies.yml and re-rendered
  // every card on each click. These are same-page filter changes, so handle
  // them with the History API instead — one movies.yml fetch per visit, and
  // filtering is instant. Delegated on document so it covers the links inside
  // every card without per-link listeners (badge clicks land on the inner
  // <img>, hence closest()).
  document.addEventListener('click', (e) => {
    // Leave modified/middle clicks alone so "open in new tab" still works.
    if (e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('.director-filter-link, .badge-link, #clear-filter');
    if (!link) return;
    e.preventDefault();
    const url = new URL(link.getAttribute('href'), window.location.href);
    window.history.pushState(null, '', url.pathname + url.search);
    // Match real-navigation behavior: a filter click from deep in the list
    // lands at the top of the results.
    window.scrollTo(0, 0);
    _applyAllFilters();
  });

  // Back/forward through the pushState entries re-applies filters in place.
  window.addEventListener('popstate', _applyAllFilters);

  if (searchInput) {
    searchInput.addEventListener('input', _applyAllFilters);
  }
  if (recentToggle) {
    recentToggle.addEventListener('click', () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('recent')) {
        params.delete('recent');
      } else {
        params.set('recent', 'true');
      }
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState(null, '', newUrl);
      _applyAllFilters();
    });
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

// Not auto-invoked here: the movie cards are rendered asynchronously by
// assets/movies_page.js (fetched from data/movies.yml), which calls these
// once the cards are actually in the DOM.
