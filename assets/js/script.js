gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.3,
  infinite: false,
});

// ============================================
// NAV LERP SYSTEM
// ============================================
const mainNav = document.getElementById('mainNav');
const navInner = mainNav.querySelector('.nav-inner');
const navLogo = mainNav.querySelector('.nav-logo img');

mainNav.style.background = 'rgba(0, 36, 59, 1)';

const isMobileNav = () => window.innerWidth < 768;
const NAV_H_DESKTOP = { max: 92, min: 58 };
const NAV_H_MOBILE  = { max: 56, min: 44 };

let currentH = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
let targetH  = currentH;

function lerpFn(a, b, t) { return a + (b - a) * t; }

function navTick() {
  currentH = lerpFn(currentH, targetH, 0.08);
  navInner.style.height = currentH.toFixed(2) + 'px';
  requestAnimationFrame(navTick);
}
navTick();



// LENIS SCROLL
lenis.on('scroll', ({ scroll }) => {
  ScrollTrigger.update();

  const mobile = isMobileNav();
  const h = mobile ? NAV_H_MOBILE : NAV_H_DESKTOP;

  targetH = scroll < 80 ? h.max : h.min;
});

window.addEventListener('resize', () => {
  currentH = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
  targetH  = currentH;
});

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


// MOBILE MENU & NAVBAR
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileServicesBtn = document.getElementById('mobileServicesBtn');
  const mobileServicesSubmenu = document.getElementById('mobileServicesSubmenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileServicesBtn.addEventListener('click', () => {
    const isOpen = mobileServicesSubmenu.classList.toggle('open');
    mobileServicesBtn.classList.toggle('open', isOpen);
  });




  //banner section js
document.addEventListener("DOMContentLoaded", () => {

  function lerp(a, b, t) { return a + (b - a) * t; }

  document.querySelectorAll(".rain-drop").forEach((drop, i) => {
    gsap.set(drop, {
      y: "-100%", opacity: 0,
      background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)",
    });
    setTimeout(() => rainLoop(drop), i * 600 + Math.random() * 1500);
  });

  function rainLoop(drop) {
    const duration = 3.2 + Math.random() * 1.6;
    const nextDelay = 1.0 + Math.random() * 1.4;
    gsap.fromTo(drop,
      { y: "-100%", opacity: 0 },
      {
        y: "200%", duration: duration, ease: "none",
        onStart() {
          gsap.to(drop, { opacity: 1, duration: 0.3, ease: "power1.out" });
          gsap.to(drop, { opacity: 0, duration: duration * 0.28, delay: duration * 0.72, ease: "power1.in", overwrite: false });
        },
        onComplete() {
          gsap.set(drop, { opacity: 0, y: "-100%" });
          setTimeout(() => rainLoop(drop), nextDelay * 1000);
        }
      }
    );
  }

  // ── Magnetic Glow — 
  document.querySelectorAll("[data-glow-section]").forEach(section => {
    const glow = section.querySelector("[data-glow-el]");
    if (!glow) return;

    const HOME_X = parseFloat(section.dataset.homeX ?? 70);
    const HOME_Y = parseFloat(section.dataset.homeY ?? 50);
    const MAGNETIC_RADIUS = 0.38;

    let curX = HOME_X, curY = HOME_Y;
    let mouseInside = false;
    let satX = 0, satY = 0, targetSatX = 0, targetSatY = 0;

    // Satellite cursor blob
    const sat = document.createElement("div");
    sat.style.cssText = `
      position: absolute; pointer-events: none; z-index: 1;
      width: 220px; height: 220px; border-radius: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(7,106,171,0.55) 0%, rgba(7,106,171,0.15) 40%, transparent 70%);
      filter: blur(18px);
      opacity: 0; transition: opacity 0.3s ease;
      left: 0; top: 0;
    `;
    section.insertBefore(sat, section.firstChild);

    // Initial glow fade in
    gsap.to(glow, { opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 0.3 });

    section.addEventListener("mousemove", (e) => {
      mouseInside = true;
      sat.style.opacity = "0.85";
      const rect = section.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
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

    section.addEventListener("mouseleave", () => {
      mouseInside = false;
      gsap.to(sat, { opacity: 0, duration: 0.6, ease: "power2.out" });
    });

    (function tick() {
      const rect = section.getBoundingClientRect();
      if (mouseInside) {
        satX = lerp(satX, targetSatX, 0.09);
        satY = lerp(satY, targetSatY, 0.09);
        const dPx = Math.sqrt((satX - (curX / 100) * rect.width) ** 2 + (satY - (curY / 100) * rect.height) ** 2);
        const threshold = rect.width * MAGNETIC_RADIUS * 0.5;
        if (dPx < threshold) {
          const fade = dPx / threshold;
          sat.style.opacity = (fade * 0.85).toFixed(3);
          const size = 160 + (1 - fade) * 60;
          sat.style.width = sat.style.height = size + "px";
        } else {
          sat.style.opacity = "0.85";
          sat.style.width = sat.style.height = "220px";
        }
        sat.style.left = satX + "px";
        sat.style.top = satY + "px";
      } else {
        curX = lerp(curX, HOME_X, 0.04);
        curY = lerp(curY, HOME_Y, 0.04);
      }
      glow.style.background = `radial-gradient(40% 55% at ${curX.toFixed(2)}% ${curY.toFixed(2)}%, #076AAB 0%, transparent 100%)`;
      requestAnimationFrame(tick);
    })();
  });

});

// partner section js

   
 

    //why needed card

       document.querySelectorAll('.why-outer').forEach(card => {
      const img = card.querySelector('.why-card-img img');
      let isAnimating = false;
 
      card.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        isAnimating = true;
 
        // River wave — S-curve path
        // skewX দিয়ে liquid body bend হয়
        // y দিয়ে wave height travel করে
        // একবার মাত্র — নদীর ঢেউ এর মতো
        gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          }
        })
          // ── crest 1: বাম কাত হয়ে উপরে ওঠে (ঢেউ শুরু)
          .to(img, {
            y: -14,
            skewX: -6,
            scaleX: 1.04,
            duration: 0.22,
            ease: 'power2.out',
          })
          // ── trough: ডান কাত হয়ে নিচে আসে (ঢেউ মাঝে)
          .to(img, {
            y: 8,
            skewX: 5,
            scaleX: 0.98,
            duration: 0.28,
            ease: 'sine.inOut',
          })
          // ── crest 2: আবার বাম কাত হয়ে উপরে (ঢেউ শেষ হচ্ছে)
          .to(img, {
            y: -6,
            skewX: -3,
            scaleX: 1.02,
            duration: 0.22,
            ease: 'sine.inOut',
          })
          // ── settle: সব শেষে smooth এ flat হয়ে যায়
          .to(img, {
            y: 0,
            skewX: 0,
            scaleX: 1,
            duration: 0.35,
            ease: 'elastic.out(1, 0.6)',
          });
      });
 
      // mouse leave এ যদি mid-animation থাকে তাহলে gracefully reset
      card.addEventListener('mouseleave', () => {
        if (!isAnimating) return;
        gsap.to(img, {
          y: 0,
          skewX: 0,
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
          onComplete: () => { isAnimating = false; }
        });
      });
    });





    // ─────────────────────────────────────────
// GSAP: Niche Card Icon — Scroll Reveal + Magnetic Hover
// Dependencies: gsap, ScrollTrigger
// ─────────────────────────────────────────
 
// ─────────────────────────────────────────
// GSAP: Niche Card — Image Clip-path Reveal + Icon Scroll + Magnetic Hover
// Dependencies: gsap, ScrollTrigger
// ─────────────────────────────────────────


gsap.utils.toArray(".niche-item").forEach((card) => {
  const img      = card.querySelector(".niche-item-image img");
  const iconWrap = card.querySelector(".niche-item-image > div"); // w-24 h-24 div

  // ── 1. IMAGE — clip-path left→right reveal on scroll ──
  gsap.fromTo(img,
    { clipPath: "inset(0 100% 0 0 round 24px)" },
    {
      clipPath: "inset(0 0% 0 0 round 24px)",
      duration: 1,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        once: true,
      },
    }
  );

  // ── 2. ICON — drops in slightly after image reveal ──
  gsap.set(iconWrap, { y: -16, opacity: 0, scale: 0.8 });

  ScrollTrigger.create({
    trigger: card,
    start: "top 85%",
    scroller: document.body,
    once: true,
    onEnter: () => {
      gsap.to(iconWrap, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        delay: 0.5, // waits for image reveal to mostly finish
        ease: "back.out(1.7)",
      });
    },
  });

  // ── 3. MAGNETIC HOVER on icon ──
  card.addEventListener("mousemove", (e) => {
    const rect   = iconWrap.getBoundingClientRect();
    const iconCX = rect.left + rect.width / 2;
    const iconCY = rect.top + rect.height / 2;
    const dx     = e.clientX - iconCX;
    const dy     = e.clientY - iconCY;
    const dist   = Math.sqrt(dx * dx + dy * dy);
    const radius = 130;

    if (dist < radius) {
      const pull  = (1 - dist / radius) * 16;
      const angle = Math.atan2(dy, dx);
      gsap.to(iconWrap, {
        x: Math.cos(angle) * pull,
        y: Math.sin(angle) * pull,
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(iconWrap, { x: 0, y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
    }
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(iconWrap, {
      x: 0, y: 0, scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  });
});









//Our Focus Niches bottom part hide show on scroll

// ScrollTrigger.create({
//   trigger: ".focused-niches",
//   start: "top bottom",   
//   end: "bottom bottom",  
//   onEnter: () => {
//     gsap.to(".niche-bottom", {
//       y: "0%",
//       duration: 0.4,
//       ease: "power2.inOut",
//     });
//   },
//   onLeave: () => {
//     gsap.to(".niche-bottom", {
//       y: "100%",
//       duration: 0.4,
//       ease: "power2.inOut",
//     });
//   },
//   onEnterBack: () => {
//     gsap.to(".niche-bottom", {
//       y: "0%",
//       duration: 0.4,
//       ease: "power2.inOut",
//     });
//   },
//   onLeaveBack: () => {
//     gsap.to(".niche-bottom", {
//       y: "100%",
//       duration: 0.4,
//       ease: "power2.inOut",
//     });
//   },
// });



// ============================================
// GAME CHANGER — window.load এ রাখো, DOMContentLoaded এ না
// ============================================
window.addEventListener('load', () => {

  const gcSection = document.querySelector('.game-changer');
  const gcWrapper = document.querySelector('.game-changer-wrapper');

  if (!gcSection || !gcWrapper) return;

  // শুরুতে center এ ছোট circle
  gsap.set(gcSection, {
    clipPath: 'circle(160px at 50% 50%)',
  });

  const gcTl = gsap.timeline({ paused: true });
  gcTl.to(gcSection, {
    clipPath: 'circle(150% at 50% 50%)',
    ease: 'none',
    duration: 1,
  });

  ScrollTrigger.create({
    trigger: gcWrapper,
    scroller: document.body,       // ← Lenis এর জন্য জরুরি
    start: 'center center',
    end: '+=1000',
    pin: gcSection,
    pinSpacing: true,
    scrub: 2.5,
    anticipatePin: 0,              // ← Lenis এর সাথে 0 রাখো
    invalidateOnRefresh: true,     // ← resize/refresh এ recalculate করবে
    onUpdate: (self) => gcTl.progress(self.progress),
  });

  // সব ScrollTrigger এ একবার refresh দাও সব কিছু লোড হওয়ার পর
  ScrollTrigger.refresh();
});



//proven result 

// ============================================
// PROVEN RESULTS — MAGNETIC BOUNCE STACK
// ============================================
(function initProvenStack() {

    const cards = gsap.utils.toArray('.proven-result-wrap');
    if (cards.length === 0) return;

    // ── DYNAMIC TOP OFFSET — যতগুলো card হোক কাজ করবে
    const BASE_TOP = 160;
    const STEP = 60; // প্রতিটা card এর মধ্যে gap

    cards.forEach((card, i) => {
        card.style.top = (BASE_TOP + i * STEP) + 'px';
    });

    // বাকি সব আগের মতোই...
    gsap.set(cards, {
        y: 60,
        opacity: 0,
        scale: 0.97,
        transformOrigin: 'top center',
        transformPerspective: 1200,
    });

    cards.forEach((card, i) => {

        gsap.to(card, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.3)',
            scrollTrigger: {
                trigger: card,
                scroller: document.body,
                start: 'top 85%',
                once: true,
            },
            delay: i * 0.06,
        });

        gsap.fromTo(card,
            { rotateX: 0 },
            {
                rotateX: 3,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    scroller: document.body,
                    start: 'top 60%',
                    end: 'bottom 20%',
                    scrub: 1.5,
                },
            }
        );

        if (i > 0) {
            ScrollTrigger.create({
                trigger: card,
                scroller: document.body,
                start: 'top 60%',
                once: true,
                onEnter: () => {
                    cards.slice(0, i).forEach((prev, j) => {
                        const stepsBack = i - j;
                        gsap.to(prev, {
                            scale: 1 - stepsBack * 0.03,
                            duration: 0.5,
                            ease: 'power2.inOut',
                        });
                    });
                }
            });
        }

        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                scale: 1.008,
                duration: 0.4,
                ease: 'power2.out',
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.6)',
            });
        });

    });

})();


// ============================================
// VIDEO SLIDER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const videoSliderElement = document.getElementById('video-slider');
    
    if (!videoSliderElement || typeof Splide === 'undefined') return;

    const splide = new Splide('#video-slider', {
        type: 'loop',
        drag: 'free',
        focus: 'center',
        perPage: 5,
         gap: '12px',
        arrows: false,
        pagination: false,
        // autoScroll:false,
        autoScroll: {
            speed: 1, 
            pauseOnHover: true,
            pauseOnFocus: true,
        },
        breakpoints: {
            1536: { perPage: 5 },
            1280: { perPage: 4 },
            1024: { perPage: 3 , gap: '10px',},
            768: { perPage: 2.5 },
            640: { perPage: 1.5, gap: '8px', }
        }
    });

    if (window.splide && window.splide.Extensions) {
        splide.mount(window.splide.Extensions);
    } else {
        splide.mount();
    }

    const videoCards = document.querySelectorAll('.video-card');

    if (videoCards.length > 0) {
        videoCards.forEach(card => {
            const video = card.querySelector('.video-element');
            if (!video) return;
            
            let isPlaying = false;

            card.addEventListener('mouseenter', function() {
                if (!isPlaying) {
                    video.currentTime = 0;
                    video.play().catch(err => console.log('Video play error:', err));
                    isPlaying = true;
                }
            });

            card.addEventListener('mouseleave', function() {
                if (isPlaying) {
                    video.pause();
                    video.currentTime = 0;
                    isPlaying = false;
                }
            });

            video.addEventListener('ended', function() {
                if (isPlaying) {
                    video.currentTime = 0;
                    video.play();
                }
            });
        });

        splide.on('move', function() {
            videoCards.forEach(card => {
                const video = card.querySelector('.video-element');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        });
    }
});





// ========== CONTENT TESTIMONIAL SLIDER ==========
function initContentTestimonialSlider() {
    if (!document.getElementById('testimonialSlider')) return;
    
    const arrowSVG = `
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.1716 6.77822L6.8076 1.41421L8.2218 0L16 7.77822L8.2218 15.5563L6.8076 14.1421L12.1716 8.77822H0V6.77822H12.1716Z" />
</svg>

    `;

    const testimonialSplide = new Splide('#testimonialSlider', {
        type: 'loop',
        perPage: 2,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        arrows: true,
        pagination: false,
        breakpoints: {
            1024: { perPage: 1, gap: '1.5rem' }
        }
    });
    
    testimonialSplide.mount();

    // Setup custom arrows for testimonial
    const testimonialWrapper = document.getElementById('testimonialSlider').closest('.content-our-testimonial');
    if (testimonialWrapper) {
        const originalArrows = testimonialWrapper.querySelector('.splide__arrows');
        const testimonialArrowsDesktop = testimonialWrapper.querySelector('.testimonial-real-content-slider-arrows-desktop');
        const testimonialArrowsMobile = testimonialWrapper.querySelector('.testimonial-real-content-slider-arrows-mobile');

        if (originalArrows && testimonialArrowsDesktop && testimonialArrowsMobile) {
            testimonialArrowsDesktop.innerHTML = originalArrows.innerHTML;
            testimonialArrowsMobile.innerHTML = originalArrows.innerHTML;

            // Replace arrows
            function replaceTestimonialArrows(container) {
                const arrows = container.querySelectorAll('.splide__arrow');
                arrows.forEach(arrow => {
                    arrow.innerHTML = arrowSVG;
                });
            }

            replaceTestimonialArrows(testimonialArrowsDesktop);
            replaceTestimonialArrows(testimonialArrowsMobile);

            // Setup listeners
            [testimonialArrowsDesktop, testimonialArrowsMobile].forEach(container => {
                const prevBtn = container.querySelector('.splide__arrow--prev');
                const nextBtn = container.querySelector('.splide__arrow--next');

                if (prevBtn) prevBtn.addEventListener('click', () => testimonialSplide.go('<'));
                if (nextBtn) nextBtn.addEventListener('click', () => testimonialSplide.go('>'));
            });

            originalArrows.style.display = 'none';
        }
    }
}

initContentTestimonialSlider();





//faq

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const border = item.querySelector('.faq-border');
        const iconClose = item.querySelector('.icon-close'); // + icon
        const iconOpen = item.querySelector('.icon-open');   // − icon

        if (!trigger) return;

        trigger.addEventListener('click', function () {
            const isOpen = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const oc = otherItem.querySelector('.faq-content');
                    const ob = otherItem.querySelector('.faq-border');
                    const oClose = otherItem.querySelector('.icon-close');
                    const oOpen = otherItem.querySelector('.icon-open');
                    if (oc) oc.style.maxHeight = '0';
                    if (ob) ob.classList.add('hidden');
                    if (oClose) oClose.classList.remove('hidden');
                    if (oOpen) oOpen.classList.add('hidden');
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('active');
                if (content) content.style.maxHeight = '0';
                if (border) border.classList.add('hidden');
                if (iconClose) iconClose.classList.remove('hidden');
                if (iconOpen) iconOpen.classList.add('hidden');
            } else {
                item.classList.add('active');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
                if (border) border.classList.remove('hidden');
                if (iconClose) iconClose.classList.add('hidden');
                if (iconOpen) iconOpen.classList.remove('hidden');
            }
        });
    });
}


function initFAQGrid() {
    const wrap = document.getElementById('faqGridWrap');
    if (!wrap) return;

    const items = Array.from(wrap.querySelectorAll('.faq-item'));
    if (items.length === 0) return;

    // Create 2 column divs
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');
    leftCol.className = 'flex flex-col gap-0 w-full md:w-1/2';
    rightCol.className = 'flex flex-col gap-0 w-full md:w-1/2';

    // Distribute items: odd → left, even → right
    items.forEach((item, index) => {
        if (index % 2 === 0) {
            leftCol.appendChild(item);
        } else {
            rightCol.appendChild(item);
        }
    });

    // Replace wrap content with 2 columns
    wrap.innerHTML = '';
    wrap.className = 'flex flex-col md:flex-row gap-8 items-start';
    wrap.appendChild(leftCol);
    wrap.appendChild(rightCol);
}

document.addEventListener('DOMContentLoaded', function () {
    initFAQGrid(); 
    initFAQ();    
});





// partner slider


document.addEventListener('DOMContentLoaded', function() {

    // ========== PARTNER SLIDER ==========
    const partnerSliderElement = document.getElementById('partner-slider');

    if (partnerSliderElement && typeof Splide !== 'undefined') {

        const partnerSplide = new Splide('#partner-slider', {
            type: 'loop',
            drag: 'free',
            focus: 'center',
            perPage: 6,
            gap: '0px',
            arrows: false,
            pagination: false,
            autoScroll: {
                speed: 1,
                pauseOnHover: true,
                pauseOnFocus: false,
            },
            breakpoints: {
                1280: { perPage: 5 },
                1024: { perPage: 4 },
                768:  { perPage: 3 },
                640:  { perPage: 2,gap: '8px', },
            }
        });

        if (window.splide && window.splide.Extensions) {
            partnerSplide.mount(window.splide.Extensions);
        } else {
            partnerSplide.mount();
        }
    }

});

// ============================================
// BRAND / PARTNER SLIDER
// ============================================
