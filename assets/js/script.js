
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
// Banner Animation
document.addEventListener("DOMContentLoaded", () => {

  const banner = document.querySelector(".banner");
  const glow = document.getElementById("bannerGlow");
  const drops = document.querySelectorAll(".rain-drop");

  // --- 1. Glow: right side, fade in ---
  gsap.to(glow, {
    opacity: 1,
    duration: 1.5,
    ease: "power2.inOut",
    delay: 0.3,
  });

  // --- 2. Glow follows mouse ---
  banner.addEventListener("mousemove", (e) => {
    const rect = banner.getBoundingClientRect();
    const x = 50 + ((e.clientX - rect.left) / rect.width) * 40;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    gsap.to(glow, {
      background: `radial-gradient(40% 50% at ${x}% ${y}%, #076AAB 0%, transparent 100%)`,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  banner.addEventListener("mouseleave", () => {
    gsap.to(glow, {
      background: `radial-gradient(40% 50% at 70% 50%, #076AAB 0%, transparent 100%)`,
      duration: 1.2,
      ease: "power2.inOut",
    });
  });

  // --- 3. Rain drops ---
  drops.forEach((drop) => {
    gsap.set(drop, { 
      y: "-100%",
      background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
    });
    rainLoop(drop);
  });

  function rainLoop(drop) {
    const delay = gsap.utils.random(0.3, 2.5);
    const duration = gsap.utils.random(1, 2);

    gsap.fromTo(drop,
      { y: "-100%" },
      {
        y: "100%",
        duration: duration,
        ease: "none",
        delay: delay,
        onComplete: () => rainLoop(drop),
      }
    );
  }
});