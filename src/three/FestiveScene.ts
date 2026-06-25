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

/** A short-lived celebratory particle (load / footer burst). */
interface Burst {
  sprite: THREE.Sprite;
  vx: number;
  vy: number;
  rot: number;
  life: number;
  maxLife: number;
  scale: number;
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

  // Parallax depth: two layers that pan at different rates with scroll.
  private near = new THREE.Group();
  private far = new THREE.Group();
  // Smoothed scroll progress (0..1) and scroll-velocity "energy" (0..1).
  private scrollTarget = 0;
  private scroll = 0;
  private energyTarget = 0;
  private energy = 0;

  // Reusable assets + transient celebratory bursts.
  private texMap = new Map<string, THREE.Texture>();
  private bursts: Burst[] = [];
  private burstGroup = new THREE.Group();

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

    this.scene.add(this.far, this.near, this.burstGroup);

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
    this.texMap = new Map(entries);
    const texMap = this.texMap;
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

      const scale = kind.min + Math.random() * (kind.max - kind.min);
      // Bigger items read as "nearer" and live on the faster parallax layer.
      const layer = scale > 0.5 ? this.near : this.far;

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
        layer.add(glow);
      }
      layer.add(sprite);

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

    // Smooth scroll progress + velocity "energy" toward their targets.
    this.scroll += (this.scrollTarget - this.scroll) * 0.08;
    this.energy += (this.energyTarget - this.energy) * 0.1;
    this.energyTarget *= 0.9; // velocity decays back to rest each frame

    // Parallax: pan the two depth layers at different rates with scroll.
    // (A function of absolute progress — never accumulates, so the drift
    // speed stays constant.) Disabled under reduced motion.
    if (!this.reduced) {
      this.near.position.y = this.scroll * 2.4;
      this.far.position.y = this.scroll * 1.0;
    }
    // Faster scrolling makes the field sway a little more — it "breathes".
    const swayBoost = motion * (1 + this.energy * 0.6);

    for (const it of this.items) {
      const p = it.sprite.position;
      const dir = it.kind.motion === "rise" ? 1 : -1;
      p.y += it.speed * dt * motion * dir;

      const sway = Math.sin(t * it.swayFreq + it.swayPhase) * it.swayAmp * 0.12 * swayBoost;
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

    this.updateBursts(dt);
    this.renderer.render(this.scene, this.camera);
  };

  /** Advance + retire transient burst particles. */
  private updateBursts(dt: number) {
    if (!this.bursts.length) return;
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.life -= dt;
      if (b.life <= 0) {
        this.burstGroup.remove(b.sprite);
        b.sprite.material.dispose();
        this.bursts.splice(i, 1);
        continue;
      }
      b.vy -= 2.6 * dt; // gravity
      b.sprite.position.x += b.vx * dt;
      b.sprite.position.y += b.vy * dt;
      b.sprite.material.rotation += b.rot * dt;
      const k = b.life / b.maxLife; // 1 → 0
      b.sprite.material.opacity = Math.min(1, k * 1.6) * 0.9;
      b.sprite.scale.setScalar(b.scale * (0.6 + 0.4 * k));
    }
  }

  /**
   * Receive smoothed scroll progress (0..1) and instantaneous velocity so the
   * field can parallax and react. Called from the shared RAF loop.
   */
  setScroll(progress: number, velocity: number) {
    this.scrollTarget = Math.max(0, Math.min(1, progress));
    const e = Math.min(1, Math.abs(velocity) / 28);
    if (e > this.energyTarget) this.energyTarget = e;
  }

  /**
   * Fire a celebratory burst of petals/flowers/confetti. `origin` is "center"
   * (load) or "bottom" (footer). No-op under reduced motion.
   */
  burst(origin: "center" | "bottom" = "center") {
    if (this.reduced || !this.texMap.size) return;
    const files = ["blossom", "cherry", "hibiscus", "rosette", "confetti", "glowstar"]
      .filter((f) => this.texMap.has(f));
    const n = window.innerWidth < 768 ? 16 : 28;
    const baseY = origin === "bottom" ? -this.bounds.h / 2 + 0.5 : -1.5;

    for (let i = 0; i < n; i++) {
      const file = files[Math.floor(Math.random() * files.length)];
      const mat = new THREE.SpriteMaterial({
        map: this.texMap.get(file)!,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      });
      const sprite = new THREE.Sprite(mat);
      const scale = 0.35 + Math.random() * 0.5;
      sprite.scale.setScalar(scale);
      sprite.position.set((Math.random() - 0.5) * 3, baseY, 1);

      // Fan outward and up, like a gentle firework of petals.
      const angle = (Math.PI * (0.15 + Math.random() * 0.7)); // upward arc
      const speed = 4 + Math.random() * 5;
      this.burstGroup.add(sprite);
      const maxLife = 1.6 + Math.random() * 0.8;
      this.bursts.push({
        sprite,
        vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
        vy: Math.sin(angle) * speed + 2,
        rot: (Math.random() - 0.5) * 3,
        life: maxLife,
        maxLife,
        scale,
      });
    }
  }

  setPaused(paused: boolean) {
    if (!paused) this.prevTime = performance.now() / 1000;
  }

  dispose() {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointerMove);
    this.renderer.dispose();
  }
}
