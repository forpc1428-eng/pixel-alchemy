---
name: webgl-3d
description: Real-time 3D for the web at award level — the Ultra Engine (zero-dependency WebGL2 full-screen shader scenes), writing new raymarched/procedural scenes, Three.js and React Three Fiber setup, glTF models, PBR lighting, post-processing, tone mapping, dynamic resolution and fallbacks. Use for any 3D, WebGL, shader, Three.js, R3F, model viewer, product configurator, particles, or "super high graphics" request.
---

# WebGL & 3D

## 1. Ultra Engine (template `site/js/engine.js`)

- One full-screen triangle; the fragment shader = `HEAD` (noise, fbm, ACES, stars, vignette, dither) + one scene.
- Uniforms: `uRes uTime uP(scroll 0..1, spring-smoothed) uMouse uShift(vec2 framing) uZoom uDim uBg uGlow uCool uAccent`.
- Quality defines per profile: `STEPS VSTEPS RSTEPS ASTEPS TSTEPS` (phone ≈ 55–65 % of desktop).
- Dynamic resolution: 20-frame average; > 21 ms → scale −0.1 (min .45); < 15 ms → +0.05. DPR capped 1.75/1.5.
- `KHR_parallel_shader_compile` so the loader never freezes. Errors → console + CSS fallback (`.no-webgl`).
- Scenes: **blackhole** (Schwarzschild geodesics `a = −1.5·h²·x/r⁵`, Doppler `D³` beaming, grav. redshift, lensed sky),
  **nebula** (volumetric fbm, density-gradient shading), **orb** (SDF + noise displacement, thin-film iridescence),
  **liquid** (domain warping + `dFdx` normals), **aurora** (ridged-noise curtains + reflection), **terrain** (ridged fbm
  heightfield, golden hour fog).

### Adding a scene
```js
SCENES.myscene = `
vec3 scene(vec2 uv, vec2 fc){
  // uv: centred, y-up, already framed by uShift/uZoom. Return LINEAR HDR colour (tone mapped after).
  float p = uP;           // scroll progress → camera/morph
  ...
  return col;
}`;
```
Then `scene: 'myscene'` in config.js. Keep loops bounded by a `#define`, early-out on transmittance/hit, and test on the
phone profile (`?m=1`).

## 2. Shader craft rules

Linear light → ACES → gamma → dither. Physically motivated over random: inverse-square falloff, Fresnel (Schlick
`pow(1−cos,5)`), Beer–Lambert absorption for volumes, warm key / cool fill. Animate with *slow* time (0.02–0.3×).
Avoid: `pow` of negatives, division by zero (`max(x,1e-4)`), unbounded loops, `discard` heavy shaders on mobile.

## 3. Three.js / React Three Fiber (when meshes/models are needed)

```bash
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
```
- Renderer: `antialias:false` when using post AA; `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping`,
  `setPixelRatio(Math.min(devicePixelRatio, 1.75))`.
- Lighting: HDRI environment (`<Environment files="studio.hdr"/>` — Poly Haven, CC0) + 1 key directional with soft shadows.
- Models: glTF/GLB, **Draco or Meshopt** compressed, textures **KTX2/Basis**, ≤ 2–5 MB total. `gltf-transform optimize in.glb out.glb --texture-compress webp`.
- Post: bloom (threshold high, only emissive), SMAA, subtle vignette/grain. No chromatic aberration by default.
- Scroll: drive camera from a `progress` ref (GSAP ScrollTrigger scrub or the template spring) — never setState per frame.
- R3F perf: `<AdaptiveDpr pixelated/>`, `<PerformanceMonitor>`, `frameloop="demand"` for static scenes, instancing for > 100 copies.
- WebGPU: `three/webgpu` + TSL is production-ready in modern Chrome/Edge/Safari; always keep a WebGL2 fallback.

## 4. Product / object scenes

Turntable on scroll, hotspots with HTML labels (`<Html>` drei), configurator (material swaps), exploded view
(animate part offsets along normals). Use a studio HDRI + contact shadows; never pure black backgrounds for products
unless the brand is dark.

## 5. Checks
- [ ] 60 fps desktop / ≥ 45 fps phone at dynamic res; compile < 1 s; no console errors.
- [ ] Works with WebGL off (fallback shown), with reduced motion, after tab switch, after context loss.
