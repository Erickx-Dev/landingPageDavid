(() => {
  'use strict';

  const MEDIA = {
    photos: [
      { src: 'assets/images/photo-1.jpg', alt: 'Pareja en un momento especial juntos', caption: 'El día que comenzó todo' },
      { src: 'assets/images/photo-2.jpg', alt: 'Sonrisa compartida de la pareja', caption: 'Tu sonrisa, mi lugar favorito' },
      { src: 'assets/images/photo-3.jpg', alt: 'Mirada cómplice entre los dos', caption: 'La pieza que completa mi corazón.' },
      { src: 'assets/images/photo-4.jpg', alt: 'Abrazo sincero de la pareja', caption: 'Donde terminan mis brazos, empiezas tú' },
      { src: 'assets/images/photo-5.jpg', alt: 'Aventura de la pareja juntos', caption: 'Cada paso a tu lado es un destino' },
      { src: 'assets/images/photo-6.jpg', alt: 'Atardecer en pareja', caption: 'El sol se pone, nosotros no' },
      { src: 'assets/images/photo-7.jpg', alt: 'Mensaje especial esperando ser leído', caption: 'Haz click para leer' },
    ],
    memories: Array.from({ length: 20 }, (_, i) => {
      const num = String(i + 1).padStart(2, '0');
      return {
        src: `assets/images/memory-${num}.jpeg`,
        alt: `Recuerdo juntos ${i + 1}`,
        caption: '',
      };
    }),
  };

  const PLACEHOLDER_GRADIENTS = [
    ['#F5EBE0', '#F5D6D6'],
    ['#FFF8F0', '#C9A96E'],
    ['#F5D6D6', '#C4958F'],
    ['#F5EBE0', '#FFF8F0'],
    ['#C9A96E', '#F5EBE0'],
    ['#C4958F', '#F5D6D6'],
    ['#FFF8F0', '#C4958F'],
  ];

  const generatePlaceholder = (index) => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    const [startColor, endColor] = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, startColor);
    grad.addColorStop(1, endColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  };

  const onActivate = (el, handler) => {
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
      }
    });
  };

  const ScrollReveal = {
    observer: null,

    init() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      document
        .querySelectorAll('.polaroid, .letter-card, .section__header, .memories__marquee')
        .forEach((el) => this.observer.observe(el));

      const galleryGrid = document.getElementById('gallery-grid');
      if (galleryGrid) {
        const gridObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && window.innerWidth <= 767) {
                galleryGrid.querySelectorAll('.polaroid').forEach((card) => {
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

  const LightboxManager = {
    currentIndex: 0,
    photos: MEDIA.photos,
    el: null,
    img: null,
    captionEl: null,
    counterEl: null,
    previousFocus: null,

    init() {
      this.el = document.getElementById('lightbox');
      if (!this.el) return;
      this.img = this.el.querySelector('.lightbox__image');
      this.captionEl = this.el.querySelector('.lightbox__caption');
      this.counterEl = this.el.querySelector('.lightbox__counter');
      this.bindEvents();
    },

    open(photosList = MEDIA.photos, index = 0) {
      this.photos = photosList?.length ? photosList : MEDIA.photos;
      this.currentIndex = index;
      this.previousFocus = document.activeElement;
      this.updateContent();
      this.el.removeAttribute('hidden');
      this.el.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.focusTrap();
    },

    close() {
      this.el.classList.remove('open');
      this.el.setAttribute('hidden', '');
      document.body.style.overflow = '';
      this.previousFocus?.focus?.();
    },

    prev() {
      this.currentIndex =
        (this.currentIndex - 1 + this.photos.length) % this.photos.length;
      this.updateContent();
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
      this.updateContent();
    },

    updateContent() {
      const photo = this.photos[this.currentIndex];
      this.img.src = photo.src;
      this.img.alt = photo.alt;

      this.captionEl.textContent = photo.caption || '';
      this.captionEl.hidden = !photo.caption;

      if (this.counterEl) {
        this.counterEl.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
      }
    },

    bindEvents() {
      this.el
        .querySelector('.lightbox__close')
        .addEventListener('click', () => this.close());

      this.el.addEventListener('click', (e) => {
        if (e.target === this.el) {
          this.close();
        }
      });

      this.el
        .querySelector('.lightbox__prev')
        .addEventListener('click', () => this.prev());

      this.el
        .querySelector('.lightbox__next')
        .addEventListener('click', () => this.next());

      document.addEventListener('keydown', (e) => {
        if (!this.el.classList.contains('open')) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      });

      let startX = 0;
      this.el.addEventListener(
        'touchstart',
        (e) => {
          startX = e.touches[0].clientX;
        },
        { passive: true }
      );

      this.el.addEventListener(
        'touchend',
        (e) => {
          const diff = e.changedTouches[0].clientX - startX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) this.prev();
            else this.next();
          }
        },
        { passive: true }
      );
    },

    focusTrap() {
      const focusable = this.el.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) {
        setTimeout(() => focusable[0].focus(), 100);
      }
    },
  };

  const StarParticles = {
    canvas: null,
    ctx: null,
    stars: [],
    animId: null,

    init() {
      this.canvas = document.getElementById('particles-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createStars(25);
      this.animId = requestAnimationFrame((t) => this.animate(t));

      window.addEventListener('resize', () => this.resize());

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(this.animId);
          this.animId = null;
        } else if (!this.animId) {
          this.animId = requestAnimationFrame((t) => this.animate(t));
        }
      });
    },

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createStars(count) {
      for (let i = 0; i < count; i++) {
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

    animate(timestamp) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const now = timestamp * 0.001;

      this.stars.forEach((star) => {
        const flicker = Math.sin(now * star.speed * 10 + star.phase) * 0.4 + 0.6;
        const alpha = star.opacity * flicker;

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(212, 160, 160, ${alpha})`;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(212, 160, 160, ${alpha * 0.12})`;
        this.ctx.fill();
      });

      this.animId = requestAnimationFrame((t) => this.animate(t));
    },
  };

  const initGalleryCarousel = (grid) => {
    const dotsContainer = document.getElementById('gallery-dots');
    if (!grid || !dotsContainer) return;

    const cards = grid.querySelectorAll('.polaroid');
    if (!cards.length) return;

    const dots = Array.from(cards, (card, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `gallery__dot${index === 0 ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `Ir al momento ${index + 1}`);
      dot.addEventListener('click', () => {
        const targetLeft = card.offsetLeft - (grid.clientWidth - card.offsetWidth) / 2;
        grid.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    let ticking = false;
    const syncActiveDot = () => {
      ticking = false;
      const center = grid.scrollLeft + grid.clientWidth / 2;
      let closestIdx = 0;
      let minDist = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === closestIdx);
      });
    };

    grid.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(syncActiveDot);
        }
      },
      { passive: true }
    );
  };

  const buildGallery = () => {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    MEDIA.photos.forEach((photo, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'polaroid';
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('aria-label', `Abrir ${photo.alt}`);
      wrapper.style.transitionDelay = `${index * 0.08}s`;

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'polaroid__image-wrapper';

      const img = document.createElement('img');
      img.alt = photo.alt;
      img.loading = 'lazy';
      img.onerror = () => {
        img.src = generatePlaceholder(index);
      };
      img.src = photo.src;
      imgWrapper.appendChild(img);

      const caption = document.createElement('p');
      caption.className = 'polaroid__caption';
      caption.textContent = photo.caption;

      wrapper.append(imgWrapper, caption);
      onActivate(wrapper, () => LightboxManager.open(MEDIA.photos, index));
      grid.appendChild(wrapper);
    });

    initGalleryCarousel(grid);
  };

  const createMemoryCard = (photo, globalIndex, isClone) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.memoryIndex = String(globalIndex);

    if (isClone) {
      card.setAttribute('aria-hidden', 'true');
      card.setAttribute('tabindex', '-1');
    } else {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Abrir ${photo.alt}`);
    }

    const img = document.createElement('img');
    img.alt = isClone ? '' : photo.alt;
    img.loading = 'eager';
    img.draggable = false;
    img.onerror = () => {
      img.src = generatePlaceholder(globalIndex);
    };
    img.src = photo.src;

    card.appendChild(img);
    return card;
  };

  const buildMemories = () => {
    const topTrack = document.getElementById('memories-track-top');
    const bottomTrack = document.getElementById('memories-track-bottom');
    if (!topTrack || !bottomTrack || !MEDIA.memories.length) return;

    const midpoint = Math.ceil(MEDIA.memories.length / 2);
    const rows = [
      { track: topTrack, items: MEDIA.memories.slice(0, midpoint), offset: 0 },
      { track: bottomTrack, items: MEDIA.memories.slice(midpoint), offset: midpoint },
    ];

    rows.forEach((row) => {
      [false, true].forEach((isClone) => {
        row.items.forEach((photo, i) => {
          row.track.appendChild(createMemoryCard(photo, row.offset + i, isClone));
        });
      });
    });
  };

  const MemoriesMarquee = {
    rows: [],
    activeDragRow: null,
    animId: null,
    lastTime: 0,
    reducedMotion: false,

    init() {
      const marquees = document.querySelectorAll('.memories__marquee');
      if (!marquees.length) return;

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = motionQuery.matches;

      motionQuery.addEventListener?.('change', (e) => {
        this.reducedMotion = e.matches;
        if (this.reducedMotion) {
          this.rows.forEach((r) => {
            r.track.style.transform = '';
          });
        }
      });

      marquees.forEach((marquee) => {
        const track = marquee.querySelector('.memories__track');
        if (!track) return;

        const direction = marquee.dataset.direction === 'right' ? 1 : -1;
        const baseSpeed = direction === -1 ? 42 : 38;
        const row = {
          marquee,
          track,
          direction,
          baseSpeed,
          currentSpeed: direction * baseSpeed,
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

        this.measureRow(row);
        if (direction === 1 && row.halfWidth > 0) {
          row.offset = -row.halfWidth;
        }
        this.bindRowEvents(row);
        this.rows.push(row);
      });

      this.bindGlobalDragEvents();

      window.addEventListener('resize', () => {
        this.rows.forEach((row) => this.measureRow(row));
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(this.animId);
          this.animId = null;
        } else if (!this.animId) {
          this.lastTime = performance.now();
          this.tick(this.lastTime);
        }
      });

      this.lastTime = performance.now();
      this.tick(this.lastTime);
    },

    measureRow(row) {
      const { children } = row.track;
      const midpoint = Math.floor(children.length / 2);
      row.halfWidth =
        midpoint > 0 && children[midpoint]
          ? children[midpoint].offsetLeft - children[0].offsetLeft
          : row.track.scrollWidth / 2;

      if (row.halfWidth > 0) {
        row.offset = this.wrapOffset(row.offset, row.halfWidth);
      }
    },

    wrapOffset(value, width) {
      if (!width) return 0;
      const mod = value % width;
      return mod >= 0 ? mod - width : mod;
    },

    bindGlobalDragEvents() {
      window.addEventListener('pointermove', (e) => {
        const row = this.activeDragRow;
        if (!row) return;

        const now = performance.now();
        const dx = e.clientX - row.lastX;
        const dtMove = Math.max(now - row.lastMoveTime, 8) / 1000;
        if (Math.abs(e.clientX - row.startX) > 6) {
          row.wasDragging = true;
        }
        row.inertia = Math.max(-900, Math.min(900, dx / dtMove));
        row.lastX = e.clientX;
        row.lastMoveTime = now;
        if (!row.halfWidth) this.measureRow(row);
        row.offset = this.wrapOffset(row.offset + dx, row.halfWidth);
        row.track.style.transform = `translate3d(${row.offset}px, 0, 0)`;
      });

      const endDrag = () => {
        const row = this.activeDragRow;
        if (!row) return;

        this.activeDragRow = null;
        row.isDragging = false;
        row.marquee.classList.remove('is-dragging');
        if (performance.now() - row.lastMoveTime > 80) {
          row.inertia = 0;
        }
        setTimeout(() => {
          row.wasDragging = false;
        }, 0);
      };

      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);
    },

    bindRowEvents(row) {
      row.marquee.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') row.isHovered = true;
      });

      row.marquee.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') row.isHovered = false;
      });

      row.marquee.addEventListener('focusin', (e) => {
        if (e.target?.matches?.(':focus-visible')) {
          row.isFocused = true;
        }
      });

      row.marquee.addEventListener('focusout', () => {
        row.isFocused = false;
      });

      row.marquee.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        this.activeDragRow = row;
        row.isDragging = true;
        row.wasDragging = false;
        row.inertia = 0;
        row.startX = e.clientX;
        row.lastX = e.clientX;
        row.lastMoveTime = performance.now();
        row.marquee.classList.add('is-dragging');
      });

      onActivate(row.track, (e) => {
        if (row.wasDragging) return;
        const card = e.target.closest('.memory-card');
        if (!card) return;
        const idx = Number.parseInt(card.dataset.memoryIndex, 10);
        if (!Number.isNaN(idx)) {
          LightboxManager.open(MEDIA.memories, idx);
        }
      });
    },

    tick(now) {
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      if (!this.reducedMotion) {
        this.rows.forEach((row) => {
          if (!row.halfWidth) {
            this.measureRow(row);
            if (!row.halfWidth) return;
          }

          const paused = row.isHovered || row.isDragging || row.isFocused;
          const targetSpeed = paused ? 0 : row.direction * row.baseSpeed;
          row.currentSpeed += (targetSpeed - row.currentSpeed) * Math.min(1, dt * 8);

          if (Math.abs(row.inertia) > 1) {
            row.inertia *= Math.pow(0.04, dt);
          } else {
            row.inertia = 0;
          }

          const totalSpeed = row.currentSpeed + row.inertia;
          if (!row.isDragging && Math.abs(totalSpeed) > 0.05) {
            row.offset = this.wrapOffset(row.offset + totalSpeed * dt, row.halfWidth);
            row.track.style.transform = `translate3d(${row.offset}px, 0, 0)`;
          }
        });
      }

      this.animId = requestAnimationFrame((t) => this.tick(t));
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    buildGallery();
    buildMemories();
    ScrollReveal.init();
    LightboxManager.init();
    MemoriesMarquee.init();
    StarParticles.init();
  });
})();
