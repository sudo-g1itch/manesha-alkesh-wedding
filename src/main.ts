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

// Drive the scene from the shared RAF loop and feed it scroll progress.
let paused = document.hidden;
scroll.onFrame((time) => {
  if (paused) return;
  festiveScene.update(time);
});

// 5. Pause rendering when the tab is hidden.
document.addEventListener("visibilitychange", () => {
  paused = document.hidden;
  festiveScene.setPaused(paused);
});
