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
// NAV LERP SYSTEM — এখানে add করো
// ============================================
const mainNav = document.getElementById('mainNav');
const navInner = mainNav.querySelector('.nav-inner');
const navLogo = mainNav.querySelector('.nav-logo img');

// Initial background inline set — CSS override হবে না
mainNav.style.background = 'rgba(0, 36, 59, 1)';
mainNav.style.backdropFilter = 'blur(0px) saturate(160%)';
mainNav.style.webkitBackdropFilter = 'blur(0px) saturate(160%)';

const isMobileNav = () => window.innerWidth < 768;
const NAV_H_DESKTOP = { max: 92, min: 58 };
const NAV_H_MOBILE  = { max: 56, min: 44 };

let currentH     = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
let targetH      = currentH;
let currentBlur  = 0;
let targetBlur   = 0;
let currentAlpha = 1;
let targetAlpha  = 1;
let lastScroll   = 0;
let velocity     = 0;

function lerpFn(a, b, t) { return a + (b - a) * t; }
function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

function navTick() {
  currentH     = lerpFn(currentH,     targetH,     0.08);
  currentBlur  = lerpFn(currentBlur,  targetBlur,  0.06);
  currentAlpha = lerpFn(currentAlpha, targetAlpha, 0.06);

  navInner.style.height = currentH.toFixed(2) + 'px';
  mainNav.style.background = `rgba(0, 36, 59, ${currentAlpha.toFixed(3)})`;
  mainNav.style.backdropFilter = `blur(${currentBlur.toFixed(2)}px) saturate(160%)`;
  mainNav.style.webkitBackdropFilter = `blur(${currentBlur.toFixed(2)}px) saturate(160%)`;

  const shadowAlpha = clamp(currentBlur / 20, 0, 0.4);
  mainNav.style.boxShadow = `0 1px 0 rgba(255,255,255,${(shadowAlpha * 0.15).toFixed(3)}) inset, 0 8px 32px rgba(0,0,0,${shadowAlpha.toFixed(3)})`;
  mainNav.style.setProperty('--border-op', clamp(currentBlur / 20, 0, 1).toFixed(3));

  requestAnimationFrame(navTick);
}
navTick();

// ============================================
// LENIS SCROLL
// ============================================
lenis.on('scroll', ({ scroll }) => {
  ScrollTrigger.update();

  const mobile = isMobileNav();
  const h = mobile ? NAV_H_MOBILE : NAV_H_DESKTOP;

  if (scroll < 80) {
    targetH     = h.max;
    targetBlur  = 0;
    targetAlpha = 1;
  } else {
    targetH     = h.min;
    targetBlur  = 16;
    targetAlpha = 0.6;
  }
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



// ============================================
// MOBILE MENU & NAVBAR
// ============================================
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

  // ── Rain drops (শুধু banner-এ যেখানে .rain-drop আছে) ──
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

  // ── Magnetic Glow — সব [data-glow-section] এ চলবে ──
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

   
 
    const wrapper = document.getElementById('brandWrapper');
    const items   = wrapper.querySelectorAll('.partner-item');
    const isMobile = () => window.innerWidth < 992;
 
    if (!isMobile()) {
      // Desktop: clip-path inset animation
      // from: inset(0px 0px 0px 0px round 0px)  → full width, sharp corners
      // to:   inset(0px 20px 0px 20px round 9999px) → pill with 20px side margin
 
      gsap.fromTo(wrapper,
        { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
        {
          clipPath: 'inset(0px 20px 0px 20px round 9999px)',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            end:   'top 20%',
            scrub: 2,
          }
        }
      );
    }
 
    // Items stagger — both mobile & desktop
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
 
    window.addEventListener('resize', () => ScrollTrigger.refresh());



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





// ── Proven Results — Scroll Reveal + Magnetic + Shimmer ──
gsap.utils.toArray(".proven-result-wrap").forEach((card, i) => {

  // ── গোলাপি glow spot তৈরি করো
  const glow = document.createElement("div");
  glow.classList.add("proven-glow");
  card.appendChild(glow);

  const content    = card.querySelector(".proven-result-content");
  const contentTop = content.querySelector("div:first-child");
  const cta        = content.querySelector("a");
  const image      = card.querySelector(".resultproven-image");
  const imgEl      = image.querySelector("img");
  const stats      = card.querySelectorAll("h4");
  const badge      = card.querySelector(".proven-result-content .flex");

  // ── 1. SCROLL REVEAL ──
  // badge — বাম থেকে আসে
  gsap.fromTo(badge,
    { x: -40, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 80%", once: true }
    }
  );

  // heading + para — নিচ থেকে stagger
  gsap.fromTo(contentTop.querySelectorAll("h3, p"),
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 75%", once: true }
    }
  );

  // stats — scale bounce
  gsap.fromTo(stats,
    { scale: 0.5, opacity: 0, y: 20 },
    {
      scale: 1, opacity: 1, y: 0,
      duration: 0.6, stagger: 0.1, ease: "back.out(1.8)",
      scrollTrigger: { trigger: card, start: "top 70%", once: true }
    }
  );

  // cta — নিচ থেকে
  gsap.fromTo(cta,
    { y: 30, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 65%", once: true }
    }
  );

  // image — clip-path reveal (ডান থেকে উন্মোচন)
  gsap.fromTo(imgEl,
    { clipPath: "inset(0 100% 0 0 round 16px)", scale: 1.08 },
    {
      clipPath: "inset(0 0% 0 0 round 16px)", scale: 1,
      duration: 1.1, ease: "power4.inOut",
      scrollTrigger: { trigger: card, start: "top 78%", once: true }
    }
  );

  // shimmer — reveal হওয়ার পর একবার চলে
  ScrollTrigger.create({
    trigger: card,
    start: "top 78%",
    scroller: document.body,
    once: true,
    onEnter: () => {
      gsap.to(card, {
        "--shimmer": "100%",
        duration: 0,
        onComplete: () => {
          gsap.fromTo(card.querySelector("::before") || card,
            {},
            {}
          );
          // shimmer via pseudo — GSAP দিয়ে class টগল
          setTimeout(() => {
            card.style.setProperty("--sh", "1");
            gsap.fromTo({ v: 0 }, { v: 1 }, {
              duration: 0.8,
              ease: "power2.inOut",
              delay: 0.6,
              onUpdate: function() {
                const x = gsap.utils.mapRange(0, 1, -100, 100, this.targets()[0].v);
                card.style.setProperty("background-image",
                  `radial-gradient(50% 50% at 50% 50%,#FFF 0%,#F4FBFF 33%,#EDF8FF 66%,#DEF2FF 100%),
                   linear-gradient(105deg, transparent 40%, rgba(255,255,255,${0.5 - Math.abs(this.targets()[0].v - 0.5) * 0.5}) 50%, transparent 60%)`
                );
              }
            });
          }, 100);
        }
      });
    }
  });

  // ── 2. MAGNETIC MOUSE INTERACTION ──
  let isInside = false;
  let rafId;
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let tiltX = 0, tiltY = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function magneticTick() {
    if (!isInside) return;

    const rect = card.getBoundingClientRect();
    const relX = mouseX - rect.left;
    const relY = mouseY - rect.top;

    // glow follows cursor — smooth lag
    glowX = lerp(glowX, relX, 0.1);
    glowY = lerp(glowY, relY, 0.1);
    glow.style.left = glowX + "px";
    glow.style.top  = glowY + "px";

    // subtle card tilt
    const cx   = rect.width / 2;
    const cy   = rect.height / 2;
    const dx   = (relX - cx) / cx; // -1 to 1
    const dy   = (relY - cy) / cy;
    tiltX = lerp(tiltX, dy * -3, 0.08); // rotateX
    tiltY = lerp(tiltY, dx * 3, 0.08);  // rotateY

    gsap.set(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
    });

    gsap.set(imgEl, {
      x: dx * 3,
      y: dy * 1,
    });

    rafId = requestAnimationFrame(magneticTick);
  }

  card.addEventListener("mouseenter", () => {
    isInside = true;
    glow.style.opacity = "1";
    cancelAnimationFrame(rafId);
    magneticTick();
  });

  card.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  card.addEventListener("mouseleave", () => {
    isInside = false;
    glow.style.opacity = "0";
    cancelAnimationFrame(rafId);

    // reset smoothly
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      duration: 0.6, ease: "power2.out"
    });
    gsap.to(imgEl, {
      x: 0, y: 0,
      duration: 0.6, ease: "power2.out"
    });
    tiltX = 0; tiltY = 0;
  });

  // ── 3. STAT COUNTER — scroll এ number count up ──
  stats.forEach((stat) => {
    const original = stat.textContent.trim();
    const num      = parseFloat(original.replace(/[^0-9.]/g, ""));
    const suffix   = original.replace(/[0-9.,]/g, "");
    if (isNaN(num)) return;

    ScrollTrigger.create({
      trigger: card,
      start: "top 70%",
      scroller: document.body,
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: num }, {
          duration: 1.5,
          ease: "power2.out",
          onUpdate: function() {
            const v = this.targets()[0].val;
            stat.textContent = (num % 1 === 0
              ? Math.round(v).toLocaleString()
              : v.toFixed(1)) + suffix;
          },
          onComplete: () => {
            stat.textContent = original;
          }
        });
      }
    });
  });

});







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