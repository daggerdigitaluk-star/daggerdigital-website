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
