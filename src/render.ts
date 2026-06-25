import { content, type WeddingEvent, type Person } from "./data/content";

/** Tiny HTML-escaping helper for any interpolated copy. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** The live countdown widget (filled in by initCountdown). */
function countdown(): string {
  const unit = (label: string, key: string) => `
      <div class="countdown__unit">
        <span class="countdown__num" data-cd="${key}">--</span>
        <span class="countdown__label">${label}</span>
      </div>`;
  return `
    <div class="countdown reveal" id="countdown" aria-label="Countdown to the wedding">
      ${unit("Days", "days")}
      ${unit("Hours", "hours")}
      ${unit("Minutes", "minutes")}
      ${unit("Seconds", "seconds")}
    </div>`;
}

function heroSection(): string {
  const { bride, groom, tagline, date, location } = content.couple;
  return `
  <section class="hero" id="hero">
    <div class="hero__photoband">
      <img src="images/hero-banner.jpg" alt="${esc(bride)} & ${esc(groom)}, just married" />
    </div>
    <div class="hero__content">
      <p class="eyebrow hero__eyebrow reveal">The Wedding Celebration of</p>
      <h1 class="hero__names">
        <span class="reveal">${esc(bride)}</span>
        <span class="script-amp reveal">&amp;</span>
        <span class="reveal">${esc(groom)}</span>
      </h1>
      <p class="hero__tagline reveal">${esc(tagline)}</p>
      <p class="hero__date reveal">${esc(date)}</p>
      <p class="hero__location reveal">${esc(location)}</p>
      ${countdown()}
      <div class="scroll-cue">
        <span>Scroll</span>
        <span class="scroll-cue__line"></span>
      </div>
    </div>
  </section>`;
}

function familiesSection(): string {
  const f = content.families;
  const side = (s: typeof f.bride) => `
      <div class="families__side reveal">
        <span class="families__relation">${esc(s.relation)}</span>
        <p class="families__parents">${esc(s.parents)}</p>
        <p class="families__home">${esc(s.home)}</p>
      </div>`;
  return `
  <section class="section families" id="families">
    <p class="eyebrow reveal">With joy &amp; gratitude</p>
    <hr class="divider reveal" />
    <p class="families__intro reveal">${esc(f.intro)}</p>
    <div class="families__grid">
      ${side(f.bride)}
      <span class="families__amp reveal">&amp;</span>
      ${side(f.groom)}
    </div>
    <figure class="accent-figure reveal">
      <img src="${esc(f.image)}" alt="Two hands joined in blessing" loading="lazy" />
    </figure>
    <p class="families__blessing reveal">${esc(f.blessing)}</p>
  </section>`;
}

function eventCard(e: WeddingEvent): string {
  return `
    <article class="event-card reveal">
      <h3 class="event-card__name">${esc(e.name)}</h3>
      <p class="event-card__row">${esc(e.date)}</p>
      <p class="event-card__row">${esc(e.time)}</p>
      <span class="event-card__label">Venue</span>
      <p class="event-card__row">${esc(e.venue)}</p>
      <p class="event-card__row">${esc(e.address)}</p>
      ${
        e.dressCode
          ? `<span class="event-card__label">Dress code</span>
      <p class="event-card__row">${esc(e.dressCode)}</p>`
          : ""
      }
      <a class="event-card__maps" href="${esc(e.mapsUrl)}" target="_blank" rel="noopener">
        View on map
      </a>
    </article>`;
}

function timelineSection(): string {
  return `
  <section class="section timeline" id="events">
    <p class="eyebrow reveal">Save the dates</p>
    <h2 class="reveal" style="font-size: clamp(2.2rem, 6vw, 3.6rem); color: var(--charcoal);">
      Celebrations
    </h2>
    <hr class="divider reveal" />
    <div class="timeline__cards">
      ${content.events.map(eventCard).join("")}
    </div>
  </section>`;
}

function personBlock(p: Person): string {
  return `
    <div class="person">
      <p class="person__role reveal">${esc(p.role)}</p>
      <h3 class="person__name reveal">${esc(p.name)}</h3>
      <p class="person__bio reveal">${esc(p.bio)}</p>
    </div>`;
}

function coupleSection(): string {
  const c = content.couple_section;
  return `
  <section class="section couple" id="couple">
    <p class="eyebrow reveal">Meet the couple</p>
    <hr class="divider reveal" />
    <figure class="couple__photo reveal">
      <img src="${esc(c.image)}" alt="${esc(c.caption)}" loading="lazy" />
    </figure>
    <div class="couple__grid">
      ${content.couplePeople.map(personBlock).join("")}
    </div>
  </section>`;
}

function messageSection(): string {
  const m = content.message;
  return `
  <section class="section message" id="message">
    <figure class="message__rings reveal">
      <img src="${esc(m.image)}" alt="Wedding rings" loading="lazy" />
    </figure>
    <h2 class="message__heading reveal">${esc(m.heading)}</h2>
    <hr class="divider reveal" />
    <p class="message__body reveal">${esc(m.body)}</p>
    <span class="message__signoff reveal">${esc(m.signoff)}</span>
  </section>`;
}

function footerSection(): string {
  const f = content.footer;
  return `
  <footer class="site-footer">
    <p class="site-footer__closing reveal">${esc(f.closing)}</p>
    <p class="site-footer__initials reveal">${esc(f.initials)}</p>
    <p class="site-footer__date reveal">${esc(f.date)}</p>
    <p class="site-footer__contact reveal">${esc(f.contact)}</p>
    <p class="site-footer__host reveal">${esc(f.host)}</p>
  </footer>`;
}

/** Render the full page into the given root and return it for chaining. */
export function renderSite(root: HTMLElement): HTMLElement {
  root.innerHTML =
    heroSection() +
    familiesSection() +
    timelineSection() +
    coupleSection() +
    messageSection();

  // Footer lives outside <main> for z-index/semantics; append after root.
  root.insertAdjacentHTML("afterend", footerSection());
  return root;
}
