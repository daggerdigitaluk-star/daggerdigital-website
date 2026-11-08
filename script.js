const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Mobile menu ---------- */
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Fade-in on scroll ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(item => observer.observe(item));
} else {
  reveals.forEach(item => item.classList.add("visible"));
}

/* ---------- Package buttons fill in the form ---------- */
const serviceSelect = document.getElementById("service-select");

document.querySelectorAll(".package-button, .prefill-button").forEach(button => {
  button.addEventListener("click", () => {
    if (serviceSelect) {
      serviceSelect.value = button.dataset.service || "";
      setTimeout(() => serviceSelect.focus({ preventScroll: true }), 450);
    }
  });
});

/* ---------- Free call modal ---------- */
const bookingModal = document.getElementById("booking-modal");
const bookCall = document.getElementById("book-call");
const bookingToForm = document.getElementById("booking-to-form");

bookCall?.addEventListener("click", () => bookingModal.classList.add("show"));
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => button.closest(".modal")?.classList.remove("show"));
});
bookingModal?.addEventListener("click", event => {
  if (event.target === bookingModal) bookingModal.classList.remove("show");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") bookingModal?.classList.remove("show");
});

bookingToForm?.addEventListener("click", () => {
  bookingModal.classList.remove("show");
  if (serviceSelect) serviceSelect.value = "Free 15-Minute Call";
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Quote form: send straight away, stop double clicks ---------- */
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
