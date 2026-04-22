gsap.registerPlugin(ScrollTrigger);
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
  const banner = document.querySelector(".banner");
  const glow = document.getElementById("bannerGlow");
  const drops = document.querySelectorAll(".rain-drop");

  // ─── SATELLITE GLOW (magnetic cursor follower) ───
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
  banner.style.position = "relative";
  banner.insertBefore(sat, banner.firstChild);

  // ─── RAIN DROPS — slow & smooth ───
  drops.forEach((drop, i) => {
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
        y: "200%",
        duration: duration,
        ease: "none",
        onStart: function() {
          // fade in at top
          gsap.to(drop, { opacity: 1, duration: 0.3, ease: "power1.out" });
          
          // fade out near bottom — scheduled separately
          gsap.to(drop, {
            opacity: 0,
            duration: duration * 0.28,
            delay: duration * 0.72,
            ease: "power1.in",
            overwrite: false
          });
        },
        onComplete: () => {
          gsap.set(drop, { opacity: 0, y: "-100%" });
          setTimeout(() => rainLoop(drop), nextDelay * 1000);
        }
      }
    );
  }

  // ─── MAGNETIC GLOW SYSTEM ───
  const HOME_X = 70, HOME_Y = 50;
  const MAGNETIC_RADIUS = 0.38;

  let mouseInside = false;
  let curX = HOME_X, curY = HOME_Y;
  let satX = 0, satY = 0;
  let targetSatX = 0, targetSatY = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  // initial glow fade-in
  gsap.to(glow, { opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 0.3 });

  banner.addEventListener("mousemove", (e) => {
    mouseInside = true;
    sat.style.opacity = "0.85";

    const rect = banner.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;

    targetSatX = e.clientX - rect.left;
    targetSatY = e.clientY - rect.top;

    const dist = Math.sqrt((mx - HOME_X/100)**2 + (my - HOME_Y/100)**2);

    if (dist < MAGNETIC_RADIUS) {
      const pull = 1 - dist / MAGNETIC_RADIUS;
      curX = lerp(curX, HOME_X + (mx*100 - HOME_X) * 0.18 * (1 - pull), 0.07);
      curY = lerp(curY, HOME_Y + (my*100 - HOME_Y) * 0.18 * (1 - pull), 0.07);
    } else {
      curX = lerp(curX, HOME_X + (mx*100 - HOME_X) * 0.32, 0.06);
      curY = lerp(curY, HOME_Y + (my*100 - HOME_Y) * 0.32, 0.06);
    }
  });

  banner.addEventListener("mouseleave", () => {
    mouseInside = false;
    gsap.to(sat, { opacity: 0, duration: 0.6, ease: "power2.out" });
  });

  function tick() {
    const rect = banner.getBoundingClientRect();

    if (mouseInside) {
      satX = lerp(satX, targetSatX, 0.09);
      satY = lerp(satY, targetSatY, 0.09);

      const mainPxX = (curX / 100) * rect.width;
      const mainPxY = (curY / 100) * rect.height;
      const dPx = Math.sqrt((satX - mainPxX)**2 + (satY - mainPxY)**2);
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
  }

  tick();
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

//radius

const gcSection = document.querySelector('.game-changer');
const gcWrapper = document.querySelector('.game-changer-wrapper');

// শুরুতে center এ ছোট circle
gsap.set(gcSection, {
    clipPath: 'circle(160px at 50% 50%)',
});

const gcTl = gsap.timeline({ paused: true });
gcTl.to(gcSection, {
    clipPath: 'circle(150% at 50% 50%)',  
    ease: 'none',
    duration: 1
});

ScrollTrigger.create({
    trigger: gcWrapper,
    start: 'center center',
    end: '+=1000',
    pin: gcSection,
    pinSpacing: true,
    scrub: 2.5,
    anticipatePin: 1,
    onUpdate: (self) => gcTl.progress(self.progress)
});



//smooth scroll

// Initialize Lenis
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

ScrollTrigger.refresh();



