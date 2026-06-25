import "./style.css";
import { renderSite } from "./render";
import { initScroll } from "./lib/smoothScroll";
import { initReveals } from "./lib/reveal";
import { initCountdown } from "./lib/countdown";
import { content } from "./data/content";
import { FestiveScene } from "./three/FestiveScene";

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// 1. Render content from data.
const app = document.querySelector<HTMLElement>("#app")!;
renderSite(app);

// 2. Smooth scroll + single RAF loop.
const scroll = initScroll(reducedMotion);

// 3. Reveal animations + live countdown.
initReveals(reducedMotion);
initCountdown(content.couple.dateISO);

// 4. Three.js festive scene (lanterns, flowers, sparkles) on the fixed canvas.
const canvas = document.querySelector<HTMLCanvasElement>("#scene")!;
const festiveScene = await FestiveScene.create(canvas, reducedMotion);

// ---- Scroll-progress bar (a thin gold line with a glowing diya at its tip) ----
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.innerHTML = '<span class="scroll-progress__fill"></span>';
document.body.appendChild(progressBar);
const progressFill = progressBar.querySelector<HTMLElement>(".scroll-progress__fill")!;

const heroImg = document.querySelector<HTMLElement>(".hero__photoband img");

// Drive the scene + scroll-linked effects from the shared RAF loop.
let paused = document.hidden;
scroll.onFrame((time) => {
  if (paused) return;

  // Scroll progress (0..1) + instantaneous velocity, from Lenis when present.
  const lenis = scroll.lenis;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const progress = lenis
    ? lenis.progress || 0
    : max > 0
      ? scrollY / max
      : 0;
  const velocity = lenis ? lenis.velocity : 0;

  festiveScene.setScroll(progress, velocity);
  festiveScene.update(time);

  // Fill the progress bar.
  progressFill.style.transform = `scaleX(${progress})`;

  // Gentle hero photo parallax (image drifts slower than the page). The image
  // is oversized with headroom in CSS so this never reveals an edge.
  if (heroImg && !reducedMotion) {
    heroImg.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
  }
});

// 5. Celebratory petal burst once the scene is ready.
if (!reducedMotion) {
  setTimeout(() => festiveScene.burst("center"), 450);

  // Confetti when the closing monogram scrolls into view (once).
  const footer = document.querySelector(".site-footer");
  if (footer) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            festiveScene.burst("bottom");
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(footer);
  }
}

// 6. Pause rendering when the tab is hidden.
document.addEventListener("visibilitychange", () => {
  paused = document.hidden;
  festiveScene.setPaused(paused);
});
