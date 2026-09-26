# E-Library HIMASIS Design Direction

## 1. Product
E-Library HIMASIS is an Indonesian academic resource hub for students. The interface should feel institutional, practical, and easy to scan on mobile.

## 2. Visual language
Use the existing dark footer language: slate and gray surfaces, white text, soft blue as the primary action accent, and purple only as a restrained secondary accent. The HIMASIS gear mark is the identity motif.

Dial: ENERGY 2 / RHYTHM 2 / MOTION 2

## 3. Color tokens
- Surface: `slate-950`, `gray-900`, and `white/5` overlays.
- Text: white for primary content, `gray-300` for supporting content, `gray-400` for metadata.
- Primary action: blue-600 to blue-700.
- Secondary accent: purple-500 used only where it already exists in the footer.
- Dividers: white/10.

## 4. Typography
- Headings: Clash Display or Space Grotesk, matching the existing app shell.
- Body and controls: Space Grotesk with readable sentence case labels.
- Install copy stays short because the action is contextual and mobile-first.

## 5. Component patterns
- Footer sections use the existing rounded panels and translucent borders.
- The PWA install prompt is a single functional notice placed near the footer's legal/copyright area.
- The prompt uses a real button with keyboard focus, a visible installed state, and no decorative control without behavior.

## 6. Motion and states
- Keep the existing Framer Motion reveal language.
- The install prompt is state-driven, not continuously animated.
- Required states: hidden when installed, actionable when the browser exposes an install prompt, and instructional on iOS Safari where the browser requires manual installation.

## 7. Decisions
- Use native Next.js manifest and browser APIs instead of a new PWA dependency to keep the bundle and maintenance surface small.
- Use the existing HIMASIS logo resized into valid 192px and 512px manifest icons instead of inventing a new mark.
- Keep service-worker caching limited to the public root shell and static icons so authenticated routes, API responses, uploads, and user-specific data are never cached.
