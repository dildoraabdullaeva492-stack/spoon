const page = document.body;
const preloader = document.querySelector(".preloader");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
function releasePreloader() {
  if (!preloader || page.classList.contains("is-ready")) return;
  page.classList.remove("is-loading");
  page.classList.add("is-ready");
  window.setTimeout(() => preloader.remove(), 1200);
}
if (preloader)
  window.addEventListener(
    "load",
    () => window.setTimeout(releasePreloader, reducedMotion ? 100 : 2450),
    { once: true }
  );
const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.13, rootMargin: "0px 0px -30px 0px" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}
const siteHeader = document.querySelector(".site-header");
let scrollQueued = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      siteHeader?.classList.toggle("is-scrolled", window.scrollY > 8);
      scrollQueued = false;
    });
  },
  { passive: true }
);
document.querySelectorAll("[data-interactive]").forEach((button) => {
  const resetMagnet = () => {
    button.style.setProperty("--move-x", "0px");
    button.style.setProperty("--move-y", "0px");
  };
  button.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || reducedMotion) return;
    const box = button.getBoundingClientRect();
    button.style.setProperty(
      "--move-x",
      `${(event.clientX - box.left - box.width / 2) * 0.07}px`
    );
    button.style.setProperty(
      "--move-y",
      `${(event.clientY - box.top - box.height / 2) * 0.1}px`
    );
  });
  button.addEventListener("pointerleave", resetMagnet);
  button.addEventListener("pointercancel", resetMagnet);
  button.addEventListener("focus", () => button.classList.add("is-focused"));
  button.addEventListener("blur", () => button.classList.remove("is-focused"));
  button.addEventListener("pointerdown", (event) => {
    const box = button.getBoundingClientRect();
    button.style.setProperty("--tap-x", `${event.clientX - box.left}px`);
    button.style.setProperty("--tap-y", `${event.clientY - box.top}px`);
    button.classList.remove("is-rippling");
    void button.offsetWidth;
    button.classList.add("is-rippling");
  });
  button.addEventListener("animationend", () =>
    button.classList.remove("is-rippling")
  );
});
