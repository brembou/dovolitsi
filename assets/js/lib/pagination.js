const pagination = (isInfinite, done, isMasonry = false) => {
    const feedElement = document.querySelector('.gh-feed');
    if (!feedElement) return;

    // Klíč pro sessionStorage - používáme aktuální URL pro identifikaci stránky
    const storageKey = `gh-pagination-${window.location.pathname}`;
    const scrollKey = `gh-scroll-${window.location.pathname}`;

    let loading = false;
    let loadedPagesCount = 0;
    let isRestoring = false;
    const target = feedElement.nextElementSibling || feedElement.parentElement.nextElementSibling || document.querySelector('.gh-foot');
    const buttonElement = document.querySelector('.gh-loadmore');

    // Načtení uloženého počtu stránek
    const savedPagesCount = sessionStorage.getItem(storageKey);
    if (savedPagesCount) {
      loadedPagesCount = parseInt(savedPagesCount, 10);
    }

    // Uložení scroll pozice před odchodem ze stránky
    const saveScrollPosition = () => {
      sessionStorage.setItem(scrollKey, window.scrollY.toString());
    };

    // Obnovení scroll pozice
    const restoreScrollPosition = () => {
      const savedScroll = sessionStorage.getItem(scrollKey);
      if (savedScroll) {
        const scrollY = parseInt(savedScroll, 10);
        window.scrollTo(0, scrollY);
        // Odstraníme uloženou pozici po obnovení
        sessionStorage.removeItem(scrollKey);
      }
    };

    // Uložení scroll pozice při odchodu ze stránky
    window.addEventListener('beforeunload', saveScrollPosition);
    // Také při kliknutí na odkaz (pro lepší podporu)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.href.startsWith('#')) {
        saveScrollPosition();
      }
    }, true);

    const loadNextPage = async () => {
      const nextElement = document.querySelector('link[rel=next]');
      if (!nextElement) return;

      try {
        const res = await fetch(nextElement.href);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const postElements = doc.querySelectorAll('.gh-feed:not(.gh-featured):not(.gh-related) > *');
        const fragment = document.createDocumentFragment();
        const elems = [];

        postElements.forEach((post) => {
          const clonedItem = document.importNode(post, true);

          if (isMasonry) {
            clonedItem.style.visibility = 'hidden';
          }

          fragment.appendChild(clonedItem);
          elems.push(clonedItem);
        });

        feedElement.appendChild(fragment);
        loadedPagesCount++;

        // Uložení počtu načtených stránek
        sessionStorage.setItem(storageKey, loadedPagesCount.toString());

        requestAnimationFrame(() => {
          setTimeout(() => {
            if (window.hyvorTalkCommentCounts) {
              window.hyvorTalkCommentCounts.load(
                {
                  "website-id": 14402,
                  "mode": "number"
                },
                function(count, el) {
                  if (count === 0) {
                    return "Žádný komentář. Budeš první?";
                  } else if (count === 1) {
                    return count + " komentář. Přidáš i ten svůj?";
                  } else if (count >= 2 && count <= 4) {
                    return count + " komentáře. Máš k tomu co říct?";
                  } else {
                    return count + " komentářů. Máš k tomu co říct?";
                  }
                }
              );
            }
          }, 300);
        });


        if (done) {
          done(elems, loadNextWithCheck);
        }

        const resNextElement = doc.querySelector('link[rel=next]');
        if (resNextElement && resNextElement.href) {
          nextElement.href = resNextElement.href;
        } else {
          nextElement.remove();
          if (buttonElement) {
            buttonElement.remove();
          }
          // Odstranění uloženého stavu, pokud už nejsou další stránky
          sessionStorage.removeItem(storageKey);
        }
      } catch (e) {
        nextElement.remove();
        throw e;
      }
    };

    const loadNextWithCheck = async () => {
      if (target.getBoundingClientRect().top <= window.innerHeight && document.querySelector('link[rel=next]')) {
        await loadNextPage();
      }
    };

    const callback = async (entries) => {
      if (loading) return;

      loading = true;

      if (entries[0].isIntersecting) {
        // keep loading next page until target is out of the viewport or we've loaded the last page
        if (!isMasonry) {
          while (target.getBoundingClientRect().top <= window.innerHeight && document.querySelector('link[rel=next]')) {
            await loadNextPage();
          }
        } else {
          await loadNextPage();
        }
      }

      loading = false;

      if (!document.querySelector('link[rel=next]')) {
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(callback);

    // Automatické načtení uložených stránek při načtení stránky
    const restorePages = async () => {
      // Zabraňujeme vícenásobnému spuštění
      if (isRestoring) return;
      
      const currentSavedCount = sessionStorage.getItem(storageKey);
      if (currentSavedCount && parseInt(currentSavedCount, 10) > 0) {
        isRestoring = true;
        const pagesToLoad = parseInt(currentSavedCount, 10);
        // Resetujeme počítadlo, protože budeme načítat všechny stránky znovu
        loadedPagesCount = 0;
        
        // Načteme všechny stránky, které byly dříve načteny
        for (let i = 0; i < pagesToLoad; i++) {
          if (document.querySelector('link[rel=next]')) {
            await loadNextPage();
          } else {
            // Pokud už nejsou další stránky, přerušíme a vymažeme uložený stav
            sessionStorage.removeItem(storageKey);
            break;
          }
        }
        
        isRestoring = false;
        
        // Po načtení všech stránek obnovíme scroll pozici
        setTimeout(() => {
          restoreScrollPosition();
        }, 200);
      }
    };

    // Funkce pro inicializaci obnovení
    const initRestore = () => {
      // Počkáme, až bude DOM připravený
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restorePages);
      } else {
        // DOM už je načtený, počkáme na další tick, aby byly všechny elementy připravené
        setTimeout(restorePages, 100);
      }
    };

    // Spustíme obnovení při načtení stránky
    initRestore();

    // Podpora pro back/forward cache (bfcache) - obnovení při návratu ze stránky
    window.addEventListener('pageshow', (event) => {
      // Pokud se stránka načetla z bfcache, obnovíme stav
      if (event.persisted) {
        initRestore();
      }
    });

    if (isInfinite) {
      observer.observe(target);
    } else {
      if (buttonElement) {
        buttonElement.addEventListener('click', loadNextPage);
      }
    }
  };

  export { pagination };
