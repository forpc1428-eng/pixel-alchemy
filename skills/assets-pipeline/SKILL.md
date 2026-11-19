---
name: assets-pipeline
description: Sourcing, generating, optimising and licensing assets — images, textures, HDRIs, 3D models, icons, fonts, audio and video — with compression formats (AVIF/WebP, KTX2, Draco/Meshopt, WOFF2) and credit requirements. Use when a build needs any media, when files are too heavy, or to check whether an asset can legally be used.
---

# Assets pipeline

## Sources (free / safe licences)
| Type | Sources | Licence |
|---|---|---|
| Photos | Unsplash, Pexels | free, no attribution required (credit appreciated) |
| Space imagery | NASA (public domain), ESA/Hubble/Webb (CC BY 4.0 — credit), Solar System Scope textures (CC BY 4.0) |
| HDRIs, textures, models | Poly Haven, ambientCG (CC0) |
| 3D models | Sketchfab (check each licence), Quaternius, Kenney (CC0) |
| Icons | Lucide, Phosphor, Tabler (MIT/ISC) — one set only, same stroke |
| Fonts | Google Fonts, Fontshare (OFL / free licences) |
| Audio | Pixabay Music, freesound (check CC licence) |
Procedural first: the template's scenes and card art need **zero** image files.

## Generated images
AI image tools are fine for textures/backgrounds/concepts if their terms allow commercial use. Never generate fake
people as "team" or "clients", fake logos of real companies, or fake product screenshots presented as real.

## Optimise
- Images: `avif` (fallback `webp`), max 2× display size, `srcset`/`sizes`. `squoosh-cli`, `sharp`, or `cwebp -q 78`.
- Textures: KTX2 (`toktx` / `gltf-transform`), power-of-two, mipmaps. Phone set at ½ resolution.
- Models: `gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp`.
- Fonts: WOFF2 latin subset (`pyftsubset`).
- Video: H.264 `-crf 23 -preset veryfast` + `-movflags +faststart`; poster image; `muted playsinline autoplay loop` for bg.
- SVG: `svgo`.

## Credits
Keep a `CREDITS.md` and an on-page credit line wherever a licence requires it (CC BY). Keep font licence files.
