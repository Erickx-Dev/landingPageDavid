(function () {
  'use strict';

  var MEDIA = {
    photos: [
      { src: 'assets/images/photo-1.jpg', alt: 'Pareja en un momento especial juntos', caption: 'El día que comenzó todo' },
      { src: 'assets/images/photo-2.jpg', alt: 'Sonrisa compartida de la pareja', caption: 'Tu sonrisa, mi lugar favorito' },
      { src: 'assets/images/photo-3.jpg', alt: 'Mirada cómplice entre los dos', caption: 'La pieza que completa mi corazón.' },
      { src: 'assets/images/photo-4.jpg', alt: 'Abrazo sincero de la pareja', caption: 'Donde terminan mis brazos, empiezas tú' },
      { src: 'assets/images/photo-5.jpg', alt: 'Aventura de la pareja juntos', caption: 'Cada paso a tu lado es un destino' },
      { src: 'assets/images/photo-6.jpg', alt: 'Atardecer en pareja', caption: 'El sol se pone, nosotros no' },
      { src: 'assets/images/photo-7.jpg', alt: 'Mensaje especial esperando ser leído', caption: 'Haz click para leer' },
    ],
    memories: [
      { src: 'assets/images/memory-01.jpeg', alt: 'Recuerdo juntos 1', caption: '' },
      { src: 'assets/images/memory-02.jpeg', alt: 'Recuerdo juntos 2', caption: '' },
      { src: 'assets/images/memory-03.jpeg', alt: 'Recuerdo juntos 3', caption: '' },
      { src: 'assets/images/memory-04.jpeg', alt: 'Recuerdo juntos 4', caption: '' },
      { src: 'assets/images/memory-05.jpeg', alt: 'Recuerdo juntos 5', caption: '' },
      { src: 'assets/images/memory-06.jpeg', alt: 'Recuerdo juntos 6', caption: '' },
      { src: 'assets/images/memory-07.jpeg', alt: 'Recuerdo juntos 7', caption: '' },
      { src: 'assets/images/memory-08.jpeg', alt: 'Recuerdo juntos 8', caption: '' },
      { src: 'assets/images/memory-09.jpeg', alt: 'Recuerdo juntos 9', caption: '' },
      { src: 'assets/images/memory-10.jpeg', alt: 'Recuerdo juntos 10', caption: '' },
      { src: 'assets/images/memory-11.jpeg', alt: 'Recuerdo juntos 11', caption: '' },
      { src: 'assets/images/memory-12.jpeg', alt: 'Recuerdo juntos 12', caption: '' },
      { src: 'assets/images/memory-13.jpeg', alt: 'Recuerdo juntos 13', caption: '' },
      { src: 'assets/images/memory-14.jpeg', alt: 'Recuerdo juntos 14', caption: '' },
      { src: 'assets/images/memory-15.jpeg', alt: 'Recuerdo juntos 15', caption: '' },
      { src: 'assets/images/memory-16.jpeg', alt: 'Recuerdo juntos 16', caption: '' },
      { src: 'assets/images/memory-17.jpeg', alt: 'Recuerdo juntos 17', caption: '' },
      { src: 'assets/images/memory-18.jpeg', alt: 'Recuerdo juntos 18', caption: '' },
      { src: 'assets/images/memory-19.jpeg', alt: 'Recuerdo juntos 19', caption: '' },
      { src: 'assets/images/memory-20.jpeg', alt: 'Recuerdo juntos 20', caption: '' },
    ],
  };

  var PLACEHOLDER_GRADIENTS = [
    ['#F5EBE0', '#F5D6D6'],
    ['#FFF8F0', '#C9A96E'],
    ['#F5D6D6', '#C4958F'],
    ['#F5EBE0', '#FFF8F0'],
    ['#C9A96E', '#F5EBE0'],
    ['#C4958F', '#F5D6D6'],
    ['#FFF8F0', '#C4958F'],
  ];

  function generatePlaceholder(index) {
    var c = document.createElement('canvas');
    c.width = 120;
    c.height = 160;
    var ctx = c.getContext('2d');
    var colors = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
    var grad = ctx.createLinearGradient(0, 0, c.width, c.height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    return c.toDataURL();
  }

  var ScrollReveal = {
    observer: null,

    init: function () {
      var self = this;
      this.observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              self.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      var els = document.querySelectorAll(
        '.polaroid, .letter-card, .section__header, .memories__marquee'
      );
      Array.prototype.forEach.call(els, function (el) {
        self.observer.observe(el);
      });

      var galleryGrid = document.getElementById('gallery-grid');
      if (galleryGrid) {
        var gridObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting && window.innerWidth <= 767) {
                var cards = galleryGrid.querySelectorAll('.polaroid');
                Array.prototype.forEach.call(cards, function (card) {
                  card.classList.add('is-visible');
                });
                gridObserver.unobserve(galleryGrid);
              }
            });
          },
          { threshold: 0.1 }
        );
        gridObserver.observe(galleryGrid);
      }
    },
  };

  var LightboxManager = {
    currentIndex: 0,
    photos: MEDIA.photos,
    el: null,
    previousFocus: null,

    init: function () {
      this.el = document.getElementById('lightbox');
      this.bindEvents();
    },

    open: function (photosList, index) {
      if (typeof photosList === 'number') {
        index = photosList;
        photosList = MEDIA.photos;
      }
      this.photos = photosList && photosList.length ? photosList : MEDIA.photos;
      this.currentIndex = index || 0;
      this.previousFocus = document.activeElement;
      this.updateContent();
      this.el.removeAttribute('hidden');
      this.el.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.focusTrap();
    },

    close: function () {
      this.el.classList.remove('open');
      this.el.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (this.previousFocus) {
        this.previousFocus.focus();
      }
    },

    prev: function () {
      this.currentIndex =
        (this.currentIndex - 1 + this.photos.length) % this.photos.length;
      this.updateContent();
    },

    next: function () {
      this.currentIndex =
        (this.currentIndex + 1) % this.photos.length;
      this.updateContent();
    },

    updateContent: function () {
      var photo = this.photos[this.currentIndex];
      var img = this.el.querySelector('.lightbox__image');
      var captionEl = this.el.querySelector('.lightbox__caption');
      var counterEl = this.el.querySelector('.lightbox__counter');

      img.src = photo.src;
      img.alt = photo.alt;

      if (photo.caption) {
        captionEl.textContent = photo.caption;
        captionEl.hidden = false;
      } else {
        captionEl.textContent = '';
        captionEl.hidden = true;
      }

      if (counterEl) {
        counterEl.textContent =
          (this.currentIndex + 1) + ' / ' + this.photos.length;
      }
    },

    bindEvents: function () {
      var self = this;

      this.el
        .querySelector('.lightbox__close')
        .addEventListener('click', function () {
          self.close();
        });

      this.el.addEventListener('click', function (e) {
        if (e.target === self.el) {
          self.close();
        }
      });

      this.el
        .querySelector('.lightbox__prev')
        .addEventListener('click', function () {
          self.prev();
        });

      this.el
        .querySelector('.lightbox__next')
        .addEventListener('click', function () {
          self.next();
        });

      document.addEventListener('keydown', function (e) {
        if (!self.el.classList.contains('open')) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          self.close();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          self.prev();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          self.next();
        }
      });

      var startX = 0;
      this.el.addEventListener(
        'touchstart',
        function (e) {
          startX = e.touches[0].clientX;
        },
        { passive: true }
      );

      this.el.addEventListener(
        'touchend',
        function (e) {
          var diff = e.changedTouches[0].clientX - startX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) self.prev();
            else self.next();
          }
        },
        { passive: true }
      );
    },

    focusTrap: function () {
      var focusable = this.el.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        setTimeout(function () {
          focusable[0].focus();
        }, 100);
      }
    },
  };

  var StarParticles = {
    canvas: null,
    ctx: null,
    stars: [],
    animId: null,

    init: function () {
      this.canvas = document.getElementById('particles-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createStars(25);
      this.animate();

      var self = this;
      window.addEventListener('resize', function () {
        self.resize();
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          cancelAnimationFrame(self.animId);
        } else {
          self.animate();
        }
      });
    },

    resize: function () {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createStars: function (count) {
      for (var i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2.2 + 0.6,
          opacity: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    },

    animate: function () {
      var self = this;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var now = Date.now() * 0.001;

      this.stars.forEach(function (star) {
        var flicker = Math.sin(now * star.speed * 10 + star.phase) * 0.4 + 0.6;
        var alpha = star.opacity * flicker;

        self.ctx.beginPath();
        self.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        self.ctx.fillStyle = 'rgba(212, 160, 160, ' + alpha + ')';
        self.ctx.fill();

        self.ctx.beginPath();
        self.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        self.ctx.fillStyle = 'rgba(212, 160, 160, ' + alpha * 0.12 + ')';
        self.ctx.fill();
      });

      this.animId = requestAnimationFrame(function () {
        self.animate();
      });
    },
  };

  function buildGallery() {
    var grid = document.getElementById('gallery-grid');
    MEDIA.photos.forEach(function (photo, index) {
      var wrapper = document.createElement('div');
      wrapper.className = 'polaroid';
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('aria-label', 'Abrir ' + photo.alt);

      var imgWrapper = document.createElement('div');
      imgWrapper.className = 'polaroid__image-wrapper';

      var img = document.createElement('img');
      img.alt = photo.alt;
      img.loading = 'lazy';

      img.onerror = function () {
        img.src = generatePlaceholder(index);
      };

      img.src = photo.src;

      wrapper.style.transitionDelay = (index * 0.08) + 's';

      imgWrapper.appendChild(img);

      var caption = document.createElement('p');
      caption.className = 'polaroid__caption';
      caption.textContent = photo.caption;

      wrapper.appendChild(imgWrapper);
      wrapper.appendChild(caption);

      wrapper.addEventListener('click', function () {
        LightboxManager.open(MEDIA.photos, index);
      });

      wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          LightboxManager.open(MEDIA.photos, index);
        }
      });

      grid.appendChild(wrapper);
    });

    initGalleryCarousel(grid);
  }

  function initGalleryCarousel(grid) {
    var dotsContainer = document.getElementById('gallery-dots');
    if (!grid || !dotsContainer) return;

    var cards = grid.querySelectorAll('.polaroid');
    if (!cards.length) return;

    var dots = [];
    Array.prototype.forEach.call(cards, function (card, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery__dot' + (index === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir al momento ' + (index + 1));
      dot.addEventListener('click', function () {
        var targetLeft =
          card.offsetLeft - (grid.clientWidth - card.offsetWidth) / 2;
        grid.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });

    var ticking = false;
    function syncActiveDot() {
      ticking = false;
      var center = grid.scrollLeft + grid.clientWidth / 2;
      var closestIdx = 0;
      var minDist = Infinity;

      Array.prototype.forEach.call(cards, function (card, idx) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var dist = Math.abs(cardCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });

      dots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === closestIdx);
      });
    }

    grid.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(syncActiveDot);
        }
      },
      { passive: true }
    );
  }

  function createMemoryCard(photo, globalIndex, isClone) {
    var card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.memoryIndex = String(globalIndex);

    if (isClone) {
      card.setAttribute('aria-hidden', 'true');
      card.setAttribute('tabindex', '-1');
    } else {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Abrir ' + photo.alt);
    }

    var img = document.createElement('img');
    img.alt = isClone ? '' : photo.alt;
    img.loading = 'eager';
    img.draggable = false;
    img.onerror = function () {
      img.src = generatePlaceholder(globalIndex);
    };
    img.src = photo.src;

    card.appendChild(img);
    return card;
  }

  function buildMemories() {
    var topTrack = document.getElementById('memories-track-top');
    var bottomTrack = document.getElementById('memories-track-bottom');
    if (!topTrack || !bottomTrack || !MEDIA.memories.length) return;

    var midpoint = Math.ceil(MEDIA.memories.length / 2);
    var rows = [
      { track: topTrack, items: MEDIA.memories.slice(0, midpoint), offset: 0 },
      { track: bottomTrack, items: MEDIA.memories.slice(midpoint), offset: midpoint },
    ];

    rows.forEach(function (row) {
      [false, true].forEach(function (isClone) {
        row.items.forEach(function (photo, i) {
          row.track.appendChild(
            createMemoryCard(photo, row.offset + i, isClone)
          );
        });
      });
    });
  }

  var MemoriesMarquee = {
    rows: [],
    animId: null,
    lastTime: 0,
    reducedMotion: false,

    init: function () {
      var marquees = document.querySelectorAll('.memories__marquee');
      if (!marquees.length) return;

      var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = motionQuery.matches;

      var self = this;
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', function (e) {
          self.reducedMotion = e.matches;
          if (self.reducedMotion) {
            self.rows.forEach(function (r) {
              r.track.style.transform = '';
            });
          }
        });
      }

      Array.prototype.forEach.call(marquees, function (marquee) {
        var track = marquee.querySelector('.memories__track');
        if (!track) return;

        var dir = marquee.dataset.direction === 'right' ? 1 : -1;
        var baseSpeed = dir === -1 ? 42 : 38;
        var row = {
          marquee: marquee,
          track: track,
          direction: dir,
          baseSpeed: baseSpeed,
          currentSpeed: dir * baseSpeed,
          inertia: 0,
          offset: 0,
          halfWidth: 0,
          isHovered: false,
          isFocused: false,
          isDragging: false,
          wasDragging: false,
          startX: 0,
          lastX: 0,
          lastMoveTime: 0,
        };

        self.measureRow(row);
        if (dir === 1 && row.halfWidth > 0) {
          row.offset = -row.halfWidth;
        }
        self.bindRowEvents(row);
        self.rows.push(row);
      });

      window.addEventListener('resize', function () {
        self.rows.forEach(function (row) {
          self.measureRow(row);
        });
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          cancelAnimationFrame(self.animId);
          self.animId = null;
        } else if (!self.animId) {
          self.lastTime = performance.now();
          self.tick(self.lastTime);
        }
      });

      this.lastTime = performance.now();
      this.tick(this.lastTime);
    },

    measureRow: function (row) {
      var children = row.track.children;
      var midpoint = Math.floor(children.length / 2);
      if (midpoint > 0 && children[midpoint]) {
        row.halfWidth = children[midpoint].offsetLeft - children[0].offsetLeft;
      } else {
        row.halfWidth = row.track.scrollWidth / 2;
      }
      if (row.halfWidth > 0) {
        row.offset = this.wrapOffset(row.offset, row.halfWidth);
      }
    },

    wrapOffset: function (value, width) {
      if (!width) return 0;
      var mod = value % width;
      return mod >= 0 ? mod - width : mod;
    },

    bindRowEvents: function (row) {
      var self = this;

      row.marquee.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        row.isHovered = true;
      });

      row.marquee.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse') return;
        row.isHovered = false;
      });

      row.marquee.addEventListener('focusin', function (e) {
        if (e.target && e.target.matches && e.target.matches(':focus-visible')) {
          row.isFocused = true;
        }
      });

      row.marquee.addEventListener('focusout', function () {
        row.isFocused = false;
      });

      row.marquee.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        row.isDragging = true;
        row.wasDragging = false;
        row.inertia = 0;
        row.startX = e.clientX;
        row.lastX = e.clientX;
        row.lastMoveTime = performance.now();
        row.marquee.classList.add('is-dragging');
      });

      window.addEventListener('pointermove', function (e) {
        if (!row.isDragging) return;
        var now = performance.now();
        var dx = e.clientX - row.lastX;
        var dtMove = Math.max(now - row.lastMoveTime, 8) / 1000;
        if (Math.abs(e.clientX - row.startX) > 6) {
          row.wasDragging = true;
        }
        row.inertia = Math.max(-900, Math.min(900, dx / dtMove));
        row.lastX = e.clientX;
        row.lastMoveTime = now;
        if (!row.halfWidth) self.measureRow(row);
        row.offset = self.wrapOffset(row.offset + dx, row.halfWidth);
        row.track.style.transform = 'translate3d(' + row.offset + 'px, 0, 0)';
      });

      function endDrag() {
        if (!row.isDragging) return;
        row.isDragging = false;
        row.marquee.classList.remove('is-dragging');
        if (performance.now() - row.lastMoveTime > 80) {
          row.inertia = 0;
        }
        setTimeout(function () {
          row.wasDragging = false;
        }, 0);
      }

      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);

      row.track.addEventListener('click', function (e) {
        if (row.wasDragging) return;
        var card = e.target.closest('.memory-card');
        if (!card) return;
        var idx = parseInt(card.dataset.memoryIndex, 10);
        if (!isNaN(idx)) {
          LightboxManager.open(MEDIA.memories, idx);
        }
      });

      row.track.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.memory-card');
        if (!card) return;
        e.preventDefault();
        var idx = parseInt(card.dataset.memoryIndex, 10);
        if (!isNaN(idx)) {
          LightboxManager.open(MEDIA.memories, idx);
        }
      });
    },

    tick: function (now) {
      var self = this;
      var dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      if (!this.reducedMotion) {
        this.rows.forEach(function (row) {
          if (!row.halfWidth) {
            self.measureRow(row);
            if (!row.halfWidth) return;
          }

          var paused = row.isHovered || row.isDragging || row.isFocused;
          var targetSpeed = paused ? 0 : row.direction * row.baseSpeed;
          row.currentSpeed +=
            (targetSpeed - row.currentSpeed) * Math.min(1, dt * 8);

          if (Math.abs(row.inertia) > 1) {
            row.inertia *= Math.pow(0.04, dt);
          } else {
            row.inertia = 0;
          }

          var totalSpeed = row.currentSpeed + row.inertia;
          if (!row.isDragging && Math.abs(totalSpeed) > 0.05) {
            row.offset = self.wrapOffset(
              row.offset + totalSpeed * dt,
              row.halfWidth
            );
            row.track.style.transform =
              'translate3d(' + row.offset + 'px, 0, 0)';
          }
        });
      }

      this.animId = requestAnimationFrame(function (t) {
        self.tick(t);
      });
    },
  };

  document.addEventListener('DOMContentLoaded', function () {
    buildGallery();
    buildMemories();
    ScrollReveal.init();
    LightboxManager.init();
    MemoriesMarquee.init();
    StarParticles.init();
  });
})();
