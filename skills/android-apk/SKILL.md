---
name: android-apk
description: Turning any Omni Forge website or web app into an installable Android app — PWA install, Capacitor-wrapped APK/AAB built automatically by GitHub Actions (works from a phone), app icons/splash, signing keystores, Play Store upload, and TWA alternative. Use when the user asks for an APK, Android app, mobile app, Play Store, "install on my phone", or app from a website.
---

# Android APK

Three routes, from fastest to most "native":

## Route A — PWA (0 build, instant)
The template is already a PWA (manifest + service worker + icons). Deploy it (HTTPS), open in Chrome on Android →
⋮ → **Install app**. Full-screen, offline, own icon. Good enough for most portfolios.

## Route B — Capacitor APK via GitHub Actions (recommended, no PC needed)
Files: `packaging/android/` (package.json, capacitor.config.json) + `.github/workflows/android-apk.yml`.

1. Push the repo to GitHub (see `github-anywhere` — works from phone).
2. GitHub → **Actions → Build Android APK → Run workflow** (or push a tag `v1.0.0`).
3. ~6–10 min later: open the run → **Artifacts → omni-android-apk** → download → unzip → install `app-debug.apk`
   (allow "Install unknown apps" for your browser/Files app). Tags also attach the APK to a GitHub **Release**.

What the workflow does: copies `site/` → `packaging/android/www`, `npm install`, `npx cap add android`, generates icons
from `site/icons/icon-512.png`, runs `./gradlew assembleDebug` (and `assembleRelease` + `bundleRelease` when signing
secrets exist), uploads artifacts.

Edit app name/id in `packaging/android/capacitor.config.json` (`appId` must be unique, reverse-domain, e.g. `com.yourname.portfolio`).

### Signed release (Play Store)
Create a keystore once (PC or Termux):
```bash
keytool -genkey -v -keystore release.jks -alias omni -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.jks > release.jks.b64     # macOS: base64 -i release.jks
```
Add repo secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
The workflow then also outputs `app-release.apk` and `app-release.aab` (upload the **.aab** to Play Console).
Keep the keystore safe forever — losing it means you can't update the app.

### Local build (PC with Android Studio / JDK 21 / Node 22)
```bash
cd packaging/android && rm -rf www && cp -r ../../site www && npm install && npx cap add android && npx cap sync
cd android && ./gradlew assembleDebug   # → app/build/outputs/apk/debug/app-debug.apk
```

## Route C — Trusted Web Activity (Bubblewrap / PWABuilder)
For a deployed PWA: pwabuilder.com → enter URL → Android → download signed package. Needs `assetlinks.json` on the site.

## App-quality checklist
- [ ] `viewport-fit=cover` + safe-area padding (template has it). Status bar black.
- [ ] Back button: closes menu before leaving (add `App.addListener('backButton', …)` from `@capacitor/app` if needed).
- [ ] Works offline (bundled files). External links open in browser (`target=_blank`).
- [ ] Phone profile tested at 360×800 and 412×915; 60 fps on a mid-range device.
- [ ] Icon not clipped (maskable icon provided); app name ≤ 12 chars on home screen.
