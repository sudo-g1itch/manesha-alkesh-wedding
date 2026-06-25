import * as THREE from "three";

/**
 * Rasterise a local SVG file into a crisp THREE texture. We fetch the markup,
 * make sure it has explicit width/height (Twemoji SVGs only carry a viewBox,
 * which some browsers rasterise at 0×0), then draw it to a canvas.
 */
export async function loadSvgTexture(
  url: string,
  size = 256
): Promise<THREE.Texture> {
  const res = await fetch(url);
  let svg = await res.text();
  if (!/<svg[^>]*\swidth=/.test(svg)) {
    svg = svg.replace(/<svg/, `<svg width="${size}" height="${size}"`);
  }
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const blobUrl = URL.createObjectURL(blob);

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = blobUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  URL.revokeObjectURL(blobUrl);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** A soft radial halo (additive glow) used behind the lanterns. */
export function makeGlowTexture(color = "255, 220, 150"): THREE.Texture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  g.addColorStop(0, `rgba(${color}, 0.9)`);
  g.addColorStop(0.4, `rgba(${color}, 0.35)`);
  g.addColorStop(1, `rgba(${color}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
