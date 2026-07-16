window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader")?.classList.add("hidden"), 700);
});

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(item => observer.observe(item));

const serviceSelect = document.getElementById("service-select");

document.querySelectorAll(".package-button, .prefill-button").forEach(button => {
  button.addEventListener("click", () => {
    if (serviceSelect) {
      serviceSelect.value = button.dataset.service || "";
      setTimeout(() => serviceSelect.focus(), 450);
    }
  });
});

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

bookingToForm?.addEventListener("click", () => {
  bookingModal.classList.remove("show");
  if (serviceSelect) serviceSelect.value = "Free 15-Minute Call";
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

const form = document.querySelector(".contact-form");
const popup = document.getElementById("quote-popup");
const countdown = document.getElementById("countdown");
const progressBar = document.getElementById("progress-bar");
const cancelSubmit = document.getElementById("cancel-submit");

let timer = null;
let sending = false;

form?.addEventListener("submit", event => {
  if (sending) return;
  event.preventDefault();

  popup.classList.add("show");
  let seconds = 5;
  countdown.textContent = seconds;
  progressBar.style.width = "100%";

  timer = setInterval(() => {
    seconds -= 1;
    countdown.textContent = seconds;
    progressBar.style.width = `${(seconds / 5) * 100}%`;

    if (seconds <= 0) {
      clearInterval(timer);
      sending = true;
      form.submit();
    }
  }, 1000);
});

cancelSubmit?.addEventListener("click", () => {
  clearInterval(timer);
  popup.classList.remove("show");
  progressBar.style.width = "100%";
});

const cookieBar = document.getElementById("cookie-bar");
if (!localStorage.getItem("dd-cookie-choice")) {
  cookieBar?.classList.add("show");
}

document.getElementById("accept-cookies")?.addEventListener("click", () => {
  localStorage.setItem("dd-cookie-choice", "accepted");
  cookieBar.classList.remove("show");
});

document.getElementById("decline-cookies")?.addEventListener("click", () => {
  localStorage.setItem("dd-cookie-choice", "declined");
  cookieBar.classList.remove("show");
});
