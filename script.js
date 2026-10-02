/**
 * Rajeshwari Mali Portfolio — Interactive Architecture
 * Design Excellence Pass · GSAP 3.12.5 + ScrollTrigger + Canvas Mesh
 */

(function() {
  'use strict';

  // ==========================================
  // 1. Motion & Capabilities Detection
  // ==========================================
  const MOTION = {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    finePointer: window.matchMedia('(pointer: fine)').matches,
    duration: { fast: 0.15, base: 0.3, slow: 0.6 },
    ease: { major: 'power3.out', medium: 'power2.out', minor: 'power1.out' }
  };

  const updateMotionConfig = (e) => {
    MOTION.reduced = e.matches;
    if (MOTION.reduced) {
      MOTION.duration = { fast: 0, base: 0, slow: 0 };
    } else {
      MOTION.duration = { fast: 0.15, base: 0.3, slow: 0.6 };
    }
  };

  if (MOTION.reduced) {
    MOTION.duration = { fast: 0, base: 0, slow: 0 };
  }

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', updateMotionConfig);

  // Check if GSAP is available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Core interactive features will run with standard fallbacks.');
    return;
  }

  // ==========================================
  // 2. GSAP Registration
  // ==========================================
  gsap.registerPlugin(ScrollTrigger);

  // ==========================================
  // 3. Scroll Progress Indicator
  // ==========================================
  const progressBar = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ==========================================
  // 4. Navigation, Smooth Scroll & Sliding Indicator
  // ==========================================
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const navIndicator = document.getElementById('nav-indicator');
  const sections = document.querySelectorAll('main > section, section');
  const navHeight = 64;

  const updateNavIndicator = (activeLink) => {
    if (!navIndicator || !activeLink || !MOTION.finePointer) return;
    const linkRect = activeLink.getBoundingClientRect();
    const navLinksContainer = document.getElementById('nav-links');
    if (!navLinksContainer) return;
    const containerRect = navLinksContainer.getBoundingClientRect();
    
    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    navIndicator.style.opacity = '1';
    navIndicator.style.transform = `translateX(${left}px)`;
    navIndicator.style.width = `${width}px`;
  };

  // Intersection Observer for Active Nav Link
  const observerOptions = {
    root: null,
    rootMargin: `-${navHeight + 10}px 0px -40% 0px`,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
            updateNavIndicator(link);
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.id) {
      observer.observe(section);
    }
  });

  // Initial indicator placement
  const initialActive = document.querySelector('.nav__link.active');
  if (initialActive) {
    setTimeout(() => updateNavIndicator(initialActive), 150);
  }

  // Smooth scroll logic with offset
  const smoothScrollTo = (targetId) => {
    const targetElement = document.getElementById(targetId.substring(1));
    if (targetElement) {
      const top = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  };

  const allNavLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });

  // Scrolled nav background state
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ==========================================
  // 5. Mobile Menu with Accessible Focus Trap
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
  
  const toggleMobileMenu = () => {
    const isOpen = document.body.classList.contains('menu-open');
    if (isOpen) {
      document.body.classList.remove('menu-open');
      mobileMenu.classList.remove('mobile-menu--open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
      document.body.classList.add('menu-open');
      mobileMenu.classList.add('mobile-menu--open');
      navToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('menu-open')) {
          toggleMobileMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        toggleMobileMenu();
        navToggle.focus();
      }
    });

    // Focus Trap
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = [navToggle, ...Array.from(mobileLinks)];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // ==========================================
  // 6. SIGNATURE MOMENT (Option A):
  //    Reactive Canvas Gradient Mesh
  // ==========================================
  const initHeroMesh = () => {
    const canvas = document.getElementById('hero-mesh');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let animationFrameId = null;
    let isVisible = true;

    // Blobs configuration
    const blobs = [
      { x: 0.3, y: 0.35, vx: 0.0007, vy: 0.0005, radius: 0.45, color: 'rgba(99, 102, 241, 0.45)' }, // Indigo
      { x: 0.7, y: 0.4,  vx: -0.0006, vy: 0.0008, radius: 0.5,  color: 'rgba(139, 92, 246, 0.4)'  }, // Violet
      { x: 0.5, y: 0.7,  vx: 0.0005, vy: -0.0006, radius: 0.4,  color: 'rgba(59, 130, 246, 0.35)' }, // Blue
      { x: 0.45, y: 0.45, vx: -0.0005, vy: -0.0004, radius: 0.35, color: 'rgba(245, 158, 11, 0.12)' } // Warm Accent
    ];

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = Math.min(window.innerWidth, 1600);
      height = canvas.height = Math.min(rect.height || window.innerHeight, 1000);
    };

    window.addEventListener('resize', resize);
    resize();

    if (MOTION.finePointer && !MOTION.reduced) {
      window.addEventListener('mousemove', (e) => {
        if (e.clientY < height) {
          targetMouseX = e.clientX / window.innerWidth;
          targetMouseY = e.clientY / height;
        }
      }, { passive: true });
    }

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      time += 0.015;

      blobs.forEach((blob, i) => {
        // Subtle sinusoidal drift
        const offsetX = Math.sin(time + i * 1.5) * 0.08 + (mouseX - 0.5) * 0.12;
        const offsetY = Math.cos(time + i * 1.2) * 0.08 + (mouseY - 0.5) * 0.12;

        const bx = (blob.x + offsetX) * width;
        const by = (blob.y + offsetY) * height;
        const br = blob.radius * Math.max(width, height);

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.6, blob.color.replace(/[\d\.]+\)$/, '0.1)'));
        gradient.addColorStop(1, 'rgba(12, 12, 15, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isVisible && !MOTION.reduced) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    // Pause when off-screen
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !MOTION.reduced && !animationFrameId) {
          draw();
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    }, { threshold: 0.05 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // Initial render
    draw();

    if (MOTION.reduced) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }
  };

  initHeroMesh();

  // ==========================================
  // 7. Hero Entrance & Parallax (Tier 1)
  // ==========================================
  const heroTl = gsap.timeline();
  
  if (MOTION.reduced) {
    heroTl.set('.hero__label, .hero__title, .hero__subtitle, .hero__actions, .hero__availability', { opacity: 1 });
  } else {
    heroTl.from('.hero__label', { opacity: 0, y: 16, duration: 0.6, ease: MOTION.ease.major })
          .from('.hero__title', { opacity: 0, y: 24, duration: 0.7, ease: MOTION.ease.major }, "-=0.35")
          .from('.hero__subtitle', { opacity: 0, y: 16, duration: 0.6, ease: MOTION.ease.major }, "-=0.4")
          .from('.hero__actions', { opacity: 0, y: 16, duration: 0.5, ease: MOTION.ease.major }, "-=0.35")
          .from('.hero__availability', { opacity: 0, scale: 0.95, duration: 0.4, ease: MOTION.ease.major }, "-=0.3");
  }

  // Hero Parallax on Scroll
  if (!MOTION.reduced) {
    gsap.to('.hero__shape--grid', {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.hero__shape--circle', {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
    gsap.to('.hero__content', {
      y: -40,
      opacity: 0.65,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // ==========================================
  // 8. Proof Strip Counters (Bug-Fixed)
  // ==========================================
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const targetValue = parseFloat(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: 1.8,
          ease: MOTION.ease.major,
          onUpdate: () => {
            if (targetValue >= 1000 && suffix === '+') {
              // Smooth format: 1K+
              if (obj.val >= 990) {
                counter.innerText = '1K+';
              } else {
                counter.innerText = Math.floor(obj.val) + suffix;
              }
            } else {
              counter.innerText = Math.floor(obj.val) + suffix;
            }
          }
        });
      }
    });
  });

  // ==========================================
  // 9. Section & Component Reveals (Tier 2)
  // ==========================================
  const revealElements = document.querySelectorAll(
    '.section__title, .section__subtitle, .project, .proof__item, .pipeline__step, .workflow__step, .about__grid, .timeline__item, .roadmap__node, .resume-cta__card, .contact__link'
  );

  revealElements.forEach(el => {
    if (MOTION.reduced) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          el.classList.add('revealed');
          gsap.set(el, { opacity: 1 });
        },
        once: true
      });
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          el.classList.add('revealed');
          gsap.fromTo(el, 
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: MOTION.duration.slow, ease: MOTION.ease.medium }
          );
        },
        once: true
      });
    }
  });

  // ==========================================
  // 10. Project Card 3D Tilt on Hover (Tier 3)
  // ==========================================
  if (MOTION.finePointer && !MOTION.reduced) {
    const projectCards = document.querySelectorAll('.project');
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -3.5; // max ±3.5deg
        const rotateY = ((x - centerX) / centerX) * 3.5;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power1.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // ==========================================
  // 11. Project Card Inline Toggle
  // ==========================================
  const projectToggles = document.querySelectorAll('.project__toggle');
  projectToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const isOpen = targetEl.classList.contains('project__details--open');
        const textSpan = toggle.querySelector('.project__toggle-text');
        if (isOpen) {
          targetEl.classList.remove('project__details--open');
          toggle.setAttribute('aria-expanded', 'false');
          if (textSpan) textSpan.innerText = 'View Details';
        } else {
          targetEl.classList.add('project__details--open');
          toggle.setAttribute('aria-expanded', 'true');
          if (textSpan) textSpan.innerText = 'Hide Details';
        }
      }
    });
  });

  // ==========================================
  // 12. Tech Ecosystem Filter
  // ==========================================
  const techFilters = document.querySelectorAll('.tech__filter');
  const techItems = document.querySelectorAll('.tech__item');
  
  // Initial filter state matching active tab
  techItems.forEach(item => {
    if (item.getAttribute('data-tier') !== 'hands-on') {
      item.classList.add('tech__item--hidden');
    }
  });

  techFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const filterValue = filter.getAttribute('data-filter');
      
      techFilters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      filter.classList.add('active');
      filter.setAttribute('aria-selected', 'true');
      
      let visibleItems = [];
      techItems.forEach(item => {
        if (item.getAttribute('data-tier') === filterValue) {
          item.classList.remove('tech__item--hidden');
          visibleItems.push(item);
        } else {
          item.classList.add('tech__item--hidden');
        }
      });
      
      if (!MOTION.reduced) {
        gsap.fromTo(visibleItems,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: MOTION.duration.base, stagger: 0.025, ease: MOTION.ease.major }
        );
      } else {
        gsap.set(visibleItems, { opacity: 1, y: 0 });
      }
    });
  });

  // ==========================================
  // 13. Custom Fluid Cursor (Pointer-Fine Only)
  // ==========================================
  if (MOTION.finePointer && !MOTION.reduced) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let cursorVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorVisible) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        cursorVisible = true;
      }

      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    const renderCursorRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorRing);
    };
    renderCursorRing();

    // Hover scale on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project, .chip, .tech__item, .pipeline__step');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor--hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      cursorVisible = false;
    });
  }

  // ==========================================
  // 14. Magnetic Button Micro-Interaction (Tier 3)
  // ==========================================
  if (MOTION.finePointer && !MOTION.reduced) {
    const magneticButtons = document.querySelectorAll('.btn--primary');
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const maxTranslation = 4;
        const moveX = (x / rect.width) * (maxTranslation * 2); 
        const moveY = (y / rect.height) * (maxTranslation * 2);

        gsap.to(btn, {
          x: Math.max(-maxTranslation, Math.min(maxTranslation, moveX)),
          y: Math.max(-maxTranslation, Math.min(maxTranslation, moveY)),
          duration: 0.3,
          ease: MOTION.ease.medium
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }

})();
