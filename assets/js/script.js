gsap.registerPlugin(ScrollTrigger);

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.3,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed',
});

// ============================================
// NAV LERP SYSTEM
// ============================================
const mainNav = document.getElementById('mainNav');

if (mainNav) {
  const navInner      = mainNav.querySelector('.nav-inner');
  const NAV_H_DESKTOP = { max: 92, min: 58 };
  const NAV_H_MOBILE  = { max: 56, min: 44 };
  const isMobileNav   = () => window.innerWidth < 768;

  let currentH = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
  let targetH  = currentH;

  mainNav.style.background = 'rgba(0, 36, 59, 1)';

  function lerpNav(a, b, t) { return a + (b - a) * t; }

  (function navTick() {
    currentH = lerpNav(currentH, targetH, 0.08);
    if (navInner) navInner.style.height = currentH.toFixed(2) + 'px';
    requestAnimationFrame(navTick);
  })();

  lenis.on('scroll', ({ scroll }) => {
    const h = isMobileNav() ? NAV_H_MOBILE : NAV_H_DESKTOP;
    targetH = scroll < 80 ? h.max : h.min;
  });

  window.addEventListener('resize', () => {
    currentH = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
    targetH  = currentH;
  });
}

// ============================================
// MOBILE MENU — PANEL SYSTEM
// ============================================
const hamburger      = document.getElementById('hamburger');
const mobileMenu     = document.getElementById('mobileMenu');
const mobMain        = document.getElementById('mobMain');
const mobServices    = document.getElementById('mobServices');
const mobClose       = document.getElementById('mobClose');
const mobBack        = document.getElementById('mobBack');
const mobServicesBtn = document.getElementById('mobServicesBtn');
const blurOverlay    = document.getElementById('navBlurOverlay');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  mobMain.classList.add('active');
  mobServices.classList.remove('active');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobMain.classList.remove('active');
  mobServices.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
}

if (mobClose) {
  mobClose.addEventListener('click', closeMobileMenu);
}

document.querySelectorAll('.mob-close-sub').forEach(btn => {
  btn.addEventListener('click', closeMobileMenu);
});

if (mobServicesBtn) {
  mobServicesBtn.addEventListener('click', () => {
    mobMain.classList.remove('active');
    mobServices.classList.add('active');
  });
}

if (mobBack) {
  mobBack.addEventListener('click', () => {
    mobServices.classList.remove('active');
    mobMain.classList.add('active');
  });
}

// ============================================
// DESKTOP DROPDOWN — BLUR OVERLAY
// ============================================
const dropdownItems = document.querySelectorAll('.nav-menu > li.has-dropdown');

dropdownItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    blurOverlay.classList.add('active');
  });
  item.addEventListener('mouseleave', () => {
    blurOverlay.classList.remove('active');
  });
});




// ============================================
// ACTIVE NAV LINK — CURRENT PAGE DETECTION
// ============================================
(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Desktop nav
  document.querySelectorAll('.nav-menu > li > a').forEach(link => {
    link.classList.remove('active');
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Mobile nav
  document.querySelectorAll('.mob-nav-list > li').forEach(item => {
    item.classList.remove('mob-active');
    const link = item.querySelector('a');
    if (link) {
      const linkPath = link.getAttribute('href').split('/').pop();
      if (linkPath === currentPath) {
        item.classList.add('mob-active');
      }
    }
  });
})();


// ============================================
// BANNER 
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Rain drops
  document.querySelectorAll('.rain-drop').forEach((drop, i) => {
    gsap.set(drop, {
      y: '-100%', opacity: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)',
    });
    setTimeout(() => rainLoop(drop), i * 600 + Math.random() * 1500);
  });

  function rainLoop(drop) {
    const duration  = 3.2 + Math.random() * 1.6;
    const nextDelay = 1.0 + Math.random() * 1.4;
    gsap.fromTo(drop,
      { y: '-100%', opacity: 0 },
      {
        y: '200%', duration, ease: 'none',
        onStart() {
          gsap.to(drop, { opacity: 1, duration: 0.3, ease: 'power1.out' });
          gsap.to(drop, { opacity: 0, duration: duration * 0.28, delay: duration * 0.72, ease: 'power1.in', overwrite: false });
        },
        onComplete() {
          gsap.set(drop, { opacity: 0, y: '-100%' });
          setTimeout(() => rainLoop(drop), nextDelay * 1000);
        }
      }
    );
  }

  // Magnetic Glow 
  document.querySelectorAll('[data-glow-section]').forEach(section => {
    const glow = section.querySelector('[data-glow-el]');
    if (!glow) return;

    const HOME_X = parseFloat(section.dataset.homeX ?? 70);
    const HOME_Y = parseFloat(section.dataset.homeY ?? 50);
    const MAGNETIC_RADIUS = 0.38;

    let curX = HOME_X, curY = HOME_Y;
    let mouseInside = false;
    let satX = 0, satY = 0, targetSatX = 0, targetSatY = 0;

    const sat = document.createElement('div');
    sat.style.cssText = `
      position:absolute; pointer-events:none; z-index:1;
      width:220px; height:220px; border-radius:50%;
      transform:translate(-50%,-50%);
      background:radial-gradient(circle,rgba(7,106,171,0.55) 0%,rgba(7,106,171,0.15) 40%,transparent 70%);
      filter:blur(18px); opacity:0; transition:opacity 0.3s ease; left:0; top:0;
    `;
    section.insertBefore(sat, section.firstChild);

    gsap.to(glow, { opacity: 1, duration: 1.5, ease: 'power2.inOut', delay: 0.3 });

    section.addEventListener('mousemove', (e) => {
      mouseInside = true;
      sat.style.opacity = '0.85';
      const rect = section.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top)  / rect.height;
      targetSatX = e.clientX - rect.left;
      targetSatY = e.clientY - rect.top;
      const dist = Math.sqrt((mx - HOME_X / 100) ** 2 + (my - HOME_Y / 100) ** 2);
      if (dist < MAGNETIC_RADIUS) {
        const pull = 1 - dist / MAGNETIC_RADIUS;
        curX = lerp(curX, HOME_X + (mx * 100 - HOME_X) * 0.18 * (1 - pull), 0.07);
        curY = lerp(curY, HOME_Y + (my * 100 - HOME_Y) * 0.18 * (1 - pull), 0.07);
      } else {
        curX = lerp(curX, HOME_X + (mx * 100 - HOME_X) * 0.32, 0.06);
        curY = lerp(curY, HOME_Y + (my * 100 - HOME_Y) * 0.32, 0.06);
      }
    });

    section.addEventListener('mouseleave', () => {
      mouseInside = false;
      gsap.to(sat, { opacity: 0, duration: 0.6, ease: 'power2.out' });
    });

    (function tick() {
      const rect = section.getBoundingClientRect();
      if (mouseInside) {
        satX = lerp(satX, targetSatX, 0.09);
        satY = lerp(satY, targetSatY, 0.09);
        const dPx = Math.sqrt(
          (satX - (curX / 100) * rect.width)  ** 2 +
          (satY - (curY / 100) * rect.height) ** 2
        );
        const threshold = rect.width * MAGNETIC_RADIUS * 0.5;
        if (dPx < threshold) {
          const fade = dPx / threshold;
          sat.style.opacity = (fade * 0.85).toFixed(3);
          const size = 160 + (1 - fade) * 60;
          sat.style.width = sat.style.height = size + 'px';
        } else {
          sat.style.opacity = '0.85';
          sat.style.width = sat.style.height = '220px';
        }
        sat.style.left = satX + 'px';
        sat.style.top  = satY + 'px';
      } else {
        curX = lerp(curX, HOME_X, 0.04);
        curY = lerp(curY, HOME_Y, 0.04);
      }
      glow.style.background = `radial-gradient(40% 55% at ${curX.toFixed(2)}% ${curY.toFixed(2)}%, #076AAB 0%, transparent 100%)`;
      requestAnimationFrame(tick);
    })();
  });

});



// WHY SEO NEEDED CARDS
document.querySelectorAll('.why-outer').forEach(card => {
  const img = card.querySelector('.why-card-img img');
  if (!img) return;

  let isAnimating = false;

  card.addEventListener('mouseenter', () => {
    if (isAnimating) return;
    isAnimating = true;
    gsap.timeline({ onComplete: () => { isAnimating = false; } })
      .to(img, { y: -14, skewX: -6, scaleX: 1.04, duration: 0.22, ease: 'power2.out' })
      .to(img, { y: 8,   skewX: 5,  scaleX: 0.98, duration: 0.28, ease: 'sine.inOut' })
      .to(img, { y: -6,  skewX: -3, scaleX: 1.02, duration: 0.22, ease: 'sine.inOut' })
      .to(img, { y: 0,   skewX: 0,  scaleX: 1,    duration: 0.35, ease: 'elastic.out(1, 0.6)' });
  });

  card.addEventListener('mouseleave', () => {
    if (!isAnimating) return;
    gsap.to(img, {
      y: 0, skewX: 0, scaleX: 1,
      duration: 0.4, ease: 'power2.out', overwrite: true,
      onComplete: () => { isAnimating = false; }
    });
  });
});



// NICHE CARDS
gsap.utils.toArray('.niche-item').forEach((card) => {
  const img      = card.querySelector('.niche-item-image img');
  const iconWrap = card.querySelector('.niche-item-image > div');
  if (!img || !iconWrap) return;

  gsap.fromTo(img,
    { clipPath: 'inset(0 100% 0 0 round 24px)' },
    { clipPath: 'inset(0 0% 0 0 round 24px)', duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: card, scroller: document.body, start: 'top 85%', once: true } }
  );

  gsap.set(iconWrap, { y: -16, opacity: 0, scale: 0.8 });

  ScrollTrigger.create({
    trigger: card, scroller: document.body, start: 'top 85%', once: true,
    onEnter: () => {
      gsap.to(iconWrap, { y: 0, opacity: 1, scale: 1, duration: 0.55, delay: 0.5, ease: 'back.out(1.7)' });
    },
  });

  card.addEventListener('mousemove', (e) => {
    const rect  = iconWrap.getBoundingClientRect();
    const dx    = e.clientX - (rect.left + rect.width  / 2);
    const dy    = e.clientY - (rect.top  + rect.height / 2);
    const dist  = Math.sqrt(dx * dx + dy * dy);
    if (dist < 130) {
      const pull  = (1 - dist / 130) * 16;
      const angle = Math.atan2(dy, dx);
      gsap.to(iconWrap, { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull, scale: 1.1, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(iconWrap, { x: 0, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    }
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(iconWrap, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});



// GAME CHANGER — CIRCLE REVEAL
window.addEventListener('load', () => {
  const gcSection = document.querySelector('.game-changer');
  const gcWrapper = document.querySelector('.game-changer-wrapper');
  if (!gcSection || !gcWrapper) return;

  gsap.set(gcSection, { clipPath: 'circle(160px at 50% 50%)' });

  const gcTl = gsap.timeline({ paused: true });
  gcTl.to(gcSection, { clipPath: 'circle(150% at 50% 50%)', ease: 'none', duration: 1 });

  ScrollTrigger.create({
    trigger: gcWrapper,
    scroller: document.body,
    start: 'center center',
    end: '+=1000',
    pin: gcSection,
    pinSpacing: true,
    scrub: 2.5,
    anticipatePin: 0,
    invalidateOnRefresh: true,
    onUpdate: (self) => gcTl.progress(self.progress),
  });

  ScrollTrigger.refresh();
});



// PROVEN RESULTS 
(function initProvenStack() {
  const cards = gsap.utils.toArray('.proven-result-wrap');
  if (cards.length === 0) return;

  function getStackConfig() {
    const w = window.innerWidth;
    if (w < 640)  return { base: 80,  step: 50 };
    if (w < 1024) return { base: 120, step: 70 };
    return                { base: 160, step: 60 };
  }

  function setCardTops() {
    const { base, step } = getStackConfig();
    cards.forEach((card, i) => { card.style.top = (base + i * step) + 'px'; });
  }

  setCardTops();
  window.addEventListener('resize', () => { setCardTops(); ScrollTrigger.refresh(); });

  gsap.set(cards, { y: 60, opacity: 0, scale: 0.97, transformOrigin: 'top center', transformPerspective: 1200 });

  cards.forEach((card, i) => {
    gsap.to(card, {
      y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.3)', delay: i * 0.06,
      scrollTrigger: { trigger: card, scroller: document.body, start: 'top 85%', once: true },
    });

    gsap.fromTo(card,
      { rotateX: 0 },
      { rotateX: 3, ease: 'none',
        scrollTrigger: { trigger: card, scroller: document.body, start: 'top 60%', end: 'bottom 20%', scrub: 1.5 } }
    );

    if (i > 0) {
      ScrollTrigger.create({
        trigger: card, scroller: document.body, start: 'top 60%', once: true,
        onEnter: () => {
          cards.slice(0, i).forEach((prev, j) => {
            gsap.to(prev, { scale: 1 - (i - j) * 0.03, duration: 0.5, ease: 'power2.inOut' });
          });
        }
      });
    }

    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, scale: 1.008, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
    });
  });
})();



// blog img start
(function initBlogReveal() {
    const section = document.querySelector('.article');
    if (!section) return;

    const cards = gsap.utils.toArray('.article .grid > div');
    if (!cards.length) return;

  
    cards.forEach((card) => {
        const img = card.querySelector('.blog-reveal-img');
        const wrap = card.querySelector('.blog-img');
        if (wrap) wrap.style.overflow = 'hidden';
        if (img) gsap.set(img, { xPercent: -105 });
    });

    let hasRevealed = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasRevealed) {
                    hasRevealed = true;

                    cards.forEach((card, i) => {
                        const img = card.querySelector('.blog-reveal-img');
                        if (!img) return;

                        gsap.to(img, {
                            xPercent: 0,
                            duration: 0.85,
                            delay: i * 0.2,
                            ease: 'power3.inOut',
                        });
                    });
                }
            });
        },
        {
            threshold: 0.25, 
        }
    );

    observer.observe(section);
})();
// blog img end



// select start

document.querySelectorAll('select').forEach(select => {
    
    if (select.hasAttribute('data-toc-select')) return;

    if (select.value === '') {
        select.style.color = '#92B9D2';
    }
    select.addEventListener('change', function () {
        this.style.color = this.value === '' ? '#92B9D2' : '#ffffff';
    });
});


//select end



// COMMON SHAPE RIPPLE 
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.common-shape').forEach(function (shapeEl, index) {

    var filterId = 'ripple-filter-' + index;
    var turbId   = 'ripple-turb-'   + index;
    var dispId   = 'ripple-disp-'   + index;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    svg.innerHTML =
      '<defs>' +
        '<filter id="' + filterId + '" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feTurbulence' +
            ' id="' + turbId + '"' +
            ' type="turbulence"' +
            ' baseFrequency="0.015 0.015"' +
            ' numOctaves="2"' +
            ' seed="' + (index * 7 + 2) + '"' +
            ' result="turbulence"' +
          '/>' +
          '<feDisplacementMap' +
            ' id="' + dispId + '"' +
            ' in="SourceGraphic"' +
            ' in2="turbulence"' +
            ' scale="0"' +
            ' xChannelSelector="R"' +
            ' yChannelSelector="G"' +
          '/>' +
        '</filter>' +
      '</defs>';
    document.body.appendChild(svg);

    var bg = shapeEl.querySelector('.common-shape-bg');
    if (bg) bg.style.filter = 'url(#' + filterId + ')';

    var turb = document.getElementById(turbId);
    var disp = document.getElementById(dispId);
    if (!turb || !disp) return;

    var phase      = index * 1.2;
    var dropScale  = 0;
    var isDropping = false;

    function animate() {
      phase += 0.008;
      if (isDropping) {
        dropScale += 1.8;
        if (dropScale >= 18) isDropping = false;
      } else {
        dropScale *= 0.92;
      }
      var freqX = 0.012 + Math.sin(phase)       * 0.006;
      var freqY = 0.012 + Math.cos(phase * 0.8) * 0.006;
      turb.setAttribute('baseFrequency', freqX.toFixed(4) + ' ' + freqY.toFixed(4));
      turb.setAttribute('seed', Math.floor(phase * 30) % 999);
      var scale = dropScale + Math.sin(phase * 2) * 2 + 2;
      disp.setAttribute('scale', scale.toFixed(2));
      requestAnimationFrame(animate);
    }

    animate();

    function triggerDrop() { isDropping = true; dropScale = 0; }

    setTimeout(triggerDrop, 300 + index * 300);
    setInterval(triggerDrop, 1500);
    shapeEl.addEventListener('mouseenter', triggerDrop);
  });
});


// ============================================
// VIDEO SLIDER
document.addEventListener('DOMContentLoaded', function () {
  const videoSliderEl = document.getElementById('video-slider');
  if (!videoSliderEl || typeof Splide === 'undefined') return;

  const splide = new Splide('#video-slider', {
    type: 'loop', drag: 'free', focus: 'center',
    perPage: 5, gap: '12px', arrows: false, pagination: false,
    autoScroll: { speed: 1, pauseOnHover: true, pauseOnFocus: true },
    breakpoints: {
      1536: { perPage: 5 }, 1280: { perPage: 4 },
      1024: { perPage: 3, gap: '10px' }, 768: { perPage: 2.5 },
      640: { perPage: 1.5, gap: '8px' }
    }
  });

  if (window.splide && window.splide.Extensions) {
    splide.mount(window.splide.Extensions);
  } else {
    splide.mount();
  }

  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(card => {
    const video = card.querySelector('.video-element');
    if (!video) return;
    let isPlaying = false;

    card.addEventListener('mouseenter', () => {
      if (!isPlaying) { video.currentTime = 0; video.play().catch(() => {}); isPlaying = true; }
    });
    card.addEventListener('mouseleave', () => {
      if (isPlaying) { video.pause(); video.currentTime = 0; isPlaying = false; }
    });
    video.addEventListener('ended', () => {
      if (isPlaying) { video.currentTime = 0; video.play(); }
    });
  });

  splide.on('move', () => {
    videoCards.forEach(card => {
      const video = card.querySelector('.video-element');
      if (video) { video.pause(); video.currentTime = 0; }
    });
  });
});



// TESTIMONIAL SLIDER
// ============================================
function initContentTestimonialSlider() {
  if (!document.getElementById('testimonialSlider')) return;

  const arrowSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.1716 6.77822L6.8076 1.41421L8.2218 0L16 7.77822L8.2218 15.5563L6.8076 14.1421L12.1716 8.77822H0V6.77822H12.1716Z"/>
  </svg>`;

  const testimonialSplide = new Splide('#testimonialSlider', {
    type: 'loop', perPage: 2, perMove: 1, gap: '2rem',
    autoplay: true, interval: 4000, pauseOnHover: true,
    arrows: true, pagination: false,
    breakpoints: { 1024: { perPage: 1, gap: '1.5rem' } }
  });

  testimonialSplide.mount();

  const testimonialWrapper = document.getElementById('testimonialSlider').closest('.content-our-testimonial');
  if (!testimonialWrapper) return;

  const originalArrows           = testimonialWrapper.querySelector('.splide__arrows');
  const testimonialArrowsDesktop = testimonialWrapper.querySelector('.testimonial-real-content-slider-arrows-desktop');
  const testimonialArrowsMobile  = testimonialWrapper.querySelector('.testimonial-real-content-slider-arrows-mobile');

  if (!originalArrows || !testimonialArrowsDesktop || !testimonialArrowsMobile) return;

  testimonialArrowsDesktop.innerHTML = originalArrows.innerHTML;
  testimonialArrowsMobile.innerHTML  = originalArrows.innerHTML;

  [testimonialArrowsDesktop, testimonialArrowsMobile].forEach(container => {
    container.querySelectorAll('.splide__arrow').forEach(arrow => { arrow.innerHTML = arrowSVG; });
    const prevBtn = container.querySelector('.splide__arrow--prev');
    const nextBtn = container.querySelector('.splide__arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', () => testimonialSplide.go('<'));
    if (nextBtn) nextBtn.addEventListener('click', () => testimonialSplide.go('>'));
  });

  originalArrows.style.display = 'none';
}

initContentTestimonialSlider();


// ============================================
// FAQ
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const trigger   = item.querySelector('.faq-trigger');
    const content   = item.querySelector('.faq-content');
    const border    = item.querySelector('.faq-border');
    const iconClose = item.querySelector('.icon-close');
    const iconOpen  = item.querySelector('.icon-open');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const oc = other.querySelector('.faq-content');
          const ob = other.querySelector('.faq-border');
          const oC = other.querySelector('.icon-close');
          const oO = other.querySelector('.icon-open');
          if (oc) oc.style.maxHeight = '0';
          if (ob) ob.classList.add('hidden');
          if (oC) oC.classList.remove('hidden');
          if (oO) oO.classList.add('hidden');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        if (content)   content.style.maxHeight = '0';
        if (border)    border.classList.add('hidden');
        if (iconClose) iconClose.classList.remove('hidden');
        if (iconOpen)  iconOpen.classList.add('hidden');
      } else {
        item.classList.add('active');
        if (content)   content.style.maxHeight = content.scrollHeight + 'px';
        if (border)    border.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
        if (iconOpen)  iconOpen.classList.remove('hidden');
      }
    });
  });
}

function initFAQGrid() {
  const wrap = document.getElementById('faqGridWrap');
  if (!wrap) return;

  const items = Array.from(wrap.querySelectorAll('.faq-item'));
  if (items.length === 0) return;

  const leftCol  = document.createElement('div');
  const rightCol = document.createElement('div');
  leftCol.className  = 'flex flex-col gap-0 w-full md:w-1/2';
  rightCol.className = 'flex flex-col gap-0 w-full md:w-1/2';

  items.forEach((item, i) => {
    if (i % 2 === 0) leftCol.appendChild(item);
    else             rightCol.appendChild(item);
  });

  wrap.innerHTML = '';
  wrap.className = 'flex flex-col md:flex-row md:gap-8 items-start';
  wrap.appendChild(leftCol);
  wrap.appendChild(rightCol);
}

document.addEventListener('DOMContentLoaded', () => {
  initFAQGrid();
  initFAQ();
});


// PARTNER SLIDER
document.addEventListener('DOMContentLoaded', () => {
  const partnerSliderEl = document.getElementById('partner-slider');
  if (!partnerSliderEl || typeof Splide === 'undefined') return;

  const partnerSplide = new Splide('#partner-slider', {
    type: 'loop', drag: 'free', focus: 'center',
    perPage: 6, gap: '0px', arrows: false, pagination: false,
    autoScroll: { speed: 1, pauseOnHover: true, pauseOnFocus: false },
    breakpoints: {
      1280: { perPage: 5 }, 1024: { perPage: 4 },
      768: { perPage: 3 },  640: { perPage: 2, gap: '8px' }
    }
  });

  if (window.splide && window.splide.Extensions) {
    partnerSplide.mount(window.splide.Extensions);
  } else {
    partnerSplide.mount();
  }
});




//about us common shape


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.common-shape').forEach(function (shapeEl, index) {

    var filterId = 'ripple-filter-' + index;
    var turbId   = 'ripple-turb-'   + index;
    var dispId   = 'ripple-disp-'   + index;

    // SVG filter inject
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    svg.innerHTML =
      '<defs>' +
        '<filter id="' + filterId + '" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feTurbulence' +
            ' id="' + turbId + '"' +
            ' type="turbulence"' +
            ' baseFrequency="0.015 0.015"' +
            ' numOctaves="2"' +
            ' seed="' + (index * 7 + 2) + '"' +
            ' result="turbulence"' +
          '/>' +
          '<feDisplacementMap' +
            ' id="' + dispId + '"' +
            ' in="SourceGraphic"' +
            ' in2="turbulence"' +
            ' scale="0"' +
            ' xChannelSelector="R"' +
            ' yChannelSelector="G"' +
          '/>' +
        '</filter>' +
      '</defs>';
    document.body.appendChild(svg);

    var bg = shapeEl.querySelector('.common-shape-bg');
    if (bg) {
      bg.style.filter = 'url(#' + filterId + ')';
    }

    var turb = document.getElementById(turbId);
    var disp = document.getElementById(dispId);

    if (!turb || !disp) return;

    var phase      = index * 1.2;
    var dropScale  = 0;
    var isDropping = false;

    function animate() {
      phase += 0.008;

      if (isDropping) {
        dropScale += 1.8;
        if (dropScale >= 18) isDropping = false;
      } else {
        dropScale *= 0.92;
      }

      var freqX = 0.012 + Math.sin(phase)       * 0.006;
      var freqY = 0.012 + Math.cos(phase * 0.8) * 0.006;
      turb.setAttribute('baseFrequency', freqX.toFixed(4) + ' ' + freqY.toFixed(4));
      turb.setAttribute('seed', Math.floor(phase * 30) % 999);

      var scale = dropScale + Math.sin(phase * 2) * 2 + 2;
      disp.setAttribute('scale', scale.toFixed(2));

      requestAnimationFrame(animate);
    }

    animate();

    function triggerDrop() {
      isDropping = true;
      dropScale  = 0;
    }

    setTimeout(triggerDrop, 300 + index * 300);
    setInterval(triggerDrop, 1500);
    shapeEl.addEventListener('mouseenter', triggerDrop);
  });
});


// About Banner 
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.about-banner-img');
    if (!container) return;

    const trailer = container.querySelector('.image-trailer-local');
    const images  = container.querySelectorAll('.trail-img');
    
    console.log('Trail images found:', images.length);
    console.log('Trailer el:', trailer);
    
    if (!trailer || !images.length) return;

    let currentIndex = 0;
    let lastPos      = { x: 0, y: 0 };
    let lastTime     = Date.now();

    const MOVE_THRESHOLD = 50;
    const TIME_DELAY     = 60;

    container.addEventListener('mousemove', function (e) {
        const rect = container.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;

        const dx   = x - lastPos.x;
        const dy   = y - lastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOVE_THRESHOLD) return;

        const now = Date.now();
        if (now - lastTime < TIME_DELAY) return;

        const img    = images[currentIndex].cloneNode(true);
        currentIndex = (currentIndex + 1) % images.length;

        img.style.left     = (x - 75) + 'px';
        img.style.top      = (y - 75) + 'px';
        img.style.opacity  = '0';
        img.style.position = 'absolute';
        img.style.width    = '150px';
        img.style.height   = '150px';
        img.style.zIndex   = '9999';

        trailer.appendChild(img);

        gsap.fromTo(img,
            { opacity: 0, scale: 0, rotation: gsap.utils.random(-20, 20) },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }
        );

        gsap.to(img, {
            opacity:  0,
            scale:    0,
            duration: 0.5,
            delay:    0.5,
            ease:     'power2.in',
            onComplete: function () { img.remove(); }
        });

        lastPos  = { x, y };
        lastTime = now;
    });
});



//signature svg animation

(function () {
   var path  = document.getElementById('sig-line');
  var arrow = document.getElementById('sig-arrow');
  var svg   = document.getElementById('main-svg');


    if (!path || !arrow || !svg) return;

  function placeArrow() {
    var len = path.getTotalLength();
    var p1  = path.getPointAtLength(len - 3);
    var p2  = path.getPointAtLength(len + 4);

    var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

    var tipX = 21.3708;
    var tipY = 5.72535;
    var rad  = (angle * Math.PI) / 180;

    var rotTipX = tipX * Math.cos(rad) - tipY * Math.sin(rad);
    var rotTipY = tipX * Math.sin(rad) + tipY * Math.cos(rad);

    var tx = p2.x - rotTipX + 3;
    var ty = p2.y - rotTipY - 5;

    arrow.setAttribute(
      'transform',
      'translate(' + tx + ',' + ty + ') rotate(' + angle + ',0,0)'
    );
  }

   if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          placeArrow();
          document.getElementById('sig-line').classList.add('go');
          document.getElementById('sig-arrow').classList.add('go');
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });

    obs.observe(svg);
  } else {
    placeArrow();
    document.getElementById('sig-line').classList.add('go');
    document.getElementById('sig-arrow').classList.add('go');
  }
})();








//  Counter Animation
gsap.registerPlugin(ScrollTrigger);

const counters = document.querySelectorAll('.counter');

counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target);  
    const suffix = counter.dataset.suffix ?? '';     
    const pad    = parseInt(counter.dataset.pad) || 0;

    const obj = { value: 0 };

    gsap.to(obj, {
        value: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: counter,
            start: 'top 85%',  
            once: true,        
        },
        onUpdate() {
            const current = Math.round(obj.value);
            const display = pad
                ? String(current).padStart(pad, '0') 
                : current;
            counter.textContent = display + suffix;
        },
        onComplete() {
           
            const display = pad
                ? String(target).padStart(pad, '0')
                : target;
            counter.textContent = display + suffix;
        },
    });
});



// ceo quote animaiton


if (document.querySelector('.quote-mask-img') && document.querySelector('.quote-img')) {
  gsap.fromTo('.quote-mask-img',
    {
      clipPath: 'inset(100% 100% 0% 0% round 12px)',
      opacity: 0,
      rotate: 45,
      scale: 0.6,
      transformOrigin: 'bottom right',
    },
    {
      clipPath: 'inset(0% 0% 0% 0% round 12px)',
      opacity: 1,
      rotate: 0,
      scale: 1,
      transformOrigin: 'bottom right',
      duration: 0.9,
      ease: 'back.out(1.4)',
      delay: 0.2,
      scrollTrigger: {
        trigger: '.quote-img',
        start: 'top 95%',
        end: 'bottom 10%',
        once: false,
        onEnter: (self) => self.animation.restart(),
        onEnterBack: (self) => self.animation.restart(),
        onLeave: () => {
          gsap.set('.quote-mask-img', {
            clipPath: 'inset(100% 100% 0% 0% round 12px)',
            opacity: 0,
            rotate: 45,
            scale: 0.6,
          });
        },
        onLeaveBack: () => {
          gsap.set('.quote-mask-img', {
            clipPath: 'inset(100% 100% 0% 0% round 12px)',
            opacity: 0,
            rotate: 45,
            scale: 0.6,
          });
        },
      }
    }
  );
}

//icon global animaiton

const iconGroups = new Map();

document.querySelectorAll('.anim-icon').forEach((icon) => {
    const img = icon.querySelector('img, svg');
    if (!img) return;

  
    gsap.set(img, {
        scale: 0,
        rotate: -15,
        opacity: 0,
        transformOrigin: 'center center',
    });

    
    const parent = icon.closest('.grid, [class*="grid"]') || icon.parentElement;

    if (!iconGroups.has(parent)) {
        iconGroups.set(parent, []);
    }
    iconGroups.get(parent).push({ icon, img });
});


iconGroups.forEach((items, parent) => {
    const imgs  = items.map(item => item.img);
    const icons = items.map(item => item.icon);

    const animateIn = () => {
        gsap.to(imgs, {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'back.out(1.7)',
            stagger: 0.12, 
        });
    };

    const animateOut = () => {
        gsap.to(imgs, {
            scale: 0,
            rotate: -15,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            stagger: 0, 
        });
    };

    ScrollTrigger.create({
        trigger: parent,  
        start: 'top 85%',
        end: 'bottom 15%',
        once: false,
        onEnter:      animateIn,
        onEnterBack:  animateIn,
        onLeave:      animateOut,
        onLeaveBack:  animateOut,
    });


    const STRENGTH = 18;
    const TILT     = 12;

    icons.forEach((icon, i) => {
        const img = imgs[i];

        icon.addEventListener('mousemove', (e) => {
            const rect    = icon.getBoundingClientRect();
            const cx      = rect.left + rect.width  / 2;
            const cy      = rect.top  + rect.height / 2;
            const dx      = e.clientX - cx;
            const dy      = e.clientY - cy;
            const dist    = Math.sqrt(dx * dx + dy * dy);
            const radius  = Math.max(rect.width, rect.height) * 0.85;
            const pull    = Math.max(0, 1 - dist / radius);
            const moveX   = (dx / radius) * STRENGTH * pull;
            const moveY   = (dy / radius) * STRENGTH * pull;
            const rotateY =  (dx / radius) * TILT;
            const rotateX = -(dy / radius) * TILT;

            gsap.to(img, {
                x: moveX,
                y: moveY,
                rotateX,
                rotateY,
                scale: 1.08,
                transformPerspective: 600,
                transformOrigin: 'center center',
                duration: 0.35,
                ease: 'power2.out',
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(img, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)',
            });
        });
    });
});



//single service rolling animation
(function () {
    // Count items dynamically instead of hardcoding
    const TOTAL = document.querySelectorAll('.strategy-item').length;

    // Responsive BOX_H
    function getBoxH() {
        if (window.innerWidth <= 776) return 56;
        if (window.innerWidth <= 1024) return 62;
        return 90;
    }

    let BOX_H = getBoxH();

    const roller = document.getElementById('numRoller');
    if (!roller) return;
    const numBox = roller.closest('.sticky');
    if (!numBox) return;
    let currentNum = 0;
    let isHovering = false;

    // CSS inject
    const style = document.createElement('style');
    style.textContent = `
        .strategy-item {
            transition: background 0.4s ease, padding-left 0.3s ease;
            border-radius: 12px;
            padding-left: 12px;
            cursor: default;
        }
        .strategy-item:hover {
            background: radial-gradient(50% 50% at 50% 50%, rgba(42,143,210,0.08) 0%, rgba(7,106,171,0.08) 100%);
            padding-left: 20px;
        }
        .strategy-item h3,
        .strategy-item p {
            transition: color 0.3s ease;
        }
        .num-box-inner {
            transition: background 0.5s ease, border-color 0.5s ease;
        }
        .num-box-inner.hovered {
            background: radial-gradient(50% 50% at 50% 50%, #2A8FD2 0%, #076AAB 100%);
            border-color: transparent;
        }
        .num-digit-el {
            transition: color 0.4s ease;
        }
        .num-digit-el.white {
            color: #fff !important;
        }
    `;
    document.head.appendChild(style);

    numBox.classList.add('num-box-inner');

    function buildRoller() {
        roller.innerHTML = '';
        for (let i = 1; i <= TOTAL; i++) {
            const div = document.createElement('div');
            div.className = 'num-digit-el';

            let fontSize = '52px';
            if (BOX_H <= 56) fontSize = '32px';
            else if (BOX_H <= 62) fontSize = '42px';

            div.style.cssText = `
                width: ${BOX_H}px;
                height: ${BOX_H}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${fontSize};
                font-weight: 700;
                color: #076AAB;
                flex-shrink: 0;
            `;
            div.textContent = i;
            roller.appendChild(div);
        }
    }

    function setDigitColors(white) {
        document.querySelectorAll('.num-digit-el').forEach(d => {
            d.style.color = white ? '#fff' : '#076AAB';
        });
    }

    function rollTo(num) {
        if (num === currentNum) return;
        currentNum = num;
        roller.style.transform = `translateY(-${(num - 1) * BOX_H}px)`;
    }

    function getActiveNum() {
        const items = document.querySelectorAll('.strategy-item');
        let activeNum = 1;
        let bestRatio = 0;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const visiblePx = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const ratio = visiblePx / rect.height;
            if (ratio > bestRatio) {
                bestRatio = ratio;
                activeNum = parseInt(item.dataset.num, 10);
            }
        });

        return activeNum;
    }

    function onScroll() {
        if (!isHovering) {
            rollTo(getActiveNum());
        }
    }

    // Hover interaction
    const items = document.querySelectorAll('.strategy-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            isHovering = true;
            const num = parseInt(item.dataset.num, 10);
            numBox.classList.add('hovered');
            setDigitColors(true);
            roller.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
            rollTo(num);
        });

        item.addEventListener('mouseleave', () => {
            isHovering = false;
            numBox.classList.remove('hovered');
            setDigitColors(false);
            roller.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            rollTo(getActiveNum());
        });
    });

    // Rebuild on resize
    window.addEventListener('resize', () => {
        const newBoxH = getBoxH();
        if (newBoxH === BOX_H) return;
        BOX_H = newBoxH;
        buildRoller();
        roller.style.transition = 'none';
        roller.style.transform = `translateY(-${(currentNum - 1) * BOX_H}px)`;
        setTimeout(() => {
            roller.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 100);
    });

    // Init
    buildRoller();
    roller.style.transition = 'none';
    roller.style.transform = 'translateY(0)';
    currentNum = 1;

    setTimeout(() => {
        roller.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();




// play video on scroll
// play video on scroll - multiple videos
const plySections = document.querySelectorAll('.makes-different-img');

plySections.forEach((plySection) => {
    const plyVideo = plySection.querySelector('video');

    if (plyVideo) {
        plyVideo.muted = true;
        plyVideo.playsInline = true;
        plyVideo.pause();
        plyVideo.currentTime = 0;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        plyVideo.currentTime = 0;
                        plyVideo.play().catch((e) => console.warn('Play blocked:', e));
                    } else {
                        plyVideo.pause();
                        plyVideo.currentTime = 0;
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(plySection);
    }
});



//footer animation

(function () {
    const footer = document.getElementById('animatedFooter');
    const gradientBg = document.getElementById('footerGradientBg');

    if (!footer || !gradientBg) return;

    function updateScrollGradient() {
        const rect = footer.getBoundingClientRect();
        const windowH = window.innerHeight;
        const footerH = footer.offsetHeight;

        const progress = Math.min(
            Math.max((windowH - rect.top) / (windowH + footerH), 0),
            1
        );

        const yPos = -10 + progress * 60;
        const size = 40 + progress * 30;
        const opacity = Math.min(progress * 2, 1);

        gradientBg.style.background = `radial-gradient(
            ${size}% ${size}% at 50% ${yPos}%,
            rgba(7, 106, 171, ${opacity}) 0%,
            transparent 70%
        )`;
    }

    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let rafId = null;
    let isMouseInFooter = false;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animateMouseGradient() {
        currentX = lerp(currentX, targetX, 0.03);
        currentY = lerp(currentY, targetY, 0.03);

        const rect = footer.getBoundingClientRect();
        const windowH = window.innerHeight;
        const footerH = footer.offsetHeight;
        const scrollProgress = Math.min(
            Math.max((windowH - rect.top) / (windowH + footerH), 0),
            1
        );

        const size = 40 + scrollProgress * 30;
        const opacity = Math.min(scrollProgress * 2, 1);

        gradientBg.style.background = `radial-gradient(
            ${size}% ${size}% at ${currentX}% ${currentY}%,
            rgba(7, 106, 171, ${opacity}) 0%,
            transparent 70%
        )`;

        rafId = requestAnimationFrame(animateMouseGradient);
    }

    // ✅ FIXED mouseenter — mouse এর exact position থেকে শুরু করবে
    footer.addEventListener('mouseenter', (e) => {
        isMouseInFooter = true;

        const rect = footer.getBoundingClientRect();
        currentX = ((e.clientX - rect.left) / rect.width) * 100;
        currentY = ((e.clientY - rect.top) / rect.height) * 100;
        targetX = currentX;
        targetY = currentY;

        if (rafId) cancelAnimationFrame(rafId);
        animateMouseGradient();
    });

    footer.addEventListener('mousemove', (e) => {
        const rect = footer.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
    });

    // ✅ FIXED mouseleave — cleanly center এ ফিরে যাবে
    footer.addEventListener('mouseleave', () => {
        isMouseInFooter = false;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;

        targetX = 50;
        targetY = 50;

        function returnToCenter() {
            currentX = lerp(currentX, 50, 0.025);
            currentY = lerp(currentY, 50, 0.025);

            updateScrollGradient();

            if (Math.abs(currentX - 50) > 0.1 || Math.abs(currentY - 50) > 0.1) {
                rafId = requestAnimationFrame(returnToCenter);
            } else {
                rafId = null;
            }
        }
        returnToCenter();
    });

    window.addEventListener('scroll', () => {
        if (!isMouseInFooter) {
            updateScrollGradient();
        }
    }, { passive: true });

    updateScrollGradient();
})();







// Tab filter case study page
function initFilterSystem(tabSelector, cardSelector) {
  const buttons = document.querySelectorAll(tabSelector);
  const cards = document.querySelectorAll(cardSelector);

  if (!buttons.length || !cards.length) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // active state
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const visibleCards = [];
      const hiddenCards = [];

      cards.forEach(card => {
        const category = (card.dataset.category || "").split(" ");
        const match = filter === "all" || category.includes(filter);

        if (match) visibleCards.push(card);
        else hiddenCards.push(card);
      });

      // fade out hidden
      gsap.to(hiddenCards, {
        opacity: 0,
        y: 15,
        scale: 0.98,
        filter: "blur(10px)",
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.03,
        onComplete: () => {
          hiddenCards.forEach(c => (c.style.display = "none"));
        }
      });

      // reveal next frame
      requestAnimationFrame(() => {
        visibleCards.forEach(card => {
          card.style.display = "block";

          gsap.set(card, {
            opacity: 0,
            y: 12,
            scale: 0.98,
            filter: "blur(10px)"
          });
        });

        gsap.to(visibleCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05
        });
      });
    });
  });
}

/* INIT — only proven results now */
document.addEventListener("DOMContentLoaded", () => {
  initFilterSystem(".tab-btn-case", ".proven-result-card");
});


// Tab filter blog page
function initFilterSystem(tabSelector, cardSelector) {
  const buttons = document.querySelectorAll(tabSelector);
  const cards = document.querySelectorAll(cardSelector);

  if (!buttons.length || !cards.length) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const visible = [];
      const hidden = [];

      cards.forEach(card => {
        const category = (card.dataset.category || "").split(" ");
        const match = filter === "all" || category.includes(filter);

        if (match) visible.push(card);
        else hidden.push(card);
      });


      gsap.to(hidden, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: "blur(10px)",
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.02,
        onComplete: () => {
          hidden.forEach(el => {
            el.style.display = "none";
          });

          revealVisible(visible);
        }
      });

      function revealVisible(items) {
        items.forEach(el => {
          el.style.display = "block";
        });

        // force browser to recalc layout before animation
        requestAnimationFrame(() => {
          gsap.fromTo(
            items,
            {
              opacity: 0,
              y: 20,
              scale: 0.98,
              filter: "blur(10px)"
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.05,
              clearProps: "filter"
            }
          );
        });
      }
    });
  });
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  initFilterSystem(".tab-btn-blog", ".blog-card");
});



function initProvenCardAnimation() {
  const cards = document.querySelectorAll(".proven-result-card");

  if (!cards.length) return;

  cards.forEach((card) => {
    // initial state
    gsap.set(card, {
      opacity: 0,
      y: 40,
      filter: "blur(12px)"
    });

    gsap.to(card, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
}

// init
document.addEventListener("DOMContentLoaded", initProvenCardAnimation);




// Filter section in team page
// Team Filter & Scroll
// Team Filter & Scroll
// ============================================
// TEAM FILTER & SCROLL SPY
// ============================================
// ============================================
// TEAM FILTER & SCROLL SPY
// ============================================
(function () {
  const aside      = document.querySelector('.allteams');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.team-section');

  // allteams aside না থাকলে exit — career page এ চলবে না
  if (!aside) return;

  let isClicking   = false;
  let clickTimeout = null;

  // ── Mobile select inject ──────────────────
  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'career-mob-select-wrap';

  const mobileSelect = document.createElement('select');
  mobileSelect.className = 'career-mob-select';

  filterBtns.forEach(btn => {
    const opt = document.createElement('option');
    opt.value = btn.dataset.filter;
    opt.textContent = btn.textContent.trim();
    if (btn.classList.contains('active')) opt.selected = true;
    mobileSelect.appendChild(opt);
  });

  const arrow = document.createElement('span');
  arrow.className = 'career-mob-arrow';
  arrow.innerHTML = `<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.995807 0H12.1758C12.3736 0.000829231 12.5667 0.0602841 12.7306 0.170847C12.8946 0.28141 13.0222 0.438116 13.0971 0.621148C13.172 0.804181 13.191 1.00532 13.1516 1.19913C13.1122 1.39295 13.0162 1.57073 12.8758 1.71L7.29581 7.29C7.20284 7.38373 7.09224 7.45812 6.97038 7.50889C6.84853 7.55966 6.71782 7.5858 6.58581 7.5858C6.4538 7.5858 6.32309 7.55966 6.20123 7.50889C6.07937 7.45812 5.96877 7.38373 5.87581 7.29L0.295808 1.71C0.155386 1.57073 0.059415 1.39295 0.0200298 1.19913C-0.0193553 1.00532 -0.000386119 0.804181 0.0745395 0.621148C0.149465 0.438116 0.276982 0.28141 0.440965 0.170847C0.604949 0.0602841 0.798035 0.000829231 0.995807 0Z" fill="#076AAB"/></svg>`;

  selectWrapper.appendChild(mobileSelect);
  selectWrapper.appendChild(arrow);
  aside.insertBefore(selectWrapper, aside.firstChild);

  // ── CSS inject ────────────────────────────
  if (!document.querySelector('#team-mob-style')) {
  const style = document.createElement('style');
  style.id = 'team-mob-style';
  style.textContent = `
    .career-mob-select-wrap { display: none; position: relative; width: 100%; }
    .career-mob-select {
      width: 100%; padding: 14px 48px 14px 20px; border-radius: 9999px;
      font-weight: 600; font-size: 16px; color: #076AAB; background: #fff;
      border: 1px solid #076AAB; cursor: pointer; outline: none;
      appearance: none; -webkit-appearance: none; box-sizing: border-box;
    }
    .career-mob-arrow {
      position: absolute; right: 20px; top: 50%;
      transform: translateY(-50%) rotate(0deg);
      transition: transform 0.25s ease; pointer-events: none;
      display: flex; align-items: center;
    }
    .career-mob-arrow.open { transform: translateY(-50%) rotate(180deg); }
    @media (max-width: 1023px) {
      .career-mob-select-wrap { display: block; }
      .filter-btn { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}

  // ── Arrow toggle ──────────────────────────
  let isOpen = false;
  mobileSelect.addEventListener('click', () => {
    isOpen = !isOpen;
    arrow.classList.toggle('open', isOpen);
  });
  mobileSelect.addEventListener('blur', () => { isOpen = false; arrow.classList.remove('open'); });
  mobileSelect.addEventListener('change', () => {
    isOpen = false;
    arrow.classList.remove('open');
    setActiveBtn(mobileSelect.value);
    scrollToFilter(mobileSelect.value);
  });

  // ── Shared helpers ────────────────────────
  function setActiveBtn(filter) {
    filterBtns.forEach(b => b.classList.remove('active'));
    const target = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (target) target.classList.add('active');
    mobileSelect.value = filter;
  }

  function scrollToFilter(filter) {
    isClicking = true;
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => { isClicking = false; }, 1000);

    if (filter === 'all') {
      const first = document.querySelector('.team-section')?.closest('.team-devider-point');
      if (first) {
        const top = first.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }

    const targetSection = document.querySelector(`.team-section[data-category="${filter}"]`);
    if (!targetSection) return;
    const wrapper = targetSection.closest('.team-devider-point');
    if (!wrapper) return;
    const top = wrapper.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // ── Desktop button click ──────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      setActiveBtn(filter);
      scrollToFilter(filter);
    });
  });

  // ── Scroll spy ────────────────────────────
  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClicking) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveBtn(entry.target.dataset.category);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
  }

})();




// ============================================
// CAREER FILTER
// ============================================
(function () {
  const careerAside = document.querySelector('.career-cards-wrapper')
    ?.closest('section')
    ?.querySelector('aside');

  if (!careerAside) return;

  const filterBtns = careerAside.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  // ── Mobile select inject ──────────────────
  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'career-mob-select-wrap';

  const mobileSelect = document.createElement('select');
  mobileSelect.className = 'career-mob-select';

  filterBtns.forEach(btn => {
    const opt = document.createElement('option');
    opt.value = btn.dataset.filter;
    opt.textContent = btn.textContent.trim();
    if (btn.classList.contains('active')) opt.selected = true;
    mobileSelect.appendChild(opt);
  });

  const arrow = document.createElement('span');
  arrow.className = 'career-mob-arrow';
  arrow.innerHTML = `<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.995807 0H12.1758C12.3736 0.000829231 12.5667 0.0602841 12.7306 0.170847C12.8946 0.28141 13.0222 0.438116 13.0971 0.621148C13.172 0.804181 13.191 1.00532 13.1516 1.19913C13.1122 1.39295 13.0162 1.57073 12.8758 1.71L7.29581 7.29C7.20284 7.38373 7.09224 7.45812 6.97038 7.50889C6.84853 7.55966 6.71782 7.5858 6.58581 7.5858C6.4538 7.5858 6.32309 7.55966 6.20123 7.50889C6.07937 7.45812 5.96877 7.38373 5.87581 7.29L0.295808 1.71C0.155386 1.57073 0.059415 1.39295 0.0200298 1.19913C-0.0193553 1.00532 -0.000386119 0.804181 0.0745395 0.621148C0.149465 0.438116 0.276982 0.28141 0.440965 0.170847C0.604949 0.0602841 0.798035 0.000829231 0.995807 0Z" fill="#076AAB"/></svg>`;

  selectWrapper.appendChild(mobileSelect);
  selectWrapper.appendChild(arrow);
  careerAside.insertBefore(selectWrapper, careerAside.firstChild);

  // ── CSS inject (একবারই) ───────────────────
  if (!document.querySelector('#career-mob-style')) {
    const style = document.createElement('style');
    style.id = 'career-mob-style';
    style.textContent = `
      .career-mob-select-wrap { display: none; position: relative; width: 100%; }
      .career-mob-select {
        width: 100%; padding: 14px 48px 14px 20px; border-radius: 9999px;
        font-weight: 600; font-size: 16px; color: #076AAB; background: #fff;
        border: 1px solid #076AAB; cursor: pointer; outline: none;
        appearance: none; -webkit-appearance: none; box-sizing: border-box;
      }
      .career-mob-arrow {
        position: absolute; right: 20px; top: 50%;
        transform: translateY(-50%) rotate(0deg);
        transition: transform 0.25s ease; pointer-events: none;
        display: flex; align-items: center;
      }
      .career-mob-arrow.open { transform: translateY(-50%) rotate(180deg); }
      @media (max-width: 1023px) {
        .career-mob-select-wrap { display: block; }
        .filter-btn { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Arrow toggle ──────────────────────────
  let isOpen = false;
  mobileSelect.addEventListener('click', () => {
    isOpen = !isOpen;
    arrow.classList.toggle('open', isOpen);
  });
  mobileSelect.addEventListener('blur', () => { isOpen = false; arrow.classList.remove('open'); });
  mobileSelect.addEventListener('change', () => {
    isOpen = false;
    arrow.classList.remove('open');
    setActiveBtn(mobileSelect.value);
    applyFilter(mobileSelect.value);
  });

  // ── Helpers ───────────────────────────────
  function setActiveBtn(filter) {
    filterBtns.forEach(b => b.classList.remove('active'));
    const target = careerAside.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (target) target.classList.add('active');
    mobileSelect.value = filter;
  }

  function applyFilter(filter) {
    const cards = document.querySelectorAll('.career-cards-wrapper > div');
    cards.forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
      } else {
        card.style.display = card.dataset.category === filter ? '' : 'none';
      }
    });
  }

  // ── Desktop button click ──────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      setActiveBtn(filter);
      applyFilter(filter);
    });
  });

})();

// Career details page

//case study & career details — TOC ScrollSpy (h2 + h3)
//case study & career details — TOC ScrollSpy (h2 + h3)
//  TOC ScrollSpy — h2 accordion + h3 children (desktop) | flat select (mobile)
//  TOC ScrollSpy — h2 accordion + h3 children | fixed spacing

(function () {
  "use strict";

  const OFFSET          = -100;
  const SCROLL_DURATION = 1.2;
  const ACTIVE_CLASS    = "toc-active";
  const H2_COLOR        = "var(--toc-default-color, #526E80)";
  const H3_COLOR        = "#7A99AB";
  const ACTIVE_COLOR    = "var(--toc-active-color, #076AAB)";
  const MAX_OPT_CHARS   = 38;

  /* ── SLUG ── */
  const usedSlugs = {};
  function toSlug(text) {
    let slug = text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    usedSlugs[slug] = (usedSlugs[slug] || 0) + 1;
    return usedSlugs[slug] > 1 ? slug + "-" + usedSlugs[slug] : slug;
  }

  /* ── INIT ── */
  function init() {
    const contentWrap = document.querySelector("[data-toc-content]");
    if (!contentWrap) return;

    const navWrap      = document.querySelector("[data-toc-nav]");
    const progressBar  = document.querySelector("[data-toc-progress]");
    const mobileSelect = document.querySelector("[data-toc-select]");

    const headings = Array.from(contentWrap.querySelectorAll("h2, h3"));
    if (!headings.length) return;

    headings.forEach((h) => { if (!h.id) h.id = toSlug(h.textContent); });

    buildNav(headings, navWrap, mobileSelect);
    if (progressBar)  initProgressBar(contentWrap, progressBar);
    initScrollSpy(headings, navWrap, mobileSelect);
    if (navWrap)      bindNavClicks(navWrap);
    if (mobileSelect) { injectSelectArrow(mobileSelect); bindSelectChange(mobileSelect); }
  }

  /* ── BUILD NAV ── */
  function buildNav(headings, navWrap, mobileSelect) {
    if (!navWrap && !mobileSelect) return;
    if (navWrap)      navWrap.innerHTML      = "";
    if (mobileSelect) mobileSelect.innerHTML = "";

    // Group headings into [{h2, children:[h3…]}, …]
    const groups = [];
    headings.forEach((h) => {
      if (h.tagName === "H2") {
        groups.push({ h2: h, children: [] });
      } else if (h.tagName === "H3" && groups.length) {
        groups[groups.length - 1].children.push(h);
      }
    });

    groups.forEach((group) => {
      const { h2, children } = group;
      const hasChildren = children.length > 0;

      /* ── Desktop ── */
      if (navWrap) {

        // Outer group wrapper — single bottom border, contains BOTH row and childWrap
        const groupWrap = document.createElement("div");
        groupWrap.dataset.groupWrap = h2.id;
        groupWrap.style.cssText = "border-bottom:1px solid #C3E0F3;";

        // H2 row (link + optional arrow)
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:4px;";

        const a = document.createElement("a");
        a.href          = "#" + h2.id;
        a.dataset.tocId = h2.id;
        a.dataset.level = "2";
        a.textContent   = h2.textContent.trim();
        a.style.cssText = [
          "flex:1",
          "display:block",
          "padding-bottom:12px",
          "padding-top:12px",
          "font-size:16px",
          "font-weight:700",
          "line-height:1.2",
          "cursor:pointer",
          "color:" + H2_COLOR,
          "transition:color 0.2s",
        ].join(";");
        a.className = "toc-link";
        row.appendChild(a);

        if (hasChildren) {
          const btn = document.createElement("button");
          btn.dataset.group = h2.id;
          btn.setAttribute("aria-expanded", "false");
          btn.innerHTML     = arrowSVG(false);
          btn.style.cssText = [
            "background:none",
            "border:none",
            "padding:0 0 10px 0",
            "cursor:pointer",
            "color:" + H2_COLOR,
            "display:flex",
            "align-items:center",
            "flex-shrink:0",
            "transition:color 0.2s",
          ].join(";");
          btn.className = "toc-arrow-btn";
          row.appendChild(btn);
        }

        groupWrap.appendChild(row);

        // H3 childWrap — collapsed by default, sits INSIDE groupWrap above border
        if (hasChildren) {
          const childWrap = document.createElement("div");
          childWrap.dataset.parentGroup = h2.id;
          childWrap.style.cssText = [
            "overflow:hidden",
            "max-height:0",
            "transition:max-height 0.3s ease",
          ].join(";");

          children.forEach((h3) => {
            const child = document.createElement("a");
            child.href          = "#" + h3.id;
            child.dataset.tocId = h3.id;
            child.dataset.level = "3";
            child.textContent   = h3.textContent.trim();
            child.className     = "toc-link";
            child.style.cssText = [
              "display:block",
              "padding:4px 0 4px 10px",
              "font-size:13px",
              "font-weight:500",
              "line-height:1.35",
              "cursor:pointer",
              "color:" + H3_COLOR,
              "transition:color 0.2s",
            ].join(";");
            childWrap.appendChild(child);
          });

          // small bottom padding inside childWrap so h3s don't stick to border
          const spacer = document.createElement("div");
          spacer.style.height = "6px";
          childWrap.appendChild(spacer);

          groupWrap.appendChild(childWrap);
        }

        navWrap.appendChild(groupWrap);
      }

      /* ── Mobile select ── */
      if (mobileSelect) {
        const opt2 = document.createElement("option");
        opt2.value       = h2.id;
        const l2         = h2.textContent.trim();
        opt2.textContent = l2.length > MAX_OPT_CHARS ? l2.slice(0, MAX_OPT_CHARS - 1) + "…" : l2;
        mobileSelect.appendChild(opt2);

        children.forEach((h3) => {
          const opt3 = document.createElement("option");
          opt3.value       = h3.id;
          const l3         = h3.textContent.trim();
          const t          = l3.length > MAX_OPT_CHARS - 2 ? l3.slice(0, MAX_OPT_CHARS - 3) + "…" : l3;
          opt3.textContent = "— " + t;
          mobileSelect.appendChild(opt3);
        });
      }
    });

    // Arrow toggle — event delegation on navWrap
    if (navWrap) {
      navWrap.addEventListener("click", (e) => {
        const btn = e.target.closest(".toc-arrow-btn");
        if (!btn) return;
        e.stopPropagation();
        toggleGroup(btn.dataset.group, navWrap);
      });
    }
  }

  function toggleGroup(groupId, navWrap, forceOpen) {
    const childWrap = navWrap.querySelector("[data-parent-group='" + groupId + "']");
    const btn       = navWrap.querySelector("[data-group='" + groupId + "']");
    if (!childWrap || !btn) return;

    const isOpen = forceOpen !== undefined ? !forceOpen : btn.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      // collapse
      childWrap.style.maxHeight = "0";
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = arrowSVG(false);
    } else {
      // expand
      childWrap.style.maxHeight = childWrap.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
      btn.innerHTML = arrowSVG(true);
    }
  }

  /* ── ARROW SVG ── */
function arrowSVG(open) {
  return '<svg style="transform:' + (open ? "rotate(180deg)" : "rotate(0deg)") + ';transition:transform 0.25s ease;" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.995807 0H12.1758C12.3736 0.000829231 12.5667 0.0602841 12.7306 0.170847C12.8946 0.28141 13.0222 0.438116 13.0971 0.621148C13.172 0.804181 13.191 1.00532 13.1516 1.19913C13.1122 1.39295 13.0162 1.57073 12.8758 1.71L7.29581 7.29C7.20284 7.38373 7.09224 7.45812 6.97038 7.50889C6.84853 7.55966 6.71782 7.5858 6.58581 7.5858C6.4538 7.5858 6.32309 7.55966 6.20123 7.50889C6.07937 7.45812 5.96877 7.38373 5.87581 7.29L0.295808 1.71C0.155386 1.57073 0.059415 1.39295 0.0200298 1.19913C-0.0193553 1.00532 -0.000386119 0.804181 0.0745395 0.621148C0.149465 0.438116 0.276982 0.28141 0.440965 0.170847C0.604949 0.0602841 0.798035 0.000829231 0.995807 0Z" fill="#92B9D2"/></svg>';
}

  /* ── CUSTOM SELECT ARROW ── */
function injectSelectArrow(select) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:relative;width:100%;";

  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);

  select.style.appearance       = "none";
  select.style.webkitAppearance = "none";
  select.style.backgroundImage  = "none";
  select.style.paddingRight     = "36px";
  select.style.maxWidth         = "100%";
  select.style.width            = "100%";
  select.style.boxSizing        = "border-box";
  select.style.fontSize         = "13px";

  const arrow = document.createElement("span");
  arrow.innerHTML = '<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.995807 0H12.1758C12.3736 0.000829231 12.5667 0.0602841 12.7306 0.170847C12.8946 0.28141 13.0222 0.438116 13.0971 0.621148C13.172 0.804181 13.191 1.00532 13.1516 1.19913C13.1122 1.39295 13.0162 1.57073 12.8758 1.71L7.29581 7.29C7.20284 7.38373 7.09224 7.45812 6.97038 7.50889C6.84853 7.55966 6.71782 7.5858 6.58581 7.5858C6.4538 7.5858 6.32309 7.55966 6.20123 7.50889C6.07937 7.45812 5.96877 7.38373 5.87581 7.29L0.295808 1.71C0.155386 1.57073 0.059415 1.39295 0.0200298 1.19913C-0.0193553 1.00532 -0.000386119 0.804181 0.0745395 0.621148C0.149465 0.438116 0.276982 0.28141 0.440965 0.170847C0.604949 0.0602841 0.798035 0.000829231 0.995807 0Z" fill="#92B9D2"/></svg>';
  arrow.style.cssText = [
    "position:absolute",
    "right:12px",
    "top:50%",
    "transform:translateY(-50%) rotate(0deg)",
    "transition:transform 0.25s ease",
    "pointer-events:none",
    "display:flex",
    "align-items:center",
  ].join(";");

  wrapper.appendChild(arrow);


  let isOpen = false;

  function setArrow(open) {
    isOpen = open;
    arrow.style.transform = open
      ? "translateY(-50%) rotate(180deg)"
      : "translateY(-50%) rotate(0deg)";
  }

  select.addEventListener("click", () => {
    setArrow(!isOpen);
  });

  select.addEventListener("blur", () => {
    setArrow(false);
  });

  select.addEventListener("change", () => {
    setArrow(false);
  });
}
  /* ── PROGRESS BAR ── */
  function initProgressBar(contentWrap, progressBar) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.to(progressBar, {
      width: "100%", ease: "none",
      scrollTrigger: { trigger: contentWrap, start: "top top", end: "bottom 40%", scrub: true },
    });
  }

  /* ── SCROLLSPY ── */
  function initScrollSpy(headings, navWrap, mobileSelect) {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id, navWrap, mobileSelect);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  function setActive(id, navWrap, mobileSelect) {
    if (navWrap) {
      navWrap.querySelectorAll(".toc-link").forEach((link) => {
        const isActive = link.dataset.tocId === id;
        link.classList.toggle(ACTIVE_CLASS, isActive);
        link.style.color = isActive ? ACTIVE_COLOR : (link.dataset.level === "3" ? H3_COLOR : H2_COLOR);
      });

      // Auto-open parent group when an h3 scrolls into view
      const activeLink = navWrap.querySelector(".toc-link[data-toc-id='" + id + "']");
      if (activeLink && activeLink.dataset.level === "3") {
        const childWrap = activeLink.closest("[data-parent-group]");
        if (childWrap) {
          const groupId = childWrap.dataset.parentGroup;
          const btn = navWrap.querySelector("[data-group='" + groupId + "']");
          if (btn && btn.getAttribute("aria-expanded") !== "true") {
            toggleGroup(groupId, navWrap, false); // force open
          }
        }
      }
    }
    if (mobileSelect) mobileSelect.value = id;
  }

  /* ── SCROLL TO ── */
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (typeof lenis !== "undefined" && lenis) {
      lenis.scrollTo(target, { offset: OFFSET, duration: SCROLL_DURATION, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + OFFSET, behavior: "smooth" });
    }
  }

  /* ── CLICK + CHANGE ── */
function bindNavClicks(navWrap) {
    navWrap.addEventListener("click", (e) => {
      const link = e.target.closest(".toc-link");
      if (!link) return;
      e.preventDefault();

      if (link.dataset.level === "2") {
        const groupId   = link.dataset.tocId;
        const childWrap = navWrap.querySelector("[data-parent-group='" + groupId + "']");
        if (childWrap) {
          
          toggleGroup(groupId, navWrap);
          return;
        }
      }

      scrollToSection(link.dataset.tocId);
    });
  }

  function bindSelectChange(mobileSelect) {
    mobileSelect.addEventListener("change", () => scrollToSection(mobileSelect.value));
  }

  /* ── BOOT ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();










// ============================================
// SERVICE CARD ICON ANIMATION
// ============================================
(function () {
  const cards = document.querySelectorAll('.servicecommon-item');
  if (!cards.length) return;

  // CSS inject
  const style = document.createElement('style');
  style.textContent = `
    .comon-service-box-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      will-change: transform;
    }

    .comon-service-box-icon img {
      display: block;
      transition: transform 0.15s ease;
      will-change: transform;
    }

    /* Ripple ring */
    .svc-icon-ring {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1.5px solid rgba(42, 143, 210, 0);
      pointer-events: none;
      transform: scale(0.6);
      transition: none;
    }

    /* Glow dot */
    .svc-icon-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(42,143,210,0.25) 0%, transparent 70%);
      opacity: 0;
      pointer-events: none;
      transform: scale(0.5);
      transition: none;
    }
  `;
  document.head.appendChild(style);

  cards.forEach(card => {
    const iconWrap = card.querySelector('.comon-service-box-icon');
    const img      = iconWrap?.querySelector('img');
    if (!iconWrap || !img) return;

    // Inject ring + glow
    const ring = document.createElement('span');
    ring.className = 'svc-icon-ring';
    const glow = document.createElement('span');
    glow.className = 'svc-icon-glow';
    iconWrap.appendChild(ring);
    iconWrap.appendChild(glow);

    // State
    let rafId  = null;
    let mouseX = 0, mouseY = 0;
    let curX   = 0, curY   = 0;
    let inside = false;

    // Initial clipPath reveal on scroll
    gsap.set(img, { clipPath: 'inset(0 100% 0 0 round 8px)', opacity: 0 });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(img, {
          clipPath: 'inset(0 0% 0 0 round 8px)',
          opacity: 1,
          duration: 0.7,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(img, { clearProps: 'clipPath,opacity' });
          }
        });

        // Ring burst on reveal
        gsap.fromTo(ring,
          { scale: 0.6, opacity: 0, borderColor: 'rgba(42,143,210,0.8)' },
          { scale: 1.6, opacity: 0, borderColor: 'rgba(42,143,210,0)', duration: 0.8, ease: 'power2.out' }
        );
      }
    });

    // Lerp tick
 function tick() {
  if (!inside) return;
  curX += (mouseX - curX) * 0.08;
  curY += (mouseY - curY) * 0.08;

  const rect = iconWrap.getBoundingClientRect();
  const cx   = rect.width  / 2;
  const cy   = rect.height / 2;
  const dx   = curX - cx;
  const dy   = curY - cy;
  const maxR = Math.max(rect.width, rect.height) * 0.7;
  const pull = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / maxR);

  const moveX = (dx / maxR) * 6 * pull;
  const moveY = (dy / maxR) * 6 * pull;

  gsap.set(img, {
    x: moveX,
    y: moveY,
    scale: 1 + pull * 0.08,
    transformOrigin: 'center center',
  });

  rafId = requestAnimationFrame(tick);
}

    card.addEventListener('mousemove', e => {
      const rect = iconWrap.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;


if (!inside) {
  inside = true;
  curX = mouseX;
  curY = mouseY;
  rafId = requestAnimationFrame(tick);

  // Glow in
  gsap.to(glow, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });

  // Smooth bounce — iconWrap এ
  gsap.killTweensOf(iconWrap);
  gsap.timeline()
    .to(iconWrap, { y: -10, duration: 0.25, ease: 'power2.out' })
    .to(iconWrap, { y: 2,   duration: 0.2,  ease: 'power1.inOut' })
    .to(iconWrap, { y: -4,  duration: 0.15, ease: 'power1.inOut' })
    .to(iconWrap, { y: 0,   duration: 0.4,  ease: 'power2.out' });

  // Ring — force visible
  gsap.set(ring, { scale: 0.8, opacity: 1, borderColor: 'rgba(42,143,210,0.9)', borderWidth: '2px' });
  gsap.to(ring, {
    scale: 1.6,
    opacity: 0,
    duration: 1.8,
    ease: 'power1.out',
    borderColor: 'rgba(42,143,210,0)',
  });
}
    });

card.addEventListener('mouseleave', () => {
  inside = false;
  cancelAnimationFrame(rafId);

  gsap.killTweensOf(iconWrap); 
  gsap.to(iconWrap, { y: 0, duration: 0.3, ease: 'power2.out' }); 

  gsap.to(img, {
    x: 0, y: 0,
    rotateX: 0, rotateY: 0,
    scale: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.55)',
  });

  gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.4, ease: 'power2.in' });
});
  });
})();