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
  const navInner    = mainNav.querySelector('.nav-inner');
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
// MOBILE MENU & NAVBAR
// ============================================
const hamburger             = document.getElementById('hamburger');
const mobileMenu            = document.getElementById('mobileMenu');
const mobileServicesBtn     = document.getElementById('mobileServicesBtn');
const mobileServicesSubmenu = document.getElementById('mobileServicesSubmenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

if (mobileServicesBtn && mobileServicesSubmenu) {
  mobileServicesBtn.addEventListener('click', () => {
    const isOpen = mobileServicesSubmenu.classList.toggle('open');
    mobileServicesBtn.classList.toggle('open', isOpen);
  });
}


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
    
    if (select.value === '') {
        select.style.color = '#92B9D2';
    }

    select.addEventListener('change', function () {
        if (this.value === '') {
            this.style.color = '#92B9D2';
        } else {
            this.style.color = '#ffffff';
        }
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

  function placeArrow() {
    var len = path.getTotalLength();
    var p1  = path.getPointAtLength(len - 4);
    var p2  = path.getPointAtLength(len);

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

  var svg = document.getElementById('main-svg');

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          placeArrow();

          var sigLine  = document.getElementById('sig-line');
          var sigArrow = document.getElementById('sig-arrow');

          sigLine.classList.add('go');
          sigArrow.classList.add('go');

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



//icon global animaiton
// সব anim-icon group করো তাদের parent grid অনুযায়ী
const iconGroups = new Map();

document.querySelectorAll('.anim-icon').forEach((icon) => {
    const img = icon.querySelector('img, svg');
    if (!img) return;

    // initial state সেট করো
    gsap.set(img, {
        scale: 0,
        rotate: -15,
        opacity: 0,
        transformOrigin: 'center center',
    });

    // parent grid/container খোঁজো
    const parent = icon.closest('.grid, [class*="grid"]') || icon.parentElement;

    if (!iconGroups.has(parent)) {
        iconGroups.set(parent, []);
    }
    iconGroups.get(parent).push({ icon, img });
});

// প্রতিটা group-এর জন্য একটাই ScrollTrigger
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
            stagger: 0.12, // ← একটার পর একটা
        });
    };

    const animateOut = () => {
        gsap.to(imgs, {
            scale: 0,
            rotate: -15,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            stagger: 0, // reset একসাথে
        });
    };

    ScrollTrigger.create({
        trigger: parent,   // ← পুরো grid একটা trigger
        start: 'top 85%',
        end: 'bottom 15%',
        once: false,
        onEnter:      animateIn,
        onEnterBack:  animateIn,
        onLeave:      animateOut,
        onLeaveBack:  animateOut,
    });

    // Magnetic hover — আলাদাভাবে প্রতিটা icon-এ
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