const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Header: solid background once you scroll ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");

function setMenu(open) {
  nav?.classList.toggle("open", open);
  header?.classList.toggle("menu-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuToggle?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));

/* ---------- Scroll reveal ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach(item => observer.observe(item));
} else {
  reveals.forEach(item => item.classList.add("visible"));
}

/* ---------- 3D tilt (hero logo and work preview) ---------- */
function addTilt(area, target, strength, base = { x: 0, y: 0 }) {
  if (!area || !target || reduceMotion || !finePointer) return;
  area.addEventListener("pointermove", event => {
    const box = area.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    target.style.setProperty("--ry", `${(base.y + x * strength).toFixed(2)}deg`);
    target.style.setProperty("--rx", `${(base.x - y * strength).toFixed(2)}deg`);
  });
  area.addEventListener("pointerleave", () => {
    target.style.removeProperty("--ry");
    target.style.removeProperty("--rx");
  });
}
/* ---------- 3D logo: slow idle sway, follows the mouse on hover ---------- */
(function medallion() {
  const coin = document.getElementById("medallion");
  const hero = document.querySelector(".hero");
  if (!coin || !hero || reduceMotion) return;

  let pointer = null;
  let rx = 6, ry = -14;
  let running = false;
  let visible = true;

  if (finePointer) {
    hero.addEventListener("pointermove", event => {
      const box = coin.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) / window.innerWidth;
      const y = (event.clientY - (box.top + box.height / 2)) / window.innerHeight;
      pointer = { ry: Math.max(-1, Math.min(1, x * 2)) * 32, rx: Math.max(-1, Math.min(1, -y * 2)) * 22 };
    });
    hero.addEventListener("pointerleave", () => { pointer = null; });
  }

  function frame(time) {
    if (!visible) { running = false; return; }
    const t = time / 1000;
    const target = pointer || { ry: Math.sin(t * 0.55) * 26, rx: 6 + Math.sin(t * 0.38) * 9 };
    rx += (target.rx - rx) * 0.06;
    ry += (target.ry - ry) * 0.06;
    coin.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }).observe(hero);
  }
  start();
})();
const stage = document.getElementById("project-stage");
addTilt(stage, stage, 16, { x: 4, y: -6 });

/* ---------- Work: laptop / phone switch ---------- */
document.querySelectorAll(".view-switch button").forEach(button => {
  button.addEventListener("click", () => {
    stage.dataset.view = button.dataset.view;
    document.querySelectorAll(".view-switch button").forEach(b => {
      const active = b === button;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
  });
});

/* ---------- Pricing tabs ---------- */
const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
const glider = document.querySelector(".tab-glider");

function moveGlider(tab) {
  if (!glider || !tab) return;
  glider.style.width = `${tab.offsetWidth}px`;
  glider.style.transform = `translateX(${tab.offsetLeft}px)`;
}
function selectTab(tab, focus) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  moveGlider(tab);
  if (focus) tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const next = tabs[(i + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next, true);
      event.preventDefault();
    }
  });
});
const showGlider = () => moveGlider(tabs.find(t => t.getAttribute("aria-selected") === "true"));
window.addEventListener("resize", showGlider);
document.fonts?.ready.then(showGlider);
showGlider();

/* ---------- Package buttons fill in the form ---------- */
const serviceSelect = document.getElementById("service-select");
const contact = document.getElementById("contact");

document.querySelectorAll(".package-button, .prefill-button").forEach(button => {
  button.addEventListener("click", () => {
    if (!serviceSelect) return;
    serviceSelect.value = button.dataset.service || "";
    if (button.tagName === "BUTTON") contact?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(() => serviceSelect.focus({ preventScroll: true }), 500);
  });
});

/* ---------- Free call modal ---------- */
const bookingModal = document.getElementById("booking-modal");
const bookCall = document.getElementById("book-call");
let lastFocus = null;

function openModal() {
  lastFocus = document.activeElement;
  bookingModal.classList.add("show");
  bookingModal.querySelector("#booking-to-form")?.focus();
}
function closeModal() {
  bookingModal.classList.remove("show");
  lastFocus?.focus();
}
bookCall?.addEventListener("click", openModal);
bookingModal?.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
bookingModal?.addEventListener("click", event => { if (event.target === bookingModal) closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (bookingModal?.classList.contains("show")) closeModal();
    if (nav?.classList.contains("open")) setMenu(false);
  }
});
document.getElementById("booking-to-form")?.addEventListener("click", () => {
  bookingModal.classList.remove("show");
  if (serviceSelect) serviceSelect.value = "Free 15-Minute Call";
  contact?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  setTimeout(() => serviceSelect?.focus({ preventScroll: true }), 500);
});

/* ---------- Quote form: stop double clicks ---------- */
const form = document.querySelector(".contact-form");
const submitButton = document.getElementById("submit-quote");
form?.addEventListener("submit", () => {
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
  }
});

/* ---------- Cookies: Google Analytics only loads after "Accept" ---------- */
const GA_ID = "G-GS2VE7E183";
const cookieBar = document.getElementById("cookie-bar");

function readChoice() {
  try { return localStorage.getItem("dd-cookie-choice"); } catch (e) { return null; }
}
function saveChoice(value) {
  try { localStorage.setItem("dd-cookie-choice", value); } catch (e) { /* storage blocked */ }
}
function loadAnalytics() {
  if (window.ddAnalyticsLoaded) return;
  window.ddAnalyticsLoaded = true;
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(tag);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

const choice = readChoice();
if (choice === "accepted") loadAnalytics();
else if (!choice) cookieBar?.classList.add("show");

document.getElementById("accept-cookies")?.addEventListener("click", () => {
  saveChoice("accepted");
  cookieBar.classList.remove("show");
  loadAnalytics();
});
document.getElementById("decline-cookies")?.addEventListener("click", () => {
  saveChoice("declined");
  cookieBar.classList.remove("show");
});
