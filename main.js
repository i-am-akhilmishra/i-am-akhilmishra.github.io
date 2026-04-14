/* ============================================================
   AKHIL MISHRA PORTFOLIO — main.js
   ============================================================ */
"use strict";

// ==================== CURSOR ====================
const cursor     = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top  = ringY + "px";
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll("a, button, .skill-category, .cert-card, .contact-card").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
  });
} else {
  cursor.style.display = "none";
  cursorRing.style.display = "none";
}

// ==================== NAV SCROLL ====================
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// ==================== HAMBURGER ====================
const hamburger   = document.getElementById("hamburger");
const mobileMenu  = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open);
  const spans = hamburger.querySelectorAll("span");
  if (open) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity   = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  }
});
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  hamburger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
}));

// ==================== HERO CANVAS (PARTICLE DOTS) ====================
(function initCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];
  const COLORS = ["#ff8c00", "#ffb347", "#e67300", "#ffd280", "#ff6b35"];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", () => { resize(); init(); }, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.4;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha  = Math.random() * 0.5 + 0.15;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function init() {
    const count = Math.min(Math.floor((W * H) / 8000), 140);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function connect() {
    const threshold = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "#ff8c00";
          ctx.globalAlpha = (1 - dist / threshold) * 0.09;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  init();
  animate();
})();

// ==================== TYPEWRITER ====================
(function typewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  const words = [
    "Lead DevOps Engineer",
    "CI/CD Pipeline Architect",
    "Kubernetes Orchestrator",
    "Azure Cloud Expert",
    "Terraform IaC Specialist",
    "DevSecOps Practitioner",
  ];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(tick, 2200); }
      setTimeout(tick, 60);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 400); }
      setTimeout(tick, 32);
    }
  }
  setTimeout(tick, 800);
})();

// ==================== COUNTER ANIMATION ====================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ==================== INTERSECTION OBSERVER ====================
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Skill cards stagger
    if (el.classList.contains("skill-category")) {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add("visible"), delay);
    }

    // Timeline items
    if (el.classList.contains("timeline-item")) el.classList.add("visible");

    // Cert cards stagger
    if (el.classList.contains("cert-card")) {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add("visible"), delay);
    }

    // Edu card
    if (el.classList.contains("edu-card")) el.classList.add("visible");

    // Counters
    if (el.classList.contains("stat-number")) animateCounter(el);

    io.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  ".skill-category, .timeline-item, .cert-card, .edu-card, .stat-number"
).forEach(el => io.observe(el));

// ==================== SMOOTH SECTION HIGHLIGHT (NAV) ====================
const sections = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav-links a, .mobile-menu a");

const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle(
          "active",
          a.getAttribute("href") === "#" + entry.target.id
        );
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => sectionIO.observe(s));
