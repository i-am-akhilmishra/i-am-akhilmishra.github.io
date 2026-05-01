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

// ==================== HERO CANVAS (INFRASTRUCTURE NETWORK) ====================
(function initCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, nodes = [], packets = [], frameCount = 0;

  // Real DevOps/Cloud tool nodes with brand colors
  const NODE_DEFS = [
    { label: "Azure",      color: "#0078D4", size: 22 },
    { label: "Kubernetes", color: "#326CE5", size: 21 },
    { label: "Docker",     color: "#2496ED", size: 18 },
    { label: "Terraform",  color: "#7B42BC", size: 18 },
    { label: "GitHub",     color: "#00d4ff", size: 16 },
    { label: "CI/CD",      color: "#00ffa3", size: 15 },
    { label: "GCP",        color: "#4285F4", size: 19 },
    { label: "Helm",       color: "#00d4ff", size: 14 },
    { label: "Prometheus", color: "#E6522C", size: 15 },
    { label: "Grafana",    color: "#F46800", size: 15 },
    { label: "Istio",      color: "#466BB0", size: 14 },
    { label: "ArgoCD",     color: "#EF7B4D", size: 14 },
    { label: "AWS",        color: "#FF9900", size: 18 },
    { label: "Ansible",    color: "#cc1100", size: 14 },
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", () => { resize(); init(); }, { passive: true });

  class InfraNode {
    constructor(def) {
      this.label = def.label;
      this.color = def.color;
      this.size  = def.size;
      this.x  = 80 + Math.random() * (W - 160);
      this.y  = 60 + Math.random() * (H - 120);
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const m = 80;
      if (this.x < m || this.x > W - m) this.vx *= -1;
      if (this.y < m || this.y > H - m) this.vy *= -1;
      this.pulse += 0.022;
    }
    draw() {
      const ps = 1 + Math.sin(this.pulse) * 0.1;
      const r  = this.size * ps;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(this.x, this.y, r + 10, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.05 + Math.abs(Math.sin(this.pulse)) * 0.04;
      ctx.fill();

      // Core fill
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.14;
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      const fs = Math.max(8, this.size * 0.58);
      ctx.font = `600 ${fs}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "#ddf0ff";
      ctx.globalAlpha = 0.7;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.label, this.x, this.y);
    }
  }

  class DataPacket {
    constructor(from, to) {
      this.from  = from;
      this.to    = to;
      this.t     = 0;
      this.speed = 0.0035 + Math.random() * 0.0035;
      this.color = from.color;
      this.r     = 1.8 + Math.random() * 1.2;
    }
    update() { this.t += this.speed; return this.t >= 1; }
    draw() {
      const x = this.from.x + (this.to.x - this.from.x) * this.t;
      const y = this.from.y + (this.to.y - this.from.y) * this.t;
      // Glow trail
      ctx.beginPath();
      ctx.arc(x, y, this.r + 4, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.12;
      ctx.fill();
      // Bright core
      ctx.beginPath();
      ctx.arc(x, y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
    }
  }

  function init() {
    const count = Math.min(NODE_DEFS.length, Math.max(7, Math.floor((W * H) / 38000) + 6));
    nodes = NODE_DEFS.slice(0, count).map(def => new InfraNode(def));
    packets = [];
  }

  function drawConnections() {
    const threshold = Math.min(W, H) * 0.42;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
          const alpha = (1 - dist / threshold) * 0.2;
          // Dashed line (topology diagram style)
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = "#00d4ff";
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([5, 9]);
          ctx.stroke();
          ctx.setLineDash([]);
          // Spawn data packets (deployments flowing through infra)
          if (frameCount % 100 === 0 && Math.random() < 0.22 && packets.length < 30) {
            const flip = Math.random() > 0.5;
            packets.push(new DataPacket(
              flip ? nodes[i] : nodes[j],
              flip ? nodes[j] : nodes[i]
            ));
          }
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    frameCount++;
    drawConnections();
    packets = packets.filter(p => { const done = p.update(); if (!done) p.draw(); return !done; });
    nodes.forEach(n => { n.update(); n.draw(); });
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

    // Pipeline stage cards stagger
    if (el.classList.contains("pl-stage")) {
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

    // K8s experience cards
    if (el.classList.contains("k8s-card")) {
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add("visible"), delay);
    }

    // Counters
    if (el.classList.contains("stat-number")) animateCounter(el);

    io.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  ".pl-stage, .timeline-item, .cert-card, .edu-card, .stat-number, .k8s-card"
).forEach(el => io.observe(el));

// ==================== VISITOR COUNTER ====================
(function initVisitorCounter() {
  const countEl = document.getElementById("visitorCount");
  if (!countEl) return;

  // countapi.dev — free, no auth, persistent counter per namespace+key
  const namespace = "i-am-akhilmishra.github.io";
  const key       = "portfolio-visits-v1";

  fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
    .then(r => r.json())
    .then(data => {
      const val = data.value || 0;
      countEl.innerHTML = "";
      // Animate count up
      let cur = Math.max(0, val - 50);
      const step = Math.ceil((val - cur) / 40);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, val);
        countEl.textContent = cur.toLocaleString();
        if (cur >= val) clearInterval(timer);
      }, 30);
    })
    .catch(() => {
      countEl.textContent = "—";
    });
})();

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
