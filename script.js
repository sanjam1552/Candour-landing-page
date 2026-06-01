/**
 * CANDOUR OFFSITE — Premium Editorial Presentation
 * Complete light-theme presentation orchestrator.
 * Includes: Loading, Lenis smooth scroll, Custom cursor, GSAP ScrollTrigger reveals,
 * Glass glare updates, and interactive network canvases.
 */
function startExperience() {
  'use strict';

  // Force page scroll to top on fresh load/reload and prevent browser restoration
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Lock body scrolling during load
  document.body.style.overflow = 'hidden';

  // ─────────────────────────────────────────────
  // 1. LOADING SCREEN
  // ─────────────────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-bar-fill');
  let progress = 0;

  const loadInterval = setInterval(() => {
    progress += Math.random() * 25 + 5;
    if (progress >= 100) {
      progress = 100;
      if (loaderFill) loaderFill.style.width = '100%';
      clearInterval(loadInterval);
      setTimeout(() => {
        if (loader) loader.classList.add('loaded');
        document.body.style.overflow = '';
        initExperience();
      }, 500);
    } else {
      if (loaderFill) loaderFill.style.width = progress + '%';
    }
  }, 80);

  // ─────────────────────────────────────────────
  // 2. LENIS SMOOTH SCROLLING
  // ─────────────────────────────────────────────
  let lenisInstance = null;
  function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Force scroll to top on initialization to prevent scroll restoration jumps
    lenisInstance.scrollTo(0, { immediate: true });

    return lenisInstance;
  }

  // ─────────────────────────────────────────────
  // 3. CUSTOM CURSOR
  // ─────────────────────────────────────────────
  function initCursor() {
    const follower = document.getElementById('cursor-follower');
    const dot = document.getElementById('cursor-dot');
    const spotlight = document.getElementById('bg-spotlight');
    const gridGlowSpotlight = document.getElementById('grid-glow-spotlight');
    if (!follower || !dot) return;

    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let currentFollowerX = targetX, currentFollowerY = targetY;
    let currentDotX = targetX, currentDotY = targetY;
    let currentSpotlightX = targetX, currentSpotlightY = targetY;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function updateCursor() {
      currentFollowerX += (targetX - currentFollowerX) * 0.12;
      currentFollowerY += (targetY - currentFollowerY) * 0.12;
      currentDotX += (targetX - currentDotX) * 0.25;
      currentDotY += (targetY - currentDotY) * 0.25;
      currentSpotlightX += (targetX - currentSpotlightX) * 0.08;
      currentSpotlightY += (targetY - currentSpotlightY) * 0.08;

      follower.style.transform = `translate3d(${currentFollowerX}px, ${currentFollowerY}px, 0px) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${currentDotX}px, ${currentDotY}px, 0px) translate(-50%, -50%)`;

      if (spotlight) {
        spotlight.style.transform = `translate3d(${currentSpotlightX}px, ${currentSpotlightY}px, 0px) translate(-50%, -50%)`;
      }
      if (gridGlowSpotlight) {
        gridGlowSpotlight.style.transform = `translate3d(${currentSpotlightX + 40 - 300}px, ${currentSpotlightY + 40 - 300}px, 0px)`;
      }

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover target scales
    const hoverTargets = 'a, button, .glass-card, .culture-card-header, .nav-link, .image-placeholder';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        follower.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets) && !e.relatedTarget?.closest(hoverTargets)) {
        follower.classList.remove('hovering');
      }
    });
  }

  // ─────────────────────────────────────────────
  // 4. SCROLL PROGRESS
  // ─────────────────────────────────────────────
  function initScrollProgress() {
    gsap.to('#scroll-progress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      }
    });

    // Nav scrolled class state
    ScrollTrigger.create({
      start: 'top -50px',
      onEnter: () => document.getElementById('main-nav')?.classList.add('scrolled'),
      onLeaveBack: () => document.getElementById('main-nav')?.classList.remove('scrolled')
    });
  }

  // ─────────────────────────────────────────────
  // 5. GSAP SCROLL REVEALS (Enhanced & more dynamic)
  // ─────────────────────────────────────────────
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    ScrollTrigger.clearScrollMemory();

    // Staggered character reveals are now handled separately by initTextReveals() to allow high-end letter blur-ins.

    // ── Reveal texts elements ──
    const revealTexts = document.querySelectorAll('.reveal-text:not(.section-title):not(.closing-title):not(.engine-title)');
    revealTexts.forEach((text) => {
      gsap.to(text, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: text,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ── Closing Brand Custom Animation (triggered by tagline block to prevent scroll lock on tall viewports) ──
    const closingBrand = document.querySelector('.closing-brand');
    const closingTagline = document.querySelector('.closing-tagline');
    if (closingBrand) {
      gsap.to(closingBrand, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: closingTagline || '#section-closing',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // ── Hero Entrance ──
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .fromTo('.hero-badge', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo('.hero-title', { opacity: 0, y: 30, letterSpacing: '-0.04em', filter: 'blur(6px)' }, { opacity: 1, y: 0, letterSpacing: '-0.03em', filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .fromTo('.hero-cta-box', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
      .fromTo('.hero-visual-content', { opacity: 0, scale: 0.96, rotationY: 4 }, { opacity: 1, scale: 1, rotationY: 0, duration: 1.0, ease: 'power3.out' }, '-=0.7');

    // ── Challenge Bento Cards (Staggered slide-up with rotation tilt offset) ──
    gsap.fromTo('.section-challenge .bento-card',
      { opacity: 0, y: 55, scale: 0.93, rotation: 1.5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'back.out(1.1)',
        scrollTrigger: {
          trigger: '.bento-grid-4',
          start: 'top 85%'
        }
      }
    );

    // ── Challenge Energy Bar Chart Reveal ──
    gsap.fromTo('.energy-bar-friction',
      { attr: { width: 0 } },
      {
        attr: { width: 280 },
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.energy-chart-container',
          start: 'top 85%'
        }
      }
    );

    gsap.fromTo('.energy-bar-creation',
      { attr: { width: 0 } },
      {
        attr: { width: 120 },
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.energy-chart-container',
          start: 'top 85%'
        }
      }
    );

    gsap.fromTo('.energy-chart-visual text',
      { opacity: 0, y: 56 },
      {
        opacity: 1,
        y: 52,
        duration: 0.6,
        stagger: 0.25,
        ease: 'power2.out',
        delay: 0.8,
        scrollTrigger: {
          trigger: '.energy-chart-container',
          start: 'top 85%'
        }
      }
    );

    // ── Horizontal Cards Slider Slide-In ──
    gsap.fromTo('.section-shift .slider-card',
      { opacity: 0, x: 80, scale: 0.96 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#social-slider',
          start: 'top 85%'
        }
      }
    );

    // ── Pillars Progress Bars ──
    gsap.fromTo('.pillar',
      { opacity: 0, y: 40, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.engine-pillars',
          start: 'top 85%',
          onEnter: () => {
            document.querySelectorAll('.pillar-progress-fill').forEach((fill) => {
              const targetWidth = fill.getAttribute('data-progress');
              setTimeout(() => {
                fill.style.width = targetWidth + '%';
              }, 400);
            });
          }
        }
      }
    );

    // ── Pipeline Stages (Staggered slide-in from left) ──
    gsap.fromTo('.pipeline-stage',
      { opacity: 0, x: -35, scale: 0.97 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.scaling-pipeline',
          start: 'top 85%'
        }
      }
    );

    // ── Metrics count-up values ──
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach((metric) => {
      const targetVal = parseInt(metric.getAttribute('data-count'), 10);
      ScrollTrigger.create({
        trigger: metric,
        start: 'top 90%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: targetVal,
            duration: 2.0,
            ease: 'power2.out',
            onUpdate: function() {
              metric.textContent = Math.round(this.targets()[0].val);
            }
          });
        },
        once: true
      });
    });

    // ── Labs Cards ──
    gsap.fromTo('.lab-card',
      { opacity: 0, y: 45, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.labs-grid',
          start: 'top 85%'
        }
      }
    );

    // ── Comparison Destination Cards v2 ──
    gsap.fromTo('.section-destination .comparison-card-v2',
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.destination-comparisons-v2',
          start: 'top 85%'
        }
      }
    );
  }

  // ─────────────────────────────────────────────
  // 6. CARD INTERACTIVE TILT & GLARE (Poppins Glass cards)
  // ─────────────────────────────────────────────
  function initGlassCardsTilt() {
    const cards = document.querySelectorAll('.glass-card:not(.cinema-player-card):not(.comparison-modal-card), .pillar, .lab-card, .pipeline-stage, .choice-card');
    
    // Store coordinates state for each card to run in a unified RAF loop
    const cardsState = [];
    
    cards.forEach((card) => {
      const state = {
        element: card,
        // Target values
        targetRotX: 0,
        targetRotY: 0,
        targetTransY: 0,
        targetGlareX: 0,
        targetGlareY: 0,
        targetGlareOpacity: 0,
        // Current interpolated values
        currentRotX: 0,
        currentRotY: 0,
        currentTransY: 0,
        currentGlareX: 0,
        currentGlareY: 0,
        currentGlareOpacity: 0,
        isHovered: false,
        isAnimating: false
      };
      
      cardsState.push(state);
      
      let rect = null;
      card.addEventListener('mouseenter', () => {
        state.isHovered = true;
        state.isAnimating = true;
        state.targetGlareOpacity = 1;
        rect = card.getBoundingClientRect();
      });
      
      card.addEventListener('mousemove', (e) => {
        if (!rect) {
          rect = card.getBoundingClientRect();
        }
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (card.classList.contains('dashboard-demo-card')) {
          return;
        }

        // Compute 3D rotations based on coordinates
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8; // Slightly increased rotation depth
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        rect = null;
        if (card.classList.contains('dashboard-demo-card')) {
          return;
        }
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0deg)';
      });
    });
  }

  // ─────────────────────────────────────────────
  // 7. CULTURE CARD ACCORDION DETAILS
  // ─────────────────────────────────────────────
  function initCultureCards() {
    const headers = document.querySelectorAll('.culture-card-header');
    headers.forEach((header) => {
      header.addEventListener('click', () => {
        const card = header.closest('.culture-card');
        if (!card) return;
        const isActive = card.classList.contains('active');
        // Toggle active state
        if (isActive) {
          card.classList.remove('active');
        } else {
          document.querySelectorAll('.culture-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }

        // Recalculate scroll limits in Lenis
        setTimeout(() => {
          if (lenisInstance) lenisInstance.resize();
        }, 500);
      });
    });
  }

  // ─────────────────────────────────────────────
  // 8. NAVIGATION ANCHORS
  // ─────────────────────────────────────────────
  function initNavigation() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        const section = document.getElementById(targetId);
        if (section && lenisInstance) {
          lenisInstance.scrollTo(section, { offset: -40, duration: 1.0 });
        }
      });

      // Active state highlight sync on scroll using GSAP ScrollTrigger
      const targetId = link.getAttribute('data-section');
      const section = document.getElementById(targetId);
      if (section) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          },
          onEnterBack: () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });

    const beginBtn = document.getElementById('begin-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        const section = document.getElementById('section-question');
        if (section && lenisInstance) {
          lenisInstance.scrollTo(section, { offset: -40, duration: 1.0 });
        }
      });
    }

    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('live-demo-card');
        if (target && lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -100, duration: 1.2 });
        }
      });
    }
  }

  // ─────────────────────────────────────────────
  // 9. MOCK CARD HORIZONTAL SLIDER (DRAG + BTNS - Adjusted to 600px cards)
  // ─────────────────────────────────────────────
  function initHorizontalSlider() {
    const sliderEl = document.getElementById('social-slider');
    const track = sliderEl?.querySelector('.slider-track');
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    if (!sliderEl || !track) return;

    let isDragging = false;
    let startX = 0;
    let currentTranslateX = 0;
    let prevTranslateX = 0;
    let maxTranslateX = 0;

    function calcSliderBounds() {
      maxTranslateX = Math.min(0, sliderEl.offsetWidth - track.offsetWidth);
    }
    calcSliderBounds();
    window.addEventListener('resize', calcSliderBounds);

    // Slide button clicks - Card width 600px + gap 32px = 632px
    prevBtn?.addEventListener('click', () => {
      currentTranslateX = Math.min(0, currentTranslateX + 632);
      prevTranslateX = currentTranslateX;
      gsap.to(track, { x: currentTranslateX, duration: 0.6, ease: 'power3.out' });
    });

    nextBtn?.addEventListener('click', () => {
      currentTranslateX = Math.max(maxTranslateX, currentTranslateX - 632);
      prevTranslateX = currentTranslateX;
      gsap.to(track, { x: currentTranslateX, duration: 0.6, ease: 'power3.out' });
    });

    // Touch/Mouse Drag events
    sliderEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      track.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const xDiff = e.clientX - startX;
      currentTranslateX = Math.max(maxTranslateX, Math.min(0, prevTranslateX + xDiff));
      gsap.set(track, { x: currentTranslateX });
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      prevTranslateX = currentTranslateX;
    });

    sliderEl.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        prevTranslateX = currentTranslateX;
      }
    });

    // Mobile touch support
    sliderEl.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    sliderEl.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const xDiff = e.touches[0].clientX - startX;
      currentTranslateX = Math.max(maxTranslateX, Math.min(0, prevTranslateX + xDiff));
      gsap.set(track, { x: currentTranslateX });
    }, { passive: true });

    sliderEl.addEventListener('touchend', () => {
      isDragging = false;
      prevTranslateX = currentTranslateX;
    });
  }

  // ─────────────────────────────────────────────
  // 10. INTERACTIVE NETWORK (MEMORY SECTION CANVAS)
  // ─────────────────────────────────────────────
  function initMemoryNetwork() {
    const container = document.getElementById('memory-network');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const labels = ['Audience Data', 'Visual Layouts', 'Conversion Angles', 'Brand DNA', 'Creative Assets', 'Strategic Briefs', 'Feedback Logs'];
    const nodes = labels.map((lbl, idx) => {
      const angle = (idx / labels.length) * Math.PI * 2;
      return {
        x: 0, y: 0,
        baseAngle: angle,
        label: lbl,
        radius: 5,
        isHovered: false,
        particles: []
      };
    });

    const centerNode = {
      label: 'Creative Memory',
      radius: 9,
      color: '#1b2acf'
    };

    let mousePos = { x: -1000, y: -1000 };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mousePos = { x: -1000, y: -1000 };
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      // Scale orbit size slightly larger to give text more space
      const orbitSize = Math.min(canvas.width, canvas.height) * 0.35;
      const time = Date.now() * 0.001;

      nodes.forEach((node) => {
        // Synchronized speed: nodes rotate in perfect lockstep to keep angular separation constant
        const curAngle = node.baseAngle + time * 0.12;
        const targetX = cx + Math.cos(curAngle) * orbitSize;
        const targetY = cy + Math.sin(curAngle) * orbitSize;

        const dist = Math.hypot(targetX - mousePos.x, targetY - mousePos.y);
        if (dist < 80) {
          node.isHovered = true;
          node.x += (mousePos.x - node.x) * 0.1;
          node.y += (mousePos.y - node.y) * 0.1;
          node.radius = 7;

          // Spawn data packet streaming particles
          if (Math.random() < 0.12) {
            node.particles.push(0);
          }
        } else {
          node.isHovered = false;
          node.x += (targetX - node.x) * 0.08;
          node.y += (targetY - node.y) * 0.08;
          node.radius = 5;
        }

        // Draw connections
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = node.isHovered ? 'rgba(27, 42, 207, 0.25)' : 'rgba(226, 224, 215, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Update and draw streaming particles
        node.particles = node.particles.map(p => p + 0.02).filter(p => p < 1);
        node.particles.forEach((p) => {
          const px = node.x + (cx - node.x) * p;
          const py = node.y + (cy - node.y) * p;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#1b2acf';
          ctx.shadowColor = '#1b2acf';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        });

        // Draw orbiting nodes
        ctx.fillStyle = node.isHovered ? '#1b2acf' : '#7c7b8c';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw labels radiating outwards away from center (prevents collisions)
        ctx.fillStyle = '#3d3c4a';
        ctx.font = '600 10px Poppins, sans-serif';

        const cos = Math.cos(curAngle);
        const sin = Math.sin(curAngle);

        if (cos > 0.4) {
          // Right side: align left, offset right
          ctx.textAlign = 'left';
          ctx.fillText(node.label, node.x + node.radius + 6, node.y + 3);
        } else if (cos < -0.4) {
          // Left side: align right, offset left
          ctx.textAlign = 'right';
          ctx.fillText(node.label, node.x - node.radius - 6, node.y + 3);
        } else {
          // Top or Bottom: align center
          ctx.textAlign = 'center';
          if (sin < 0) {
            // Top: offset above
            ctx.fillText(node.label, node.x, node.y - node.radius - 6);
          } else {
            // Bottom: offset below
            ctx.fillText(node.label, node.x, node.y + node.radius + 12);
          }
        }
      });

      ctx.fillStyle = centerNode.color;
      ctx.beginPath();
      ctx.arc(cx, cy, centerNode.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0d0c1b';
      ctx.font = '700 11px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(centerNode.label, cx, cy + centerNode.radius + 18);

      frameId = requestAnimationFrame(draw);
    }
    
    let isVisible = false;
    let frameId = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          draw();
        }
      });
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }

  // ─────────────────────────────────────────────
  // 11. INTERACTIVE GROWTH ECOSYSTEM CANVAS (CULTURE)
  // ─────────────────────────────────────────────
  function initCultureEcosystem() {
    const container = document.getElementById('culture-ecosystem');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const topics = ['WebGL', 'CSS Motion', 'Copywriting', 'Design Systems', 'Typography', 'Creative Tech'];
    const particles = topics.map((t) => {
      return {
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 5 + 32, // bubble radius
        label: t,
        distortion: 0,
        distortionAngle: 0
      };
    });

    function resize() {
      const w = container.offsetWidth || 500;
      const h = container.offsetHeight || 220;
      const sizeChanged = canvas.width !== w || canvas.height !== h;
      
      if (sizeChanged) {
        canvas.width = w;
        canvas.height = h;
        
        // Distribute particles across the canvas if they are at (0,0) or outside the new bounds
        particles.forEach((p, idx) => {
          if (p.x <= p.radius || p.x >= canvas.width - p.radius || p.y <= p.radius || p.y >= canvas.height - p.radius) {
            const cols = 3;
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            p.x = p.radius + col * ((canvas.width - p.radius * 2) / (cols - 1 || 1)) * 0.8 + Math.random() * 10;
            p.y = p.radius + row * ((canvas.height - p.radius * 2) / 2) * 0.8 + Math.random() * 10;
          }
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    let mousePos = { x: -1000, y: -1000 };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mousePos = { x: -1000, y: -1000 };
    });

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Repulsion between bubbles to prevent clumping/overlapping
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = p1.radius + p2.radius + 12; // combined radii + padding
          if (dist < minDist && dist > 0.1) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDist - dist;
            const force = overlap * 0.04;
            const pushX = Math.cos(angle) * force;
            const pushY = Math.sin(angle) * force;
            
            p1.vx -= pushX;
            p1.vy -= pushY;
            p2.vx += pushX;
            p2.vy += pushY;
          }
        }
      }

      // 2. Update and draw each particle
      particles.forEach((p, idx) => {
        // Friction and damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wall collisions (bounce)
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = Math.abs(p.vx) * 0.8;
        } else if (p.x + p.radius > canvas.width) {
          p.x = canvas.width - p.radius;
          p.vx = -Math.abs(p.vx) * 0.8;
        }
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy = Math.abs(p.vy) * 0.8;
        } else if (p.y + p.radius > canvas.height) {
          p.y = canvas.height - p.radius;
          p.vy = -Math.abs(p.vy) * 0.8;
        }

        // Gentle pull towards the center of canvas to keep them in focus
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const toCenterX = centerX - p.x;
        const toCenterY = centerY - p.y;
        const distToCenter = Math.hypot(toCenterX, toCenterY);
        if (distToCenter > 10) {
          p.vx += (toCenterX / distToCenter) * 0.006;
          p.vy += (toCenterY / distToCenter) * 0.006;
        }

        // Maintain constant float speed (no stopping completely)
        const speed = Math.hypot(p.vx, p.vy);
        const minSpeed = 0.22;
        const maxSpeed = 1.2;
        if (speed < minSpeed) {
          const angle = speed > 0.01 ? Math.atan2(p.vy, p.vx) : Math.random() * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.06;
          p.vy += Math.sin(angle) * 0.06;
        } else if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Spring interaction with cursor
        const dist = Math.hypot(p.x - mousePos.x, p.y - mousePos.y);
        if (dist < 130) {
          const angle = Math.atan2(p.y - mousePos.y, p.x - mousePos.x);
          const force = (130 - dist) * 0.05;
          p.vx += Math.cos(angle) * force * 0.12;
          p.vy += Math.sin(angle) * force * 0.12;
          
          p.distortion += (0.18 - p.distortion) * 0.1;
          p.distortionAngle = angle;
        } else {
          p.distortion += (0 - p.distortion) * 0.08;
        }

        // Draw connections between nearby bubbles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(27, 42, 207, ${0.15 * (1 - distance / 160)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw clean floating bubble circles with glass distortion mesh
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.distortionAngle);
        
        const scaleX = 1 + p.distortion;
        const scaleY = 1 - p.distortion;
        ctx.scale(scaleX, scaleY);

        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(27, 42, 207, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-p.radius * 0.22, -p.radius * 0.22, p.radius * 0.65, Math.PI * 1.25, Math.PI * 1.75);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        ctx.fillStyle = '#3d3c4a';
        ctx.font = '600 10px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.label, p.x, p.y);
      });

      frameId = requestAnimationFrame(update);
    }

    let isVisible = false;
    let frameId = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          update();
        }
      });
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }

  // ─────────────────────────────────────────────
  // 12. ADVANCED TEXT BLUR-IN REVEAL ON SCROLL
  // ─────────────────────────────────────────────
  function initTextReveals() {
    const splitHeaders = document.querySelectorAll('.section-title, .closing-title, .engine-title');
    
    splitHeaders.forEach((header) => {
      const text = header.innerText.trim();
      header.innerHTML = '';
      
      const words = text.split(' ');
      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word-span';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        
        const chars = Array.from(word);
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'char-span';
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block';
          charSpan.style.opacity = '0';
          charSpan.style.filter = 'blur(8px)';
          charSpan.style.transform = 'translate3d(0, 22px, 0) scaleY(1.1)';
          charSpan.style.willChange = 'opacity, filter, transform';
          wordSpan.appendChild(charSpan);
        });
        
        header.appendChild(wordSpan);
        
        if (wordIdx < words.length - 1) {
          const space = document.createElement('span');
          space.innerHTML = '&nbsp;';
          space.style.display = 'inline-block';
          header.appendChild(space);
        }
      });
      
      // GSAP trigger to reveal parent header and its char spans staggered
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      gsap.to(header.querySelectorAll('.char-span'), {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        scaleY: 1,
        stagger: 0.02,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // ─────────────────────────────────────────────
  // 13. SPRINGY MAGNET BUTTON INTERACTIONS
  // ─────────────────────────────────────────────
  function initMagnetButtons() {
    const magnets = document.querySelectorAll('.cta-button, .cta-secondary-button, .slider-arrow-btn, .nav-link');
    magnets.forEach((btn) => {
      let rect = null;
      btn.addEventListener('mouseenter', () => {
        rect = btn.getBoundingClientRect();
      });

      btn.addEventListener('mousemove', (e) => {
        if (!rect) {
          rect = btn.getBoundingClientRect();
        }
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Gentle pull vector
        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        rect = null;
        // Elastic rebound snap back
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1.1, 0.45)'
        });
      });
    });
  }

  // ─────────────────────────────────────────────
  // 14. SCROLL-LINKED SPOTLIGHT GRADIENT COLORS
  // ─────────────────────────────────────────────
  function initColorShiftingSpotlight() {
    const sections = document.querySelectorAll('section');
    const spotlight = document.getElementById('bg-spotlight');
    
    // HSL/RGB colors tailored to each slide (Toned down opacity values & Blue replaced with Pink #a23f87)
    const sectionColors = {
      'section-hero': ['rgba(162, 63, 135, 0.10)', 'rgba(234, 88, 12, 0.05)'],
      'section-question': ['rgba(162, 63, 135, 0.10)', 'rgba(234, 88, 12, 0.05)'],
      'section-shift': ['rgba(244, 63, 94, 0.10)', 'rgba(236, 72, 153, 0.05)'],
      'section-challenge': ['rgba(244, 63, 94, 0.10)', 'rgba(236, 72, 153, 0.05)'],
      'section-engine': ['rgba(234, 88, 12, 0.10)', 'rgba(249, 115, 22, 0.05)'],
      'section-memory': ['rgba(234, 88, 12, 0.10)', 'rgba(249, 115, 22, 0.05)'],
      'section-scaling': ['rgba(168, 85, 247, 0.10)', 'rgba(99, 102, 241, 0.05)'],
      'section-culture': ['rgba(168, 85, 247, 0.10)', 'rgba(99, 102, 241, 0.05)'],
      'section-labs': ['rgba(16, 185, 129, 0.10)', 'rgba(14, 165, 233, 0.05)'],
      'section-demo': ['rgba(162, 63, 135, 0.10)', 'rgba(79, 70, 229, 0.05)'],
      'section-destination': ['rgba(162, 63, 135, 0.10)', 'rgba(79, 70, 229, 0.05)'],
      'section-closing': ['rgba(99, 102, 241, 0.10)', 'rgba(168, 85, 247, 0.05)']
    };
    
    if (!spotlight) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const colors = sectionColors[entry.target.id] || ['rgba(162, 63, 135, 0.03)', 'rgba(79, 70, 229, 0.01)'];
          spotlight.style.setProperty('--spotlight-color-1', colors[0]);
          spotlight.style.setProperty('--spotlight-color-2', colors[1]);
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  // ─────────────────────────────────────────────
  // 14. EXPANDABLE COMPARISON CARDS
  // ─────────────────────────────────────────────
  // ─────────────────────────────────────────────
  // 14. EXPANDABLE COMPARISON CARDS (MODAL OVERLAY)
  // ─────────────────────────────────────────────
  function initExpandableCards() {
    const cards = document.querySelectorAll('.expandable-card');
    const overlay = document.getElementById('comparison-cinema-overlay');
    if (!overlay) return;

    const closeBtn = overlay.querySelector('.exit-comparison-btn');
    const backdrop = overlay.querySelector('.cinema-backdrop');
    
    const mTitle = document.getElementById('comparison-modal-title');
    const mDesc = document.getElementById('comparison-modal-desc');
    const imgBefore = document.getElementById('comparison-img-before');
    const imgAfter = document.getElementById('comparison-img-after');
    const badgeBefore = document.getElementById('comparison-badge-before');
    const badgeAfter = document.getElementById('comparison-badge-after');

    function openModal(card) {
      const title = card.querySelector('.title-row h3').textContent;
      const desc = card.querySelector('.description').textContent;
      
      const beforeImgEl = card.querySelector('.expanded-comparison .comparison-item:first-child img');
      const afterImgEl = card.querySelector('.expanded-comparison .comparison-item:last-child img');
      
      const beforeBadgeEl = card.querySelector('.expanded-comparison .comparison-item:first-child .comparison-badge');
      const afterBadgeEl = card.querySelector('.expanded-comparison .comparison-item:last-child .comparison-badge');

      if (!beforeImgEl || !afterImgEl) return;

      const beforeSrc = beforeImgEl.getAttribute('src');
      const afterSrc = afterImgEl.getAttribute('src');
      const beforeBadge = beforeBadgeEl ? beforeBadgeEl.textContent : 'Before';
      const afterBadge = afterBadgeEl ? afterBadgeEl.textContent : 'After';

      if (mTitle) mTitle.textContent = title;
      if (mDesc) mDesc.textContent = desc;
      if (imgBefore) imgBefore.src = beforeSrc;
      if (imgAfter) imgAfter.src = afterSrc;
      if (badgeBefore) badgeBefore.textContent = beforeBadge;
      if (badgeAfter) badgeAfter.textContent = afterBadge;

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        openModal(card);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ─────────────────────────────────────────────
  // 15. MAIN INITIALIZATION
  // ─────────────────────────────────────────────
  function initExperience() {
    initLenis();
    initCursor();
    initScrollProgress();
    initScrollAnimations();
    initTextReveals();
    initGlassCardsTilt();
    initMagnetButtons();
    initCultureCards();
    initNavigation();
    initHorizontalSlider();
    initMemoryNetwork();
    initCultureEcosystem();
    initMetaGlasses3D();
    initSmarterVideoPlayer();
    initExpandableCards();
    initDashboardDemoCanvas();
    initHeroEngine();
  }

  // ─────────────────────────────────────────────
  // 14. 3D ROTATING GLASSES DEMO (THREE.JS)
  // ─────────────────────────────────────────────
  function initMetaGlasses3D() {
    const container = document.getElementById('meta-glasses-canvas');
    if (!container) return;

    // Create Scene
    const scene = new THREE.Scene();

    // Create Camera
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // Create Renderer with transparent background and antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x1b2acf, 1.5, 10);
    pointLight.position.set(0, -2, 3);
    scene.add(pointLight);

    // Build Sunglasses 3D Model Group (Ray-Ban Meta Style)
    const glassesGroup = new THREE.Group();
    
    // 1. Materials
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a, // Sleek premium matte black
      roughness: 0.52,
      metalness: 0.06
    });

    // Create Gradient Lenses with Canvas Textures
    const canvasL = document.createElement('canvas');
    canvasL.width = 512;
    canvasL.height = 512;
    const ctxL = canvasL.getContext('2d');
    const gradL = ctxL.createLinearGradient(0, 0, 0, 512);
    gradL.addColorStop(0, 'rgba(15, 17, 20, 0.98)');
    gradL.addColorStop(0.35, 'rgba(25, 28, 32, 0.85)');
    gradL.addColorStop(0.7, 'rgba(45, 50, 55, 0.55)');
    gradL.addColorStop(1, 'rgba(75, 80, 85, 0.2)');
    ctxL.fillStyle = gradL;
    ctxL.fillRect(0, 0, 512, 512);
    // Draw white cursive script logo "Ray-Ban P" on top-left outer corner (U=0.08, V=0.85)
    ctxL.font = 'italic bold 28px "Georgia", "Times New Roman", serif';
    ctxL.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctxL.fillText('Ray-Ban P', 45, 75);

    const textureL = new THREE.CanvasTexture(canvasL);
    const lensMatL = new THREE.MeshStandardMaterial({
      map: textureL,
      roughness: 0.04,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });

    const canvasR = document.createElement('canvas');
    canvasR.width = 512;
    canvasR.height = 512;
    const ctxR = canvasR.getContext('2d');
    const gradR = ctxR.createLinearGradient(0, 0, 0, 512);
    gradR.addColorStop(0, 'rgba(15, 17, 20, 0.98)');
    gradR.addColorStop(0.35, 'rgba(25, 28, 32, 0.85)');
    gradR.addColorStop(0.7, 'rgba(45, 50, 55, 0.55)');
    gradR.addColorStop(1, 'rgba(75, 80, 85, 0.2)');
    ctxR.fillStyle = gradR;
    ctxR.fillRect(0, 0, 512, 512);
    // Draw subtle, faint "RB" engraving on the outer edge (U=0.86, V=0.53)
    ctxR.font = 'bold 20px "Georgia", serif';
    ctxR.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctxR.fillText('RB', 440, 240);

    const textureR = new THREE.CanvasTexture(canvasR);
    const lensMatR = new THREE.MeshStandardMaterial({
      map: textureR,
      roughness: 0.04,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });

    // 2. Front Frame Shape (Modern flat-brow Wayfarer - Ray-Ban Meta Style)
    const frameShape = new THREE.Shape();
    frameShape.moveTo(0, 0.28); // Bridge top center
    frameShape.lineTo(0.35, 0.28); // Bridge top right
    frameShape.bezierCurveTo(0.9, 0.30, 1.5, 0.30, 1.85, 0.26); // Flat browline extending out, curving slightly down at the end
    frameShape.bezierCurveTo(1.98, 0.24, 2.05, 0.16, 2.05, 0.05); // Smoothly rounded outer corner going down (NO wings or horns!)
    frameShape.bezierCurveTo(2.00, -0.40, 1.85, -0.78, 1.68, -0.92); // Outer rim down
    frameShape.bezierCurveTo(1.48, -1.06, 0.90, -1.06, 0.70, -0.80); // Bottom rim curve
    frameShape.bezierCurveTo(0.55, -0.45, 0.45, -0.05, 0, -0.05); // Inner bridge
    
    // Left side (symmetrical)
    frameShape.bezierCurveTo(-0.45, -0.05, -0.55, -0.45, -0.70, -0.80);
    frameShape.bezierCurveTo(-0.90, -1.06, -1.48, -1.06, -1.68, -0.92);
    frameShape.bezierCurveTo(-1.85, -0.78, -2.00, -0.40, -2.05, 0.05);
    frameShape.bezierCurveTo(-2.05, 0.16, -1.98, 0.24, -1.85, 0.26);
    frameShape.bezierCurveTo(-1.5, 0.30, -0.9, 0.30, -0.35, 0.28);
    frameShape.lineTo(0, 0.28);
    frameShape.closePath();

    // Right cutout (Lens hole)
    const holePathR = new THREE.Path();
    holePathR.moveTo(0.55, -0.10);
    holePathR.bezierCurveTo(0.65, 0.14, 0.95, 0.18, 1.70, 0.15); // top edge of lens
    holePathR.bezierCurveTo(1.82, 0.12, 1.88, -0.10, 1.85, -0.35); // outer edge of lens
    holePathR.bezierCurveTo(1.80, -0.65, 1.65, -0.82, 1.45, -0.85); // bottom-outer
    holePathR.bezierCurveTo(1.25, -0.88, 0.85, -0.88, 0.70, -0.75); // bottom edge
    holePathR.bezierCurveTo(0.60, -0.50, 0.50, -0.25, 0.55, -0.10);
    frameShape.holes.push(holePathR);

    // Left cutout (Lens hole)
    const holePathL = new THREE.Path();
    holePathL.moveTo(-0.55, -0.10);
    holePathL.bezierCurveTo(-0.60, -0.25, -0.50, -0.50, -0.70, -0.75);
    holePathL.bezierCurveTo(-0.85, -0.88, -1.25, -0.88, -1.45, -0.85);
    holePathL.bezierCurveTo(-1.65, -0.82, -1.80, -0.65, -1.85, -0.35);
    holePathL.bezierCurveTo(-1.88, -0.10, -1.82, 0.12, -1.70, 0.15);
    holePathL.bezierCurveTo(-0.95, 0.18, -0.65, 0.14, -0.55, -0.10);
    frameShape.holes.push(holePathL);

    // Extrude front frame with rounded bevel
    const extrudeSettings = {
      depth: 0.18, // Thicker premium acetate frame
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035
    };
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
    const frontFrame = new THREE.Mesh(frameGeo, frameMat);
    frontFrame.position.z = -0.09;
    glassesGroup.add(frontFrame);

    // 3. Nose Pads (Realistic structural additions on the back of the bridge)
    const nosePadGeo = new THREE.BoxGeometry(0.16, 0.30, 0.18);
    const nosePadL = new THREE.Mesh(nosePadGeo, frameMat);
    nosePadL.position.set(-0.35, -0.18, -0.12);
    nosePadL.rotation.set(0.1, 0.2, -0.2);
    glassesGroup.add(nosePadL);

    const nosePadR = new THREE.Mesh(nosePadGeo, frameMat);
    nosePadR.position.set(0.35, -0.18, -0.12);
    nosePadR.rotation.set(0.1, -0.2, 0.2);
    glassesGroup.add(nosePadR);

    // 4. Lenses
    const lensShapeL = new THREE.Shape();
    lensShapeL.moveTo(-1.70, 0.15);
    lensShapeL.bezierCurveTo(-0.95, 0.18, -0.65, 0.14, -0.55, -0.10);
    lensShapeL.bezierCurveTo(-0.50, -0.25, -0.60, -0.50, -0.70, -0.75);
    lensShapeL.bezierCurveTo(-0.85, -0.88, -1.25, -0.88, -1.45, -0.85);
    lensShapeL.bezierCurveTo(-1.65, -0.82, -1.80, -0.65, -1.85, -0.35);
    lensShapeL.bezierCurveTo(-1.90, -0.10, -1.85, 0.12, -1.70, 0.15);
    lensShapeL.closePath();
    const lensGeoL = new THREE.ExtrudeGeometry(lensShapeL, { depth: 0.02, bevelEnabled: false });
    const lensL = new THREE.Mesh(lensGeoL, lensMatL);
    lensL.position.z = 0.02;
    glassesGroup.add(lensL);

    const lensShapeR = new THREE.Shape();
    lensShapeR.moveTo(0.55, -0.10);
    lensShapeR.bezierCurveTo(0.65, 0.14, 0.95, 0.18, 1.70, 0.15);
    lensShapeR.bezierCurveTo(1.85, 0.12, 1.90, -0.10, 1.85, -0.35);
    lensShapeR.bezierCurveTo(1.80, -0.65, 1.65, -0.82, 1.45, -0.85);
    lensShapeR.bezierCurveTo(1.25, -0.88, 0.85, -0.88, 0.70, -0.75);
    lensShapeR.bezierCurveTo(0.60, -0.50, 0.50, -0.25, 0.55, -0.10);
    lensShapeR.closePath();
    const lensGeoR = new THREE.ExtrudeGeometry(lensShapeR, { depth: 0.02, bevelEnabled: false });
    const lensR = new THREE.Mesh(lensGeoR, lensMatR);
    lensR.position.z = 0.02;
    glassesGroup.add(lensR);

    // 5. Smart Cameras on Horns
    // Bezel for camera & indicator LED (circular, glossy chrome ring)
    const bezelGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.02, 24);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.95,
      roughness: 0.12
    });

    const lensGlassGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.022, 24);
    lensGlassGeo.rotateX(Math.PI / 2);
    const lensGlassMat = new THREE.MeshStandardMaterial({
      color: 0x050f14, // Dark refractive blue-black lens core
      metalness: 0.95,
      roughness: 0.01,
      transparent: true,
      opacity: 0.98
    });

    // LEFT CAMERA (wearer's right, viewer's left)
    const camGroupL = new THREE.Group();
    const bezelL = new THREE.Mesh(bezelGeo, bezelMat);
    camGroupL.add(bezelL);
    const glassL = new THREE.Mesh(lensGlassGeo, lensGlassMat);
    glassL.position.z = 0.002;
    camGroupL.add(glassL);
    // Cyan sensor lens coating reflection
    const sensorCoreGeo = new THREE.SphereGeometry(0.02, 12, 12);
    const sensorCoreMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const sensorCoreL = new THREE.Mesh(sensorCoreGeo, sensorCoreMat);
    sensorCoreL.position.set(-0.018, 0.018, 0.012);
    camGroupL.add(sensorCoreL);
    camGroupL.position.set(-1.78, 0.12, 0.09);
    glassesGroup.add(camGroupL);

    // RIGHT INDICATOR / LED (wearer's left, viewer's right)
    const camGroupR = new THREE.Group();
    const bezelR = new THREE.Mesh(bezelGeo, bezelMat);
    camGroupR.add(bezelR);
    const glassR = new THREE.Mesh(lensGlassGeo, lensGlassMat);
    glassR.position.z = 0.002;
    camGroupR.add(glassR);
    // Glowing orange/yellow capture LED emitter
    const ledGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.01, 16);
    ledGeo.rotateX(Math.PI / 2);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xffeebb,
      emissive: 0xffaa44,
      emissiveIntensity: 0.35,
      roughness: 0.2
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0, 0, 0.012);
    camGroupR.add(ledMesh);
    camGroupR.position.set(1.78, 0.12, 0.09);
    glassesGroup.add(camGroupR);

    // 6. Thick premium Temple Arms (profile profile extrusion)
    const templeShape = new THREE.Shape();
    templeShape.moveTo(0, 0.22); // High brow connection point
    templeShape.lineTo(0.6, 0.20); // Straight flow
    templeShape.bezierCurveTo(1.4, 0.15, 1.8, 0.08, 2.1, -0.15); // Drop profile
    templeShape.bezierCurveTo(2.35, -0.32, 2.50, -0.60, 2.45, -0.85); // Back hook curve
    templeShape.lineTo(2.30, -0.85); // Rounded end tip
    templeShape.bezierCurveTo(2.35, -0.65, 2.22, -0.42, 2.00, -0.28); // Bottom scoop
    templeShape.bezierCurveTo(1.70, -0.10, 1.30, -0.08, 0.60, -0.10); // Center mass width
    templeShape.lineTo(0, -0.12); // Hinge bottom
    templeShape.closePath();

    const templeExtrudeSettings = {
      depth: 0.08, // Premium thickness
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    };
    const templeGeo = new THREE.ExtrudeGeometry(templeShape, templeExtrudeSettings);

    const templeL = new THREE.Mesh(templeGeo, frameMat);
    templeL.position.set(-1.98, 0.06, -0.02);
    templeL.rotation.y = Math.PI / 2 + 0.03; // angled inward slightly
    glassesGroup.add(templeL);

    const templeR = new THREE.Mesh(templeGeo, frameMat);
    templeR.position.set(1.98, 0.06, -0.02);
    templeR.rotation.y = Math.PI / 2 - 0.03;
    glassesGroup.add(templeR);

    // 7. Dynamic Canvas Script Logo on Temples
    const canvasLogo = document.createElement('canvas');
    canvasLogo.width = 256;
    canvasLogo.height = 64;
    const ctxLogo = canvasLogo.getContext('2d');
    ctxLogo.clearRect(0, 0, 256, 64);
    ctxLogo.font = 'italic bold 32px "Georgia", "Times New Roman", serif';
    ctxLogo.fillStyle = '#f0f0f0';
    ctxLogo.textAlign = 'center';
    ctxLogo.textBaseline = 'middle';
    ctxLogo.fillText('Ray-Ban', 128, 32);

    const logoTex = new THREE.CanvasTexture(canvasLogo);
    const logoTexMat = new THREE.MeshStandardMaterial({
      map: logoTex,
      transparent: true,
      roughness: 0.2,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    // Left logo (mirrored horizontally to read correctly from front to back)
    const logoTexL = logoTex.clone();
    logoTexL.repeat.x = -1;
    logoTexL.offset.x = 1;
    const logoTexMatL = new THREE.MeshStandardMaterial({
      map: logoTexL,
      transparent: true,
      roughness: 0.2,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    const logoPlateGeo = new THREE.PlaneGeometry(0.5, 0.125);

    const logoMeshL = new THREE.Mesh(logoPlateGeo, logoTexMatL);
    logoMeshL.position.set(-2.035, 0.11, -0.45);
    logoMeshL.rotation.y = -Math.PI / 2 + 0.03;
    glassesGroup.add(logoMeshL);

    // Right logo
    const logoMeshR = new THREE.Mesh(logoPlateGeo, logoTexMat);
    logoMeshR.position.set(2.035, 0.11, -0.45);
    logoMeshR.rotation.y = Math.PI / 2 - 0.03;
    glassesGroup.add(logoMeshR);

    // 8. Silver Hinges on Inner Corners (highly detailed)
    const hingeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.95,
      roughness: 0.08
    });

    const hingePlateGeo = new THREE.BoxGeometry(0.12, 0.16, 0.08);
    const hingeJointGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.14, 16);
    hingeJointGeo.rotateX(Math.PI / 2);

    const hingeL = new THREE.Group();
    hingeL.add(new THREE.Mesh(hingePlateGeo, hingeMat));
    const jointL = new THREE.Mesh(hingeJointGeo, hingeMat);
    jointL.position.set(0.05, 0, -0.04);
    hingeL.add(jointL);
    hingeL.position.set(-1.86, 0.08, -0.08);
    glassesGroup.add(hingeL);

    const hingeR = new THREE.Group();
    hingeR.add(new THREE.Mesh(hingePlateGeo, hingeMat));
    const jointR = new THREE.Mesh(hingeJointGeo, hingeMat);
    jointR.position.set(-0.05, 0, -0.04);
    hingeR.add(jointR);
    hingeR.position.set(1.86, 0.08, -0.08);
    glassesGroup.add(hingeR);

    // 9. Inner Temple Manufacturer Brand Print Details
    const canvasPrintL = document.createElement('canvas');
    canvasPrintL.width = 256;
    canvasPrintL.height = 32;
    const ctxPrintL = canvasPrintL.getContext('2d');
    ctxPrintL.clearRect(0, 0, 256, 32);
    ctxPrintL.font = '11px monospace, sans-serif';
    ctxPrintL.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctxPrintL.fillText('RAY-BAN META WAYFARER', 10, 18);
    const texPrintL = new THREE.CanvasTexture(canvasPrintL);
    const printMatL = new THREE.MeshStandardMaterial({
      map: texPrintL,
      transparent: true,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const printPlateGeo = new THREE.PlaneGeometry(0.8, 0.1);
    const printMeshL = new THREE.Mesh(printPlateGeo, printMatL);
    printMeshL.position.set(-1.93, 0.06, -0.8);
    printMeshL.rotation.y = Math.PI / 2 + 0.03;
    glassesGroup.add(printMeshL);

    const canvasPrintR = document.createElement('canvas');
    canvasPrintR.width = 256;
    canvasPrintR.height = 32;
    const ctxPrintR = canvasPrintR.getContext('2d');
    ctxPrintR.clearRect(0, 0, 256, 32);
    ctxPrintR.font = '11px monospace, sans-serif';
    ctxPrintR.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctxPrintR.fillText('50[]22 150 3N Made in Italy', 10, 18);
    const texPrintR = new THREE.CanvasTexture(canvasPrintR);
    const printMatR = new THREE.MeshStandardMaterial({
      map: texPrintR,
      transparent: true,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const printMeshR = new THREE.Mesh(printPlateGeo, printMatR);
    printMeshR.position.set(1.93, 0.06, -0.8);
    printMeshR.rotation.y = -Math.PI / 2 - 0.03;
    glassesGroup.add(printMeshR);

    // 10. Add Main Model to Scene
    scene.add(glassesGroup);

    // 11. Floor reflection and Soft Shadow
    // Semi-transparent floor plane to capture reflection and ground the scene
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.08,
      metalness: 0.1
    });
    const floorPlane = new THREE.Mesh(floorGeo, floorMat);
    floorPlane.rotation.x = -Math.PI / 2;
    floorPlane.position.y = -1.6;
    scene.add(floorPlane);

    // Dynamic mirror reflection group of the glasses
    const reflectionGroup = glassesGroup.clone();
    reflectionGroup.position.y = -3.2; // mirrored across y = -1.6
    reflectionGroup.scale.y = -1; // inverted vertically
    reflectionGroup.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.transparent = true;
        // Dampen opacity for soft reflection look
        node.material.opacity = (node.material.opacity || 1) * 0.15;
      }
    });
    scene.add(reflectionGroup);

    // Blurred radial gradient drop shadow plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    const shadowGrad = shadowCtx.createRadialGradient(128, 64, 0, 128, 64, 64);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
    shadowGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.12)');
    shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.04)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 256, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(4.8, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.59; // slightly above floor to prevent z-fighting
    scene.add(shadowPlane);

    // 12. Set Initial Target & Current Rotation State
    let targetRotationX = 0.12;
    let targetRotationY = -Math.PI / 5;
    glassesGroup.rotation.x = targetRotationX;
    glassesGroup.rotation.y = targetRotationY;

    // Interaction vars
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    const stopDragging = () => {
      isDragging = false;
    };
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);

    // Window Resize
    function onWindowResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onWindowResize);

    let isVisible = false;
    let frameId = null;
    // Animation Loop with Lerped Spring Physics
    function renderLoop() {
      if (!isVisible) return;
      frameId = requestAnimationFrame(renderLoop);

      if (!isDragging) {
        // Slow automatic rotation when idle
        targetRotationY += 0.006;
        // Return X axis smoothly to a natural baseline tilt (0.12 radians)
        targetRotationX += (0.12 - targetRotationX) * 0.035;
      }

      // Buttery smooth lerping for organic feel
      glassesGroup.rotation.y += (targetRotationY - glassesGroup.rotation.y) * 0.085;
      glassesGroup.rotation.x += (targetRotationX - glassesGroup.rotation.x) * 0.085;

      // Keep dynamic reflection locked to the model movements
      if (reflectionGroup) {
        reflectionGroup.rotation.x = glassesGroup.rotation.x;
        reflectionGroup.rotation.y = glassesGroup.rotation.y;
        reflectionGroup.rotation.z = -glassesGroup.rotation.z;
      }

      renderer.render(scene, camera);
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          renderLoop();
        }
      });
    }, { threshold: 0.01 });
    observer.observe(renderer.domElement);
  }

  // ─────────────────────────────────────────────
  // 15. METHOD SECTION - SMART VIDEO SIMULATOR CANVAS
  // ─────────────────────────────────────────────
  function initSmarterVideoPlayer() {
    const playBtn = document.querySelector('.video-play-btn');
    const frame = document.querySelector('.video-placeholder-frame');
    const container = document.querySelector('.smarter-video-container');
    
    // Cinema overlay elements
    const cinemaOverlay = document.getElementById('video-cinema-overlay');
    const exitBtn = document.querySelector('.exit-cinema-btn');
    const cinemaFrame = document.querySelector('.cinema-video-frame');
    
    if (!playBtn || !frame || !container || !cinemaOverlay || !exitBtn || !cinemaFrame) return;

    // --- Breathing/Living AI Preview Canvas Implementation ---
    const previewCanvas = frame.querySelector('.live-demo-bg-canvas');
    if (previewCanvas) {
      const pCtx = previewCanvas.getContext('2d');
      let previewFrameId = null;
      
      function resizePreview() {
        if (!previewCanvas) return;
        previewCanvas.width = frame.clientWidth;
        previewCanvas.height = frame.clientHeight;
      }
      resizePreview();
      window.addEventListener('resize', resizePreview);
      
      // Living neural nodes (AI brain activity)
      const nodeCount = 35;
      const nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0012,
          vy: (Math.random() - 0.5) * 0.0012,
          radius: Math.random() * 3 + 1.5,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          baseColor: i % 3 === 0 ? 'rgba(99, 102, 241,' : (i % 3 === 1 ? 'rgba(234, 88, 12,' : 'rgba(16, 185, 129,') // Indigo, Orange, Emerald
        });
      }
      
      function drawPreview() {
        previewFrameId = requestAnimationFrame(drawPreview);
        
        pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        
        const w = previewCanvas.width;
        const h = previewCanvas.height;
        const time = Date.now() * 0.001;
        
        // Biological expansion/contraction scale (breathing chest rhythm)
        const breathScale = 1.0 + Math.sin(time * 1.5) * 0.08;
        const centerX = w / 2;
        const centerY = h / 2;
        
        // 1. Draw organic neural synapses/connections
        pCtx.lineWidth = 0.8;
        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            // Apply scale centering transform to simulate breathing contraction
            const dx = (nodes[i].x - 0.5) * w * breathScale - (nodes[j].x - 0.5) * w * breathScale;
            const dy = (nodes[i].y - 0.5) * h * breathScale - (nodes[j].y - 0.5) * h * breathScale;
            const dist = Math.hypot(dx, dy);
            
            if (dist < w * 0.18) {
              const alpha = (1.0 - dist / (w * 0.18)) * 0.26;
              pCtx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
              
              pCtx.beginPath();
              pCtx.moveTo(centerX + (nodes[i].x - 0.5) * w * breathScale, centerY + (nodes[i].y - 0.5) * h * breathScale);
              pCtx.lineTo(centerX + (nodes[j].x - 0.5) * w * breathScale, centerY + (nodes[j].y - 0.5) * h * breathScale);
              pCtx.stroke();
            }
          }
        }
        
        // 2. Draw nodes and their aura glow
        nodes.forEach(n => {
          n.x += n.vx;
          n.y += n.vy;
          
          // Boundaries wrap around
          if (n.x < 0) n.x += 1;
          if (n.x > 1) n.x -= 1;
          if (n.y < 0) n.y += 1;
          if (n.y > 1) n.y -= 1;
          
          const nx = centerX + (n.x - 0.5) * w * breathScale;
          const ny = centerY + (n.y - 0.5) * h * breathScale;
          
          // Breathing scale parameter
          const pulse = Math.sin(time * 3 + n.pulsePhase) * 0.5 + 0.5;
          const r = n.radius * (1.0 + pulse * 0.6);
          
          // Outer aura glow (adapted for light mode visibility)
          const radialGlow = pCtx.createRadialGradient(nx, ny, 0, nx, ny, r * 4.5);
          radialGlow.addColorStop(0, n.baseColor + (0.35 + pulse * 0.15) + ')');
          radialGlow.addColorStop(0.5, n.baseColor + '0.08)');
          radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          pCtx.fillStyle = radialGlow;
          pCtx.beginPath();
          pCtx.arc(nx, ny, r * 4.5, 0, Math.PI * 2);
          pCtx.fill();
          
          // Inner core (Solid color with white border for crisp contrast in light mode)
          pCtx.fillStyle = n.baseColor + '1.0)';
          pCtx.beginPath();
          pCtx.arc(nx, ny, r, 0, Math.PI * 2);
          pCtx.fill();
          
          pCtx.strokeStyle = '#ffffff';
          pCtx.lineWidth = 1.2;
          pCtx.stroke();
        });
        
        // 3. Central living brain nucleus pulsing (behind play button)
        const nucleusGlow = pCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, w * 0.2 * breathScale);
        nucleusGlow.addColorStop(0, 'rgba(79, 70, 229, 0.15)');
        nucleusGlow.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
        nucleusGlow.addColorStop(1, 'rgba(255,255,255,0)');
        pCtx.fillStyle = nucleusGlow;
        pCtx.beginPath();
        pCtx.arc(centerX, centerY, w * 0.2 * breathScale, 0, Math.PI * 2);
        pCtx.fill();
      }
      
      let isVisible = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(previewFrameId);
            drawPreview();
          }
        });
      }, { threshold: 0.01 });
      observer.observe(previewCanvas);
    }

    let videoElement = null;
    let isPlaying = false;

    function getYouTubeId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }

    // Both play button and clicking the placeholder frame triggers full screen
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startCinemaMode();
    });
    frame.addEventListener('click', startCinemaMode);
    exitBtn.addEventListener('click', stopCinemaMode);

    function startCinemaMode() {
      if (isPlaying) return;
      isPlaying = true;
      
      cinemaOverlay.classList.add('active');
      
      // Pause smooth scrolling scroll control
      if (lenisInstance) {
        lenisInstance.stop();
      }

      const videoUrl = frame.getAttribute('data-video-url') || "https://archive.org/download/kikTXNL6MvX6ZpRXM/kikTXNL6MvX6ZpRXM.mp4";
      const ytId = getYouTubeId(videoUrl);

      if (ytId) {
        // Create YouTube iframe player
        videoElement = document.createElement('iframe');
        videoElement.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
        videoElement.referrerPolicy = "strict-origin-when-cross-origin";
        videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        videoElement.allowFullscreen = true;
        videoElement.style.border = "none";
        videoElement.style.outline = "none";
        cinemaFrame.appendChild(videoElement);
      } else {
        // Create standard video element (direct mp4 links)
        videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.autoplay = true;
        videoElement.controls = true;
        videoElement.playsInline = true;
        videoElement.style.outline = "none";
        cinemaFrame.appendChild(videoElement);
      }
    }

    function stopCinemaMode() {
      if (!isPlaying) return;
      isPlaying = false;

      cinemaOverlay.classList.remove('active');

      // Re-enable smooth scrolling
      if (lenisInstance) {
        lenisInstance.start();
      }

      // Pause and unload video or iframe immediately to stop audio playback
      if (videoElement) {
        if (videoElement.tagName.toLowerCase() === 'video') {
          try {
            videoElement.pause();
            videoElement.src = "";
            videoElement.load();
          } catch (e) {
            console.error("Error pausing video:", e);
          }
        } else if (videoElement.tagName.toLowerCase() === 'iframe') {
          videoElement.src = "";
        }
      }

      setTimeout(() => {
        if (videoElement && videoElement.parentNode) {
          videoElement.parentNode.removeChild(videoElement);
        }
        videoElement = null;
      }, 500);
    }
  }

  // --- Organic Breathing AI Sphere Animation for Dashboard Demo ---
  function initDashboardDemoCanvas() {
    const card = document.querySelector('.dashboard-demo-card');
    if (!card) return;
    
    const canvas = card.querySelector('.dashboard-demo-bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let frameId = null;
    
    function resize() {
      if (!canvas) return;
      canvas.width = card.clientWidth;
      canvas.height = card.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Create an organic breathing mesh of particles
    const rings = 3;
    const ptsPerRing = 12;
    const points = [];
    
    for (let r = 0; r < rings; r++) {
      const radiusFraction = (r + 1) / rings;
      for (let p = 0; p < ptsPerRing; p++) {
        const angle = (p / ptsPerRing) * Math.PI * 2;
        points.push({
          angle,
          ring: r,
          radiusFraction,
          baseColor: r === 0 ? 'rgba(99, 102, 241,' : (r === 1 ? 'rgba(234, 88, 12,' : 'rgba(16, 185, 129,'), // Indigo, Orange, Emerald
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    
    function draw() {
      if (!document.body.contains(card)) {
        cancelAnimationFrame(frameId);
        return;
      }
      frameId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const w = canvas.width;
      const h = canvas.height;
      const time = Date.now() * 0.001;
      
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Breathing scale multiplier (organic heartbeat expansion and contraction)
      const breath = Math.sin(time * 1.5) * 0.10 + 0.95;
      const maxRadius = Math.min(w, h) * 0.38;
      
      // 1. Draw connections/link threads
      ctx.lineWidth = 0.7;
      points.forEach((pt, idx) => {
        const rVal = pt.radiusFraction * maxRadius * (breath + Math.sin(time * 2 + pt.phase) * 0.03);
        const px = centerX + Math.cos(pt.angle) * rVal;
        const py = centerY + Math.sin(pt.angle) * rVal;
        
        // Connect neighbors in same ring
        const nextIdx = (idx + 1) % ptsPerRing === 0 ? idx - ptsPerRing + 1 : idx + 1;
        const nextPt = points[nextIdx];
        const nextR = nextPt.radiusFraction * maxRadius * (breath + Math.sin(time * 2 + nextPt.phase) * 0.03);
        const npx = centerX + Math.cos(nextPt.angle) * nextR;
        const npy = centerY + Math.sin(nextPt.angle) * nextR;
        
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.18)';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(npx, npy);
        ctx.stroke();
        
        // Connect to inner ring adjacent point
        if (pt.ring > 0) {
          const innerPt = points[idx - ptsPerRing];
          const innerR = innerPt.radiusFraction * maxRadius * (breath + Math.sin(time * 2 + innerPt.phase) * 0.03);
          const ipx = centerX + Math.cos(innerPt.angle) * innerR;
          const ipy = centerY + Math.sin(innerPt.angle) * innerR;
          
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ipx, ipy);
          ctx.stroke();
        }
      });
      
      // 2. Draw outer glows and node cores
      points.forEach(pt => {
        const rVal = pt.radiusFraction * maxRadius * (breath + Math.sin(time * 2 + pt.phase) * 0.03);
        const px = centerX + Math.cos(pt.angle) * rVal;
        const py = centerY + Math.sin(pt.angle) * rVal;
        
        const pulse = Math.sin(time * 3.5 + pt.phase) * 0.5 + 0.5;
        const size = (3 - pt.ring) * 1.5 + pulse * 1.0;
        
        // Outer aura light
        const nodeGlow = ctx.createRadialGradient(px, py, 0, px, py, size * 4.5);
        nodeGlow.addColorStop(0, pt.baseColor + (0.35 + pulse * 0.15) + ')');
        nodeGlow.addColorStop(0.5, pt.baseColor + '0.08)');
        nodeGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(px, py, size * 4.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Core node (solid color + white stroke glow wrapper)
        ctx.fillStyle = pt.baseColor + '1.0)';
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      
      // 3. Central living brain pulsing nucleus
      const centralGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.35 * breath);
      centralGlow.addColorStop(0, 'rgba(79, 70, 229, 0.16)');
      centralGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.05)');
      centralGlow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = centralGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.35 * breath, 0, Math.PI * 2);
      ctx.fill();
    }
    
    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          draw();
        }
      });
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }

  // ─────────────────────────────────────────────
  // 16. HERO SECTION - INTERACTIVE CREATIVE ENGINE CORE CANVAS
  // ─────────────────────────────────────────────
  function initHeroEngine() {
    const canvas = document.getElementById('hero-engine-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId = null;
    canvas.style.transformStyle = 'preserve-3d';
    
    const container = document.querySelector('.hero-visual-content');
    let width = canvas.width = container ? container.offsetWidth || 500 : 500;
    let height = canvas.height = container ? container.offsetHeight || 420 : 420;
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    let targetPitch = 0.15; // Natural baseline tilt
    let targetYaw = -0.3;   // Initial angle showing 3D depth
    
    let currentPitch = 0.15;
    let currentYaw = -0.3;
    
    function resize() {
      if (!canvas || !container) return;
      width = canvas.width = container.offsetWidth || 500;
      height = canvas.height = container.offsetHeight || 420;
    }
    window.addEventListener('resize', resize);
    
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      targetYaw += deltaX * 0.008;
      targetPitch += deltaY * 0.008;
      
      // Clamp pitch to prevent turning fully upside down
      targetPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetPitch));
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      
      targetYaw += deltaX * 0.008;
      targetPitch += deltaY * 0.008;
      
      targetPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetPitch));
      
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    
    const stopDragging = () => {
      isDragging = false;
    };
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
    
    // Background neural/grid nodes for connection blueprint
    const neuralNodes = [];
    for (let i = 0; i < 20; i++) {
      neuralNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1 + Math.random() * 1.5,
        color: Math.random() > 0.4 ? 'rgba(27, 42, 207, ' : 'rgba(234, 88, 12, '
      });
    }

    // 3D Perspective Projection helper
    function project3D(x, y, z, pitch, yaw) {
      // 1. Rotate around Y-axis (yaw)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY + z * sinY;
      const y1 = y;
      const z1 = -x * sinY + z * cosY;

      // 2. Rotate around X-axis (pitch)
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // 3. Perspective projection
      const cameraDistance = 1350;
      const scale = cameraDistance / (cameraDistance - z2);
      return {
        x: x2 * scale,
        y: y2 * scale,
        z: z2,
        scale: scale
      };
    }

    // Mathematically accurate 3D gear drawing function with blueprint vectors and solid shaded sides
    function draw3DGear(ctx, gx, gy, radius, teeth, rotationAngle, type, pitch, yaw, cx, cy) {
      const toothDepth = radius * 0.13;
      const numSamples = teeth * 4;
      const innerRadius = radius * 0.55;
      
      const thickness = type === 'chrome' ? 36 : (type === 'indigo' ? 28 : 20);
      let strokeColor = '';
      
      if (type === 'chrome') {
        strokeColor = 'rgba(27, 42, 207, '; // Indigo
      } else if (type === 'indigo') {
        strokeColor = 'rgba(79, 70, 229, '; // Vivid Indigo
      } else {
        strokeColor = 'rgba(168, 85, 247, '; // Violet
      }
      
      const frontPts = [];
      const backPts = [];
      const frontInnerPts = [];
      const backInnerPts = [];
      
      // 1. Generate and project 3D vertices of the gear perimeter (outer and inner)
      for (let i = 0; i < numSamples; i++) {
        const angle = (i * Math.PI * 2) / numSamples + rotationAngle;
        const k = i % 4;
        const r = (k === 0 || k === 1) ? radius : (radius - toothDepth);
        
        const lx = Math.cos(angle) * r;
        const ly = Math.sin(angle) * r;
        
        const pFront = project3D(gx + lx - cx, gy + ly - cy, thickness / 2, pitch, yaw);
        frontPts.push({ x: cx + pFront.x, y: cy + pFront.y, scale: pFront.scale });
        
        const pBack = project3D(gx + lx - cx, gy + ly - cy, -thickness / 2, pitch, yaw);
        backPts.push({ x: cx + pBack.x, y: cy + pBack.y, scale: pBack.scale });

        // Inner circle coordinates
        const ilx = Math.cos(angle) * innerRadius;
        const ily = Math.sin(angle) * innerRadius;

        const pFrontInner = project3D(gx + ilx - cx, gy + ily - cy, thickness / 2, pitch, yaw);
        frontInnerPts.push({ x: cx + pFrontInner.x, y: cy + pFrontInner.y });

        const pBackInner = project3D(gx + ilx - cx, gy + ily - cy, -thickness / 2, pitch, yaw);
        backInnerPts.push({ x: cx + pBackInner.x, y: cy + pBackInner.y });
      }


      // 2. Draw Back Face Outlines (Outer and Inner)
      ctx.beginPath();
      ctx.moveTo(backPts[0].x, backPts[0].y);
      for (let i = 1; i < numSamples; i++) {
        ctx.lineTo(backPts[i].x, backPts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = strokeColor + '0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(backInnerPts[0].x, backInnerPts[0].y);
      for (let i = 1; i < numSamples; i++) {
        ctx.lineTo(backInnerPts[i].x, backInnerPts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = strokeColor + '0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 3. Draw and fill 3D Side Quads (painter's algorithm style)
      // Shading based on orientation to simulated light source from top-right (-Math.PI / 3)
      const lightAngle = -Math.PI / 3;
      
      for (let i = 0; i < numSamples; i++) {
        const next_i = (i + 1) % numSamples;
        const angle = ((i + 0.5) * Math.PI * 2) / numSamples + rotationAngle;
        const dot = Math.cos(angle - lightAngle);
        const intensity = 0.25 + 0.75 * (dot * 0.5 + 0.5); // 0.25 to 1.0 (deeper shadows!)
        
        let sideColor = '';
        if (type === 'chrome') {
          // Polished Indigo/Silver metal
          const r = Math.floor(190 + intensity * 65);
          const g = Math.floor(195 + intensity * 60);
          const b = Math.floor(225 + intensity * 30);
          sideColor = `rgb(${r}, ${g}, ${b})`;
        } else if (type === 'indigo') {
          // Rich Vivid Indigo
          const r = Math.floor(40 + intensity * 60);
          const g = Math.floor(40 + intensity * 60);
          const b = Math.floor(180 + intensity * 75);
          sideColor = `rgb(${r}, ${g}, ${b})`;
        } else {
          // Vibrant Violet-Purple
          const r = Math.floor(120 + intensity * 60);
          const g = Math.floor(30 + intensity * 40);
          const b = Math.floor(180 + intensity * 75);
          sideColor = `rgb(${r}, ${g}, ${b})`;
        }
        
        ctx.beginPath();
        ctx.moveTo(frontPts[i].x, frontPts[i].y);
        ctx.lineTo(frontPts[next_i].x, frontPts[next_i].y);
        ctx.lineTo(backPts[next_i].x, backPts[next_i].y);
        ctx.lineTo(backPts[i].x, backPts[i].y);
        ctx.closePath();
        
        ctx.fillStyle = sideColor;
        ctx.fill();
        
        // Faint segment outline for technical details
        ctx.strokeStyle = strokeColor + '0.22)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 3.5. Draw and fill 3D Inner Wall Side Quads (gives real volumetric thickness to the hole!)
      for (let i = 0; i < numSamples; i++) {
        const next_i = (i + 1) % numSamples;
        const angle = ((i + 0.5) * Math.PI * 2) / numSamples + rotationAngle;
        const dot = Math.cos(angle - lightAngle + Math.PI); // Inverted normal for inside wall
        const intensity = 0.20 + 0.6 * (dot * 0.5 + 0.5);
        
        let sideColor = '';
        if (type === 'chrome') {
          const r = Math.floor(150 + intensity * 65);
          const g = Math.floor(155 + intensity * 60);
          const b = Math.floor(185 + intensity * 30);
          sideColor = `rgb(${r}, ${g}, ${b})`;
        } else if (type === 'indigo') {
          const r = Math.floor(30 + intensity * 50);
          const g = Math.floor(30 + intensity * 50);
          const b = Math.floor(140 + intensity * 65);
          sideColor = `rgb(${r}, ${g}, ${b})`;
        } else {
          const r = Math.floor(90 + intensity * 50);
          const g = Math.floor(20 + intensity * 30);
          const b = Math.floor(140 + intensity * 65);
          sideColor = `rgb(${r}, ${g}, ${b})`;
        }
        
        ctx.beginPath();
        ctx.moveTo(frontInnerPts[i].x, frontInnerPts[i].y);
        ctx.lineTo(frontInnerPts[next_i].x, frontInnerPts[next_i].y);
        ctx.lineTo(backInnerPts[next_i].x, backInnerPts[next_i].y);
        ctx.lineTo(backInnerPts[i].x, backInnerPts[i].y);
        ctx.closePath();
        
        ctx.fillStyle = sideColor;
        ctx.fill();
        
        ctx.strokeStyle = strokeColor + '0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // 4. Draw Front Face Ring (Using evenodd fill rule to keep center open)
      ctx.beginPath();
      // Outer path (clockwise)
      ctx.moveTo(frontPts[0].x, frontPts[0].y);
      for (let i = 1; i < numSamples; i++) {
        ctx.lineTo(frontPts[i].x, frontPts[i].y);
      }
      ctx.closePath();

      // Inner path (counter-clockwise)
      ctx.moveTo(frontInnerPts[numSamples - 1].x, frontInnerPts[numSamples - 1].y);
      for (let i = numSamples - 2; i >= 0; i--) {
        ctx.lineTo(frontInnerPts[i].x, frontInnerPts[i].y);
      }
      ctx.closePath();
      
      let faceGrad = ctx.createLinearGradient(frontPts[0].x, frontPts[0].y, frontPts[Math.floor(numSamples/2)].x, frontPts[Math.floor(numSamples/2)].y);
      if (type === 'chrome') {
        faceGrad.addColorStop(0, '#ffffff');
        faceGrad.addColorStop(0.2, '#eef2ff'); // Light indigo sheen
        faceGrad.addColorStop(0.45, '#cbd5e1');
        faceGrad.addColorStop(0.5, '#f8fafc'); // specular highlight stop
        faceGrad.addColorStop(0.55, '#94a3b8');
        faceGrad.addColorStop(0.8, '#4f46e5'); // Electric Indigo reflect
        faceGrad.addColorStop(1, '#1e1b4b');
      } else if (type === 'indigo') {
        faceGrad.addColorStop(0, '#eef2ff');
        faceGrad.addColorStop(0.2, '#c7d2fe');
        faceGrad.addColorStop(0.45, '#6366f1');
        faceGrad.addColorStop(0.5, '#c7d2fe'); // specular highlight stop
        faceGrad.addColorStop(0.55, '#4f46e5');
        faceGrad.addColorStop(0.8, '#3730a3');
        faceGrad.addColorStop(1, '#1e1b4b');
      } else {
        faceGrad.addColorStop(0, '#faf5ff');
        faceGrad.addColorStop(0.2, '#f3e8ff');
        faceGrad.addColorStop(0.45, '#c084fc');
        faceGrad.addColorStop(0.5, '#f3e8ff'); // specular highlight stop
        faceGrad.addColorStop(0.55, '#a855f7');
        faceGrad.addColorStop(0.8, '#7e22ce');
        faceGrad.addColorStop(1, '#3b0764');
      }
      ctx.fillStyle = faceGrad;
      ctx.fill('evenodd');
      
      // Outline the front face rings
      ctx.beginPath();
      ctx.moveTo(frontPts[0].x, frontPts[0].y);
      for (let i = 1; i < numSamples; i++) {
        ctx.lineTo(frontPts[i].x, frontPts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = strokeColor + '0.95)';
      ctx.lineWidth = 1.75;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(frontInnerPts[0].x, frontInnerPts[0].y);
      for (let i = 1; i < numSamples; i++) {
        ctx.lineTo(frontInnerPts[i].x, frontInnerPts[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = strokeColor + '0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      
      // Helper to draw concentric circles projected in 3D
      function drawConcentricCircle(rad, strokeStyle, lineWidth, lineDash) {
        ctx.beginPath();
        if (lineDash) ctx.setLineDash(lineDash);
        
        for (let j = 0; j <= 64; j++) {
          const theta = (j * Math.PI * 2) / 64;
          const lx = Math.cos(theta) * rad;
          const ly = Math.sin(theta) * rad;
          const p = project3D(gx + lx - cx, gy + ly - cy, thickness / 2, pitch, yaw);
          const sx = cx + p.x;
          const sy = cy + p.y;
          
          if (j === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Pitch circle
      drawConcentricCircle(radius - toothDepth / 2, strokeColor + '0.35)', 1, [2, 4]);
      
      // 5. Draw Spokes in the hollow gap (connecting hub and inner rim)
      const spokes = type === 'chrome' ? 6 : 4;
      for (let s = 0; s < spokes; s++) {
        const angle = (s / spokes) * Math.PI * 2 + rotationAngle;
        const lx1 = Math.cos(angle) * (radius * 0.18);
        const ly1 = Math.sin(angle) * (radius * 0.18);
        const lx2 = Math.cos(angle) * (radius * 0.53);
        const ly2 = Math.sin(angle) * (radius * 0.53);
        
        const p1 = project3D(gx + lx1 - cx, gy + ly1 - cy, thickness / 2, pitch, yaw);
        const p2 = project3D(gx + lx2 - cx, gy + ly2 - cy, thickness / 2, pitch, yaw);
        
        // Shadow line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + p1.x - 0.7, cy + p1.y + 0.7);
        ctx.lineTo(cx + p2.x - 0.7, cy + p2.y + 0.7);
        ctx.stroke();

        // Highlight line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + p1.x + 0.7, cy + p1.y - 0.7);
        ctx.lineTo(cx + p2.x + 0.7, cy + p2.y - 0.7);
        ctx.stroke();

        // Center line
        ctx.strokeStyle = strokeColor + '0.85)';
        ctx.lineWidth = 1.75;
        ctx.beginPath();
        ctx.moveTo(cx + p1.x, cy + p1.y);
        ctx.lineTo(cx + p2.x, cy + p2.y);
        ctx.stroke();
      }
      
      // 6. Draw 3D Hub (Embossed concentric hub in center with gradient, bore hole, and axle pin)
      const pHub = project3D(gx - cx, gy - cy, thickness / 2, pitch, yaw);
      const hcx = cx + pHub.x;
      const hcy = cy + pHub.y;
      const hRad = radius * 0.18 * pHub.scale;
      
      const hubGrad = ctx.createRadialGradient(hcx, hcy, 0, hcx, hcy, hRad);
      if (type === 'chrome') {
        hubGrad.addColorStop(0, '#ffffff');
        hubGrad.addColorStop(0.7, '#cbd5e1');
        hubGrad.addColorStop(1, '#94a3b8');
      } else if (type === 'indigo') {
        hubGrad.addColorStop(0, '#eef2ff');
        hubGrad.addColorStop(0.7, '#6366f1');
        hubGrad.addColorStop(1, '#1e1b4b');
      } else {
        hubGrad.addColorStop(0, '#faf5ff');
        hubGrad.addColorStop(0.7, '#c084fc');
        hubGrad.addColorStop(1, '#3b0764');
      }
      
      // Hub flange
      ctx.fillStyle = hubGrad;
      ctx.beginPath();
      ctx.arc(hcx, hcy, hRad, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = strokeColor + '0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Recessed bore hole (shaft opening)
      const boreRad = radius * 0.075 * pHub.scale;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.arc(hcx, hcy, boreRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = strokeColor + '0.4)';
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // Axle pin (center shaft)
      const pinRad = radius * 0.04 * pHub.scale;
      const pinGrad = ctx.createLinearGradient(hcx - pinRad, hcy - pinRad, hcx + pinRad, hcy + pinRad);
      if (type === 'chrome') {
        pinGrad.addColorStop(0, '#cbd5e1');
        pinGrad.addColorStop(1, '#334155');
      } else if (type === 'indigo') {
        pinGrad.addColorStop(0, '#c7d2fe');
        pinGrad.addColorStop(1, '#1e1b4b');
      } else {
        pinGrad.addColorStop(0, '#f3e8ff');
        pinGrad.addColorStop(1, '#3b0764');
      }
      ctx.fillStyle = pinGrad;
      ctx.beginPath();
      ctx.arc(hcx, hcy, pinRad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mathematically accurate 3D blueprint-style wireframe lightbulb with internal pulsing brain geodesic core
    function drawIdeaBulbCore3D(ctx, mainX, mainY, pitch, yaw, cx, cy, pulse, g1RotationAngle) {
      const ringYs = [-28, -18, -6, 8, 20, 28];
      const ringRs = [10, 18, 21.5, 17.5, 11, 8.5];
      const bulbRot = g1RotationAngle * 0.18;
      
      // Latitude Rings
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.25)';
      ctx.lineWidth = 0.75;
      ringYs.forEach((ly, rIdx) => {
        const lr = ringRs[rIdx];
        ctx.beginPath();
        for (let j = 0; j <= 40; j++) {
          const theta = (j * Math.PI * 2) / 40 + bulbRot;
          const lx = Math.cos(theta) * lr;
          const lz = Math.sin(theta) * lr;
          const p = project3D(mainX + lx - cx, mainY + ly - cy, lz, pitch, yaw);
          if (j === 0) {
            ctx.moveTo(cx + p.x, cy + p.y);
          } else {
            ctx.lineTo(cx + p.x, cy + p.y);
          }
        }
        ctx.stroke();
      });
      
      // Longitude Ribs
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.35)';
      ctx.lineWidth = 0.75;
      for (let c = 0; c < 8; c++) {
        const phi = (c * Math.PI * 2) / 8 + bulbRot;
        ctx.beginPath();
        ringYs.forEach((ly, rIdx) => {
          const lr = ringRs[rIdx];
          const lx = Math.cos(phi) * lr;
          const lz = Math.sin(phi) * lr;
          const p = project3D(mainX + lx - cx, mainY + ly - cy, lz, pitch, yaw);
          if (rIdx === 0) {
            ctx.moveTo(cx + p.x, cy + p.y);
          } else {
            ctx.lineTo(cx + p.x, cy + p.y);
          }
        });
        ctx.stroke();
      }
      
      // Base threads
      const baseYs = [28, 32, 36];
      const baseR = 7;
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.5)';
      ctx.lineWidth = 1.75;
      baseYs.forEach(ly => {
        ctx.beginPath();
        for (let j = 0; j <= 20; j++) {
          const theta = (j * Math.PI * 2) / 20 + bulbRot;
          const lx = Math.cos(theta) * baseR;
          const lz = Math.sin(theta) * baseR;
          const p = project3D(mainX + lx - cx, mainY + ly - cy, lz, pitch, yaw);
          if (j === 0) {
            ctx.moveTo(cx + p.x, cy + p.y);
          } else {
            ctx.lineTo(cx + p.x, cy + p.y);
          }
        }
        ctx.stroke();
      });
      
      // Geodesic Constellation Core
      const t = (1 + Math.sqrt(5)) / 2;
      const vertices = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
      ];
      
      const rCore = 12 * (1 + pulse * 0.08);
      const coreCenterY = mainY - 6;
      
      const coreRotY = g1RotationAngle * 1.5;
      const coreRotZ = g1RotationAngle * 0.7;
      const projectedVerts = [];
      
      vertices.forEach(v => {
        const len = Math.hypot(v[0], v[1], v[2]);
        const x = (v[0] / len) * rCore;
        const y = (v[1] / len) * rCore;
        const z = (v[2] / len) * rCore;
        
        const cosY = Math.cos(coreRotY);
        const sinY = Math.sin(coreRotY);
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;
        
        const cosZ = Math.cos(coreRotZ);
        const sinZ = Math.sin(coreRotZ);
        const x2 = x1 * cosZ - y1 * sinZ;
        const y2 = x1 * sinZ + y1 * cosZ;
        const z2 = z1;
        
        const p = project3D(mainX + x2 - cx, coreCenterY + y2 - cy, z2, pitch, yaw);
        projectedVerts.push({ x: cx + p.x, y: cy + p.y, z: p.z, scale: p.scale }); // Store Z depth
      });
      
      const projCenter = project3D(mainX - cx, coreCenterY - cy, 0, pitch, yaw);
      const pcx = cx + projCenter.x;
      const pcy = cy + projCenter.y;
      
      const radGlow = ctx.createRadialGradient(pcx, pcy, 0, pcx, pcy, rCore * 2.2);
      radGlow.addColorStop(0, 'rgba(255, 230, 0, 0.65)');
      radGlow.addColorStop(0.35, 'rgba(234, 88, 12, 0.28)');
      radGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radGlow;
      ctx.beginPath();
      ctx.arc(pcx, pcy, rCore * 2.2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw Geodesic Lines with depth-based opacity
      const maxEdgeDist = rCore * 1.25;
      for (let i = 0; i < 12; i++) {
        for (let j = i + 1; j < 12; j++) {
          const dx = vertices[i][0] - vertices[j][0];
          const dy = vertices[i][1] - vertices[j][1];
          const dz = vertices[i][2] - vertices[j][2];
          const dist = Math.hypot(dx, dy, dz);
          
          if (dist < maxEdgeDist) {
            const avgZ = (projectedVerts[i].z + projectedVerts[j].z) / 2; // ranges from -rCore to +rCore
            const opacity = 0.2 + 0.6 * ((avgZ + rCore) / (2 * rCore));
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(projectedVerts[i].x, projectedVerts[i].y);
            ctx.lineTo(projectedVerts[j].x, projectedVerts[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw Geodesic Vertices with depth-based opacity and size
      projectedVerts.forEach(v => {
        const opacity = 0.3 + 0.7 * ((v.z + rCore) / (2 * rCore));
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2.5 * v.scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 225, 0, ${opacity * 0.8})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 4.5 * v.scale, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    
    let lastTime = performance.now();
    let g1RotationAngle = 0;
    let dx = 0, dy = 0;
    
    function draw(timestamp) {
      frameId = requestAnimationFrame(draw);
      
      const now = timestamp || performance.now();
      const dt = (now - lastTime) * 0.001;
      lastTime = now;
      
      const delta = Math.min(dt, 0.1);
      g1RotationAngle += delta * 0.45; // Smooth rotation speed
      
      if (!isDragging) {
        // Gently spring pitch back to flat when not dragging
        targetPitch += (0 - targetPitch) * 0.05;
        // targetYaw is left unchanged — scene stays where the user leaves it
      }
      
      // Lerp target pitch and yaw for buttery smooth physics
      currentPitch += (targetPitch - currentPitch) * 0.085;
      currentYaw += (targetYaw - currentYaw) * 0.085;
      
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      
      const pitch = currentPitch;
      const yaw = currentYaw;
      
      canvas.style.transform = ''; // pure canvas 3D projection — no conflicting CSS perspective
      
      // 1. Draw blueprint-style coordinate grid circles in 3D background (Z = -25)
      ctx.globalCompositeOperation = 'source-over';
      const gridRadii = [160, 240, 320];
      const mainX = cx - 75;
      const mainY = cy + 10;
      
      gridRadii.forEach(gr => {
        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        for (let j = 0; j <= 80; j++) {
          const theta = (j * Math.PI * 2) / 80;
          const lx = Math.cos(theta) * gr;
          const ly = Math.sin(theta) * gr;
          const p = project3D(mainX + lx - cx, mainY + ly - cy, -25, pitch, yaw);
          const sx = cx + p.x;
          const sy = cy + p.y;
          if (j === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = 'rgba(27, 42, 207, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });
      
      // 2. Draw drifting blueprint network nodes
      neuralNodes.forEach((node, idx) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 10 || node.x > width - 10) node.vx *= -1;
        if (node.y < 10 || node.y > height - 10) node.vy *= -1;
        
        ctx.fillStyle = node.color + '0.12)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = idx + 1; j < neuralNodes.length; j++) {
          const nextNode = neuralNodes[j];
          const dist = Math.hypot(node.x - nextNode.x, node.y - nextNode.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(27, 42, 207, ${(1 - (dist / 110)) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nextNode.x, nextNode.y);
            ctx.stroke();
          }
        }
      });
      
      // 3. Define Gears layout
      const g1Radius = 100;
      const g1Teeth = 18;
      const g1Rotation = g1RotationAngle;
      
      // Gear 2 (Indigo/Blue) at -30 deg
      const g2Angle = -Math.PI / 6;
      const g2Radius = 66.67; // mathematically matched tooth module
      const g2Teeth = 12;
      const g2Distance = (g1Radius + g2Radius) * 0.935; // mathematically meshed distance
      const g2X = mainX + Math.cos(g2Angle) * g2Distance;
      const g2Y = mainY + Math.sin(g2Angle) * g2Distance;
      // Phase offset (0) meshing teeth perfectly due to exact pitch module match
      const g2Rotation = g2Angle + Math.PI - (g1Rotation - g2Angle) * (g1Teeth / g2Teeth);
      
      // Gear 3 (Violet/Purple) at 60 deg
      const g3Angle = Math.PI / 3;
      const g3Radius = 50.0; // mathematically matched tooth module
      const g3Teeth = 9;
      const g3Distance = (g1Radius + g3Radius) * 0.935; // mathematically meshed distance
      const g3X = mainX + Math.cos(g3Angle) * g3Distance;
      const g3Y = mainY + Math.sin(g3Angle) * g3Distance;
      // Phase offset (0) meshing teeth perfectly due to exact pitch module match
      const g3Rotation = g3Angle + Math.PI - (g1Rotation - g3Angle) * (g1Teeth / g3Teeth);
      
      // 4. Draw meshing grid outline lines (blueprint lines connecting gear hubs)
      ctx.beginPath();
      ctx.setLineDash([3, 4]);
      const pMain = project3D(mainX - cx, mainY - cy, 0, pitch, yaw);
      const pG2 = project3D(g2X - cx, g2Y - cy, 0, pitch, yaw);
      const pG3 = project3D(g3X - cx, g3Y - cy, 0, pitch, yaw);
      ctx.moveTo(cx + pMain.x, cy + pMain.y);
      ctx.lineTo(cx + pG2.x, cy + pG2.y);
      ctx.lineTo(cx + pG3.x, cy + pG3.y);
      ctx.lineTo(cx + pMain.x, cy + pMain.y);
      ctx.strokeStyle = 'rgba(27, 42, 207, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 4.5 Draw flat 2D screen-space drop shadows before gear geometry
      // Shadow X-offset swings with yaw so the brain can anchor rotation direction
      const shadowDX = 10 - Math.sin(currentYaw) * 22; // shifts left/right as scene rotates
      const shadowDY = 14;
      ctx.save();
      ctx.filter = 'blur(13px)';
      [
        { gx: g3X, gy: g3Y, r: g3Radius },
        { gx: g2X, gy: g2Y, r: g2Radius },
        { gx: mainX, gy: mainY, r: g1Radius },
      ].forEach(({ gx, gy, r }) => {
        const proj = project3D(gx - cx, gy - cy, 0, pitch, yaw);
        const sx = cx + proj.x + shadowDX;
        const sy = cy + proj.y + shadowDY;
        const sr = r * proj.scale;
        ctx.beginPath();
        ctx.ellipse(sx, sy, sr * 1.08, sr * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.fill();
      });
      ctx.restore();
      ctx.filter = 'none';
      
      // 5. Draw 3D Gears (depth sorting: Gear 3 -> Gear 2 -> Gear 1)
      draw3DGear(ctx, g3X, g3Y, g3Radius, g3Teeth, g3Rotation, 'violet', pitch, yaw, cx, cy);
      draw3DGear(ctx, g2X, g2Y, g2Radius, g2Teeth, g2Rotation, 'indigo', pitch, yaw, cx, cy);
      draw3DGear(ctx, mainX, mainY, g1Radius, g1Teeth, g1Rotation, 'chrome', pitch, yaw, cx, cy);
      
      // 6. Draw 3D Idea bulb and constellation core
      const bulbPulse = Math.sin(g1RotationAngle * 3.0) * 0.35 + 0.65;
      drawIdeaBulbCore3D(ctx, mainX, mainY, pitch, yaw, cx, cy, bulbPulse, g1RotationAngle);
      
      // 8. Render technical blueprint text labels floating in 3D space
      ctx.fillStyle = 'rgba(27, 42, 207, 0.45)';
      ctx.font = '700 8px monospace';
      ctx.textAlign = 'center';
      
      const pLabelMain = project3D(mainX - cx, mainY - cy - g1Radius - 22, 0, pitch, yaw);
      ctx.fillText(`ENGINE: CORE_PT // ROT: ${(g1RotationAngle % (Math.PI * 2)).toFixed(2)}rad`, cx + pLabelMain.x, cy + pLabelMain.y);
      
      const pLabelG2 = project3D(g2X - cx, g2Y - cy - g2Radius - 16, 0, pitch, yaw);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.45)';
      ctx.fillText(`AUX_B: INDIGO_WAVE`, cx + pLabelG2.x, cy + pLabelG2.y);
      
      const pLabelG3 = project3D(g3X - cx, g3Y - cy - g3Radius - 12, 0, pitch, yaw);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.fillText(`AUX_C: VIOLET_CORE`, cx + pLabelG3.x, cy + pLabelG3.y);
    }
    
    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          lastTime = performance.now();
          draw();
        }
      });
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startExperience);
} else {
  startExperience();
}
