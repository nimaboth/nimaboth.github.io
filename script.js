// Portfolio — Lightbox + custom cursor dot

document.addEventListener('DOMContentLoaded', function() {
  // Bio (accueil) et CV : anim entrée « sort de la sidebar »
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var homeIntro = document.querySelector('.home-intro');
      if (homeIntro) homeIntro.classList.add('visible');
      var about = document.querySelector('.about');
      if (about) about.classList.add('visible');
    });
  });

  // Custom cursor: dot with inverted colors (only when hover available)
  if (window.matchMedia('(hover: hover)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let rafId = 0;

    // Restaurer la position après navigation (évite le saut en haut à gauche)
    try {
      const saved = sessionStorage.getItem('cursorDotPos');
      if (saved) {
        const pos = JSON.parse(saved);
        mouseX = pos.x;
        mouseY = pos.y;
        cursorX = pos.x;
        cursorY = pos.y;
        sessionStorage.removeItem('cursorDotPos');
      } else {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseX = cursorX = cx;
        mouseY = cursorY = cy;
      }
    } catch (_) {
      mouseX = cursorX = window.innerWidth / 2;
      mouseY = cursorY = window.innerHeight / 2;
    }

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // Au clic, aligner le curseur sur la souris pour éviter le saut
    document.addEventListener('mousedown', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorX = e.clientX;
      cursorY = e.clientY;
    }, { passive: true });

    function tick() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.transform = 'translate3d(' + cursorX + 'px,' + cursorY + 'px,0) translate(-50%,-50%)';
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (!rafId && !document.hidden) rafId = requestAnimationFrame(tick);
    }
    function stop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }

    document.addEventListener('visibilitychange', function() {
      document.hidden ? stop() : start();
    });

    if (!document.hidden) start();
  }

  // Créer le lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img src="" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // Lightbox: event delegation (one listener instead of N per image)
  document.addEventListener('click', function(e) {
    const img = e.target.closest('.project-page-media img');
    if (!img) return;
    e.stopPropagation();
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Fermer le lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Fermer avec Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Pages projet : aligner la description sur la même ligne que "works" (éviter le saut au clic)
  const descCol = document.querySelector('.project-page-description-col');
  const worksLabel = document.querySelector('.sidebar-projects-label');
  function alignDescToWorks() {
    if (!descCol || !worksLabel) return;
    const top = worksLabel.getBoundingClientRect().top;
    descCol.style.setProperty('--project-desc-col-top', top + 'px');
    descCol.classList.add('is-aligned');
  }
  if (descCol && worksLabel) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        alignDescToWorks();
        var projectPage = document.querySelector('.project-page');
        if (projectPage) {
          setTimeout(function() {
            projectPage.classList.add('gallery-visible');
            var medias = projectPage.querySelectorAll('.project-page-media, .project-page-video');
            medias.forEach(function(el, i) {
              el.style.transitionDelay = (0.08 + i * 0.04) + 's';
            });
          }, 520);
        }
      });
    });
    window.addEventListener('resize', alignDescToWorks);
    setTimeout(function() {
      if (descCol && !descCol.classList.contains('is-aligned')) {
        descCol.classList.add('is-aligned');
        var projectPage = document.querySelector('.project-page');
        if (projectPage) {
          setTimeout(function() {
            projectPage.classList.add('gallery-visible');
            var medias = projectPage.querySelectorAll('.project-page-media, .project-page-video');
            medias.forEach(function(el, i) {
              el.style.transitionDelay = (0.08 + i * 0.04) + 's';
            });
          }, 520);
        }
      }
    }, 150);
  }
});
var isNavigating = false;
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (!link) return;
  if (isNavigating) return;
  e.preventDefault();
  e.stopPropagation();
  isNavigating = true;
  var href = link.href;
  try {
    sessionStorage.setItem('cursorDotPos', JSON.stringify({ x: e.clientX, y: e.clientY }));
  } catch (_) {}
  setTimeout(function() {
    window.location.href = href;
  }, 50);
}, true);
