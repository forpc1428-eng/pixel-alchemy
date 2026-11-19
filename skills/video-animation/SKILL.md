---
name: video-animation
description: Producing rendered animation deliverables — promo videos, social reels, product animations, animated logos, GIFs and Lottie files — with Remotion (React→MP4), headless browser capture of the live site, ffmpeg, and Lottie/dotLottie. Use when the user wants an MP4, a reel, a video of the site, an animated logo, a GIF, motion graphics or "animation" as a file rather than a website.
---

# Video & animation deliverables

## 1. Capture the live site (fastest promo)
Playwright script scrolls the page with an eased curve and records:
```js
// npm i -D playwright && npx playwright install chromium
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{width:1920,height:1080}, recordVideo:{ dir:'out', size:{width:1920,height:1080} } });
  const p = await ctx.newPage(); await p.goto('http://localhost:8080/?nosw'); await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let i = 0; i <= 600; i++) { const t = i/600, e = t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; await p.evaluate(y => scrollTo(0,y), e*H); await p.waitForTimeout(16); }
  await ctx.close(); await b.close();
})();
```
Convert/trim: `ffmpeg -i out/*.webm -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -movflags +faststart promo.mp4`.
Phone reel: viewport 1080×1920 with `?m=1`. GIF: `ffmpeg -i promo.mp4 -vf "fps=20,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" promo.gif`.
Use a real GPU machine for capture — headless software rendering is slow and drops frames.

## 2. Remotion (programmatic motion graphics → MP4)
`npx create-video@latest` → compositions in React; use `interpolate`, `spring`, `<Sequence>`; render `npx remotion render`.
Reuse the palette tokens and fonts. Typical 15 s reel: 0–2 s logo reveal, 2–10 s 3 feature beats, 10–15 s CTA + URL.
Note: Remotion has a company licence for larger teams — check remotion.dev/license.

## 3. Lottie / dotLottie (UI animations)
Design in After Effects (Bodymovin) or LottieFiles creator; play with `@lottiefiles/dotlottie-web`. Keep < 100 KB, ≤ 60 fps,
no embedded raster images.

## 4. Motion design rules for video
Hold each text card ≥ 1.5 s per 5 words · easing as in `motion-animation` · safe margins 5 % · captions burned in for
social · 24/30 fps cinematic, 60 fps for UI demos · end card with name + URL for ≥ 2 s · music royalty-free (licence noted).
