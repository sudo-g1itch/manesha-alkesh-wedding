/**
 * Live countdown to the wedding. Updates four [data-cd] fields once a second.
 * When the date passes, swaps the timer for a celebratory line.
 */
export function initCountdown(targetISO: string): void {
  const root = document.querySelector<HTMLElement>("#countdown");
  if (!root) return;

  const target = new Date(targetISO).getTime();
  const fields = {
    days: root.querySelector<HTMLElement>('[data-cd="days"]'),
    hours: root.querySelector<HTMLElement>('[data-cd="hours"]'),
    minutes: root.querySelector<HTMLElement>('[data-cd="minutes"]'),
    seconds: root.querySelector<HTMLElement>('[data-cd="seconds"]'),
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      root!.classList.add("is-done");
      root!.innerHTML =
        '<p class="countdown__celebrate">Today we celebrate! 🎉</p>';
      return;
    }
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    if (fields.days) fields.days.textContent = String(days);
    if (fields.hours) fields.hours.textContent = pad(hours);
    if (fields.minutes) fields.minutes.textContent = pad(minutes);
    if (fields.seconds) fields.seconds.textContent = pad(seconds);

    setTimeout(tick, 1000);
  }
  tick();
}
