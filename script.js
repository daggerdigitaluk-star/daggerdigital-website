document.getElementById("year").textContent = new Date().getFullYear();
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
toggle.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
function submitForm(event){
  event.preventDefault();
  document.getElementById("form-note").textContent="Thanks — your demo form works visually. Connect it to Formspree, Netlify Forms or email before launch.";
  return false;
}

// Scroll reveal animation
const revealItems = document.querySelectorAll(
  '.service-grid article, .project, .price-grid article, .process-grid article, .section-head, .about-section > div, .contact-copy, .contact-form'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item, index) => {
  item.classList.add('reveal-item');
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(item);
});
const quoteForm = document.querySelector("#contact form");
const quotePopup = document.getElementById("quote-popup");
const countdownText = document.getElementById("countdown");

if (quoteForm && quotePopup && countdownText) {
  quoteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    quotePopup.style.display = "block";

    let seconds = 5;
    countdownText.textContent = seconds;

    const timer = setInterval(() => {
      seconds -= 1;
      countdownText.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(timer);
        quoteForm.submit();
      }
    }, 1000);
  });
}
