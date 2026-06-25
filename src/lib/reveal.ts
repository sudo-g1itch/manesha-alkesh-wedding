import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Reveal every `.reveal` element on scroll. Elements that share a parent
 * (e.g. cards in a grid) animate in with a gentle stagger. Uses GSAP +
 * ScrollTrigger so it stays in sync with the Lenis-driven RAF loop.
 */
export function initReveals(reducedMotion: boolean): void {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(".reveal")
  );

  if (reducedMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Group siblings so grids stagger together.
  const groups = new Map<Element, HTMLElement[]>();
  for (const el of items) {
    const parent = el.parentElement ?? document.body;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent)!.push(el);
  }

  for (const members of groups.values()) {
    ScrollTrigger.create({
      trigger: members[0],
      start: "top 85%",
      once: true,
      onEnter: () => {
        members.forEach((el, i) => {
          gsap.delayedCall(i * 0.12, () => el.classList.add("is-visible"));
        });
      },
    });
  }

  // Hero is above the fold — reveal immediately with a soft cascade.
  const hero = document.querySelectorAll<HTMLElement>(".hero .reveal");
  hero.forEach((el, i) => {
    gsap.delayedCall(0.15 + i * 0.14, () => el.classList.add("is-visible"));
  });
}
