/**
 * Portfolio Website — Main Script
 * Handles: Preloader, Navbar, Scroll Animations, Counter, Filters, Forms, Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // PRELOADER
  // ============================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Start hero animations after preloader hides
      animateHeroStats();
    }, 600);
  });

  // Fallback: hide preloader after 3s even if load event is delayed
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      animateHeroStats();
    }
  }, 3000);

  // ============================================
  // NAVBAR — Scroll & Active State
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Glassmorphism on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ============================================
  // MOBILE MENU
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${percent}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ============================================
  // SCROLL REVEAL — IntersectionObserver
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ============================================
  // HERO STATS COUNTER
  // ============================================
  let statsAnimated = false;

  function animateHeroStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const counters = document.querySelectorAll('.hero-stat-number[data-count]');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);

        counter.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ============================================
  // STORE FILTER
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const storeCards = document.querySelectorAll('.store-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      storeCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ============================================
  // CONTACT FORM
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Mohon isi semua field yang diperlukan.';
      return;
    }

    // Simulate form submission
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
          <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
      Mengirim...
    `;

    setTimeout(() => {
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Pesan berhasil dikirim! Saya akan segera menghubungi kamu. 🎉';
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Kirim Pesan
      `;

      setTimeout(() => {
        formStatus.className = 'form-status';
      }, 5000);
    }, 1500);
  });

  // ============================================
  // BACK TO TOP
  // ============================================
  const backToTop = document.getElementById('backToTop');

  function updateBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // CURSOR GLOW (Desktop only)
  // ============================================
  const cursorGlow = document.getElementById('cursorGlow');

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursorGlow() {
      // Smooth lerp
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(animateCursorGlow);
    }

    animateCursorGlow();
  } else {
    cursorGlow.style.display = 'none';
  }

  // ============================================
  // SMOOTH ANCHOR SCROLLING
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
