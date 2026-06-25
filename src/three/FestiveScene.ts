import * as THREE from "three";
import { loadSvgTexture, makeGlowTexture } from "./svgTexture";

const DECOR = "images/decor";

/** Which artwork to use, how it moves, and how big/common it is. */
interface Kind {
  file: string;
  motion: "rise" | "fall";
  glow: boolean; // add a warm halo behind it
  weight: number; // relative frequency
  min: number; // scale range
  max: number;
  twinkle?: boolean; // pulse opacity/scale (sparkles)
}

const KINDS: Kind[] = [
  { file: "lantern", motion: "rise", glow: true, weight: 4, min: 0.55, max: 1.0 },
  { file: "diya", motion: "rise", glow: true, weight: 2, min: 0.45, max: 0.72 },
  { file: "glowstar", motion: "rise", glow: true, weight: 3, min: 0.32, max: 0.55 },
  { file: "blossom", motion: "fall", glow: false, weight: 3, min: 0.32, max: 0.62 },
  { file: "cherry", motion: "fall", glow: false, weight: 3, min: 0.32, max: 0.62 },
  { file: "hibiscus", motion: "fall", glow: false, weight: 2, min: 0.38, max: 0.68 },
  { file: "rosette", motion: "fall", glow: false, weight: 2, min: 0.32, max: 0.6 },
  { file: "lotus", motion: "fall", glow: false, weight: 1, min: 0.4, max: 0.66 },
  { file: "sparkles", motion: "fall", glow: false, weight: 5, min: 0.26, max: 0.5, twinkle: true },
  { file: "confetti", motion: "fall", glow: false, weight: 2, min: 0.34, max: 0.6 },
];

interface Item {
  sprite: THREE.Sprite;
  glow?: THREE.Sprite;
  kind: Kind;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  spin: number;
  scale: number;
  baseX: number;
}

export class FestiveScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;
  private items: Item[] = [];
  private bounds = { w: 1, h: 1 };
  private count: number;
  private prevTime = 0;
  private mouse = new THREE.Vector2();
  private targetMouse = new THREE.Vector2();
  private reduced: boolean;

  private constructor(canvas: HTMLCanvasElement, reducedMotion: boolean) {
    this.reduced = reducedMotion;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    this.camera.position.z = 10;

    this.count = window.innerWidth < 768 ? 23 : 43;
  }

  /** Async factory — loads all artwork, then builds the sprite field. */
  static async create(
    canvas: HTMLCanvasElement,
    reducedMotion: boolean
  ): Promise<FestiveScene> {
    const s = new FestiveScene(canvas, reducedMotion);
    await s.build();
    s.resize();
    window.addEventListener("resize", s.resize);
    if (!reducedMotion) {
      window.addEventListener("pointermove", s.onPointerMove, { passive: true });
    }
    return s;
  }

  private async build() {
    // Load every texture once, keyed by file name.
    const unique = Array.from(new Set(KINDS.map((k) => k.file)));
    const entries = await Promise.all(
      unique.map(async (f) => [f, await loadSvgTexture(`${DECOR}/${f}.svg`)] as const)
    );
    const texMap = new Map(entries);
    const glowTex = makeGlowTexture();

    // Weighted pick list.
    const pool: Kind[] = [];
    for (const k of KINDS) for (let i = 0; i < k.weight; i++) pool.push(k);

    for (let i = 0; i < this.count; i++) {
      const kind = pool[Math.floor((i / this.count + Math.random()) * pool.length) % pool.length];
      const tex = texMap.get(kind.file)!;

      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        opacity: 0.6,
      });
      const sprite = new THREE.Sprite(mat);

      let glow: THREE.Sprite | undefined;
      if (kind.glow) {
        const gmat = new THREE.SpriteMaterial({
          map: glowTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.32,
        });
        glow = new THREE.Sprite(gmat);
        this.scene.add(glow);
      }
      this.scene.add(sprite);

      const scale = kind.min + Math.random() * (kind.max - kind.min);
      this.items.push({
        sprite,
        glow,
        kind,
        // Gentle, drifting pace (roughly half the previous speed).
        speed: (kind.motion === "rise" ? 0.16 : 0.2) + Math.random() * 0.22,
        swayAmp: 0.4 + Math.random() * 1.0,
        swayFreq: 0.2 + Math.random() * 0.45,
        swayPhase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * (kind.motion === "fall" ? 0.7 : 0.2),
        scale,
        baseX: 0,
      });
    }
  }

  private placeItem(it: Item, spread: boolean) {
    it.baseX = (Math.random() - 0.5) * this.bounds.w * 1.05;
    let y: number;
    if (spread) {
      y = (Math.random() - 0.5) * this.bounds.h;
    } else if (it.kind.motion === "rise") {
      y = -this.bounds.h / 2 - Math.random() * this.bounds.h;
    } else {
      y = this.bounds.h / 2 + Math.random() * this.bounds.h;
    }
    const z = (Math.random() - 0.5) * 2;
    it.sprite.position.set(it.baseX, y, z);
    const gscale = it.scale * 2.4;
    it.glow?.position.set(it.baseX, y, z - 0.1);
    it.glow?.scale.setScalar(gscale);
    it.sprite.scale.setScalar(it.scale);
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    const worldH = 12;
    const worldW = worldH * (w / h);
    this.bounds = { w: worldW, h: worldH };
    this.camera.left = -worldW / 2;
    this.camera.right = worldW / 2;
    this.camera.top = worldH / 2;
    this.camera.bottom = -worldH / 2;
    this.camera.updateProjectionMatrix();
    for (const it of this.items) this.placeItem(it, true);
  };

  private onPointerMove = (e: PointerEvent) => {
    this.targetMouse.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
  };

  update = (timeMs: number) => {
    const t = timeMs / 1000;
    let dt = t - this.prevTime;
    this.prevTime = t;
    if (dt > 0.1) dt = 0.1;

    this.mouse.lerp(this.targetMouse, 0.04);
    const motion = this.reduced ? 0.18 : 1;
    const topEdge = this.bounds.h / 2 + 1.5;
    const botEdge = -this.bounds.h / 2 - 1.5;

    for (const it of this.items) {
      const p = it.sprite.position;
      const dir = it.kind.motion === "rise" ? 1 : -1;
      p.y += it.speed * dt * motion * dir;

      const sway = Math.sin(t * it.swayFreq + it.swayPhase) * it.swayAmp * 0.12 * motion;
      p.x = it.baseX + sway + this.mouse.x * 0.3 * it.scale;

      // Recycle when out of view.
      if (dir > 0 && p.y > topEdge) this.placeItem(it, false);
      else if (dir < 0 && p.y < botEdge) this.placeItem(it, false);

      // Spin (rotate the sprite's texture) for flowers/confetti.
      if (it.spin) it.sprite.material.rotation = t * it.spin * motion + it.swayPhase;

      // Twinkle for sparkles.
      if (it.kind.twinkle) {
        const tw = 0.7 + 0.3 * Math.sin(t * 3 + it.swayPhase);
        it.sprite.material.opacity = 0.55 * tw;
        it.sprite.scale.setScalar(it.scale * (0.85 + 0.15 * tw));
      }

      if (it.glow) {
        it.glow.position.set(p.x, p.y, p.z - 0.1);
        const pulse = 0.26 + 0.1 * Math.sin(t * 1.5 + it.swayPhase);
        it.glow.material.opacity = pulse;
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  setPaused(paused: boolean) {
    if (!paused) this.prevTime = performance.now() / 1000;
  }

  dispose() {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointerMove);
    this.renderer.dispose();
  }
}
