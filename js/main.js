/* Guidance Funding — v2 Main JS */
(function () {
  'use strict';

  // ===== Mobile Menu =====
  const toggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', toggle.classList.contains('active'));
    });
  }

  // ===== Header scroll effect =====
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', function () {
        const wasOpen = item.classList.contains('open');
        faqItems.forEach(function (i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    }
  });

  // ===== Animated Counters =====
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.animated) return;
          el.dataset.animated = '1';
          const target = parseFloat(el.dataset.count);
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const duration = 1600;
          const start = performance.now();
          const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
          const step = function (now) {
            const p = Math.min((now - start) / duration, 1);
            const v = target * easeOut(p);
            el.textContent = v.toFixed(decimals);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals);
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  // ===== Particle Network Canvas =====
  const canvas = document.querySelector('.particle-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    let animationId;
    const NUM_PARTICLES = window.innerWidth < 768 ? 40 : 80;
    const MAX_DIST = 140;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 107, 26, 0.6)';
      ctx.fill();
    };

    function init() {
      particles = [];
      for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());
    }

    function connect() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.3;
            ctx.strokeStyle = 'rgba(255, 107, 26, ' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        // mouse interaction
        const dx = particles[i].x - mouseX;
        const dy = particles[i].y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.5;
          ctx.strokeStyle = 'rgba(255, 132, 68, ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      connect();
      animationId = requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', function () {
      resize();
      init();
    });
    canvas.parentElement.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', function () {
      mouseX = -1000; mouseY = -1000;
    });

    // Pause when offscreen
    if ('IntersectionObserver' in window) {
      const visObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!animationId) animate();
          } else {
            if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
          }
        });
      });
      visObs.observe(canvas.parentElement);
    }
  }

  // ===== Scroll-triggered card tilt/scale =====
  const scrollCards = document.querySelectorAll('.product-card, .testi-card, .info-card');
  if (scrollCards.length && 'IntersectionObserver' in window) {
    const cardObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.dataset.origTransform || '';
        }
      });
    }, { threshold: 0.15 });
    scrollCards.forEach(function (card, i) {
      const origTransform = window.getComputedStyle(card).transform;
      card.dataset.origTransform = origTransform === 'none' ? '' : origTransform;
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ' + (i * 0.06) + 's, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ' + (i * 0.06) + 's';
      cardObs.observe(card);
    });
  }

  // ===== Form Validation =====
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(function (field) {
        if (field.type === 'checkbox') {
          if (!field.checked) {
            valid = false;
            const wrap = field.closest('.form-checkbox');
            if (wrap) wrap.style.borderColor = '#dc2626';
          }
        } else if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#dc2626';
        } else {
          field.style.borderColor = '';
        }
      });

      const email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          valid = false;
          email.style.borderColor = '#dc2626';
        }
      }

      if (!valid) {
        e.preventDefault();
        const firstBad = form.querySelector('[style*="border-color: rgb(220, 38, 38)"]');
        if (firstBad && firstBad.focus) firstBad.focus();
      }
    });
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () { field.style.borderColor = ''; });
    });
  });

  // ===== Smooth scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ===== Product Card Deck - Auto-shuffle =====
  (function initDeck() {
    const track = document.getElementById('deck-track');
    const stage = document.getElementById('deck-stage');
    if (!track || !stage) return;
    const cards = Array.from(stage.querySelectorAll('.deck-card'));
    if (!cards.length) return;

    const total = cards.length;
    const counterEl = document.getElementById('deck-current');
    const totalEl = document.getElementById('deck-total');
    const progressEl = document.getElementById('deck-progress');
    const dotsWrap = document.getElementById('deck-dots');
    const prevBtn = document.getElementById('deck-prev');
    const nextBtn = document.getElementById('deck-next');

    const AUTO_INTERVAL_MS = 5000; // time per card

    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

    // Build dots
    if (dotsWrap) {
      cards.forEach(function (_, i) {
        const b = document.createElement('button');
        b.className = 'deck-dot';
        b.setAttribute('aria-label', 'Go to card ' + (i + 1));
        b.addEventListener('click', function () { goTo(i, true); });
        dotsWrap.appendChild(b);
      });
    }

    let currentIndex = 0;
    let autoTimer = null;
    let isPaused = false;
    let isVisible = false;

    function restartProgress() {
      if (!progressEl) return;
      // Force animation restart by toggling the class
      progressEl.classList.remove('is-running');
      progressEl.classList.remove('is-paused');
      progressEl.style.setProperty('--deck-duration', (AUTO_INTERVAL_MS / 1000) + 's');
      // Trigger reflow so animation resets
      void progressEl.offsetWidth;
      if (!isPaused && isVisible) {
        progressEl.classList.add('is-running');
      }
    }

    function pauseProgress() {
      if (progressEl) progressEl.classList.add('is-paused');
    }
    function resumeProgress() {
      if (progressEl) progressEl.classList.remove('is-paused');
    }

    function applyState() {
      cards.forEach(function (card, i) {
        card.classList.remove('is-behind-1', 'is-behind-2', 'is-behind-3', 'is-below', 'is-exited');
        const diff = i - currentIndex;
        if (diff < 0) card.classList.add('is-exited');
        else if (diff === 0) { /* active */ }
        else if (diff === 1) card.classList.add('is-behind-1');
        else if (diff === 2) card.classList.add('is-behind-2');
        else if (diff === 3) card.classList.add('is-behind-3');
        else card.classList.add('is-below');
      });

      if (counterEl) counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach(function (d, i) {
          d.classList.toggle('active', i === currentIndex);
        });
      }
      // Arrows are never disabled in auto-shuffle mode - they wrap around
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
    }

    function advance(delta) {
      currentIndex = (currentIndex + delta + total) % total;
      applyState();
      restartProgress();
    }

    function goTo(idx, userInitiated) {
      idx = ((idx % total) + total) % total;
      if (idx === currentIndex) return;
      currentIndex = idx;
      applyState();
      if (userInitiated) {
        // Reset the auto timer so the user has full duration to view the new card
        scheduleNext();
      }
      restartProgress();
    }

    function scheduleNext() {
      if (autoTimer) clearTimeout(autoTimer);
      if (isPaused || !isVisible) return;
      autoTimer = setTimeout(function () {
        advance(1);
        scheduleNext();
      }, AUTO_INTERVAL_MS);
    }

    function startAuto() {
      if (!isVisible) return;
      isPaused = false;
      resumeProgress();
      scheduleNext();
    }

    function stopAuto() {
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    }

    function pause() {
      isPaused = true;
      stopAuto();
      pauseProgress();
    }

    function resume() {
      if (isPaused) {
        isPaused = false;
        restartProgress();
        scheduleNext();
      }
    }

    // IntersectionObserver - only auto-advance while section is in view
    if ('IntersectionObserver' in window) {
      const visObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !isPaused) {
            restartProgress();
            scheduleNext();
          } else {
            stopAuto();
            pauseProgress();
          }
        });
      }, { threshold: 0.3 });
      visObs.observe(stage);
    } else {
      // Fallback: just assume visible
      isVisible = true;
      startAuto();
    }

    applyState();

    // Pause on hover over the stage
    stage.addEventListener('mouseenter', pause);
    stage.addEventListener('mouseleave', resume);

    // Pause when tab loses focus (don't keep timers running invisibly)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause();
      else resume();
    });

    // Arrow controls
    if (prevBtn) prevBtn.addEventListener('click', function () {
      advance(-1);
      scheduleNext();
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      advance(1);
      scheduleNext();
    });

    // Keyboard navigation when stage is focused or in view
    document.addEventListener('keydown', function (e) {
      if (!isVisible) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); advance(-1); scheduleNext(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); advance(1); scheduleNext(); }
    });

    // Card click opens product link
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        const href = card.dataset.href;
        if (href) window.location.href = href;
      });
      card.style.cursor = 'pointer';
    });
  })();

  // ===== Year in footer =====
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
