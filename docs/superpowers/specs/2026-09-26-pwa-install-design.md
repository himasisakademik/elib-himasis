# E-Library HIMASIS PWA Install Design

## Goal
Make E-Library HIMASIS installable as a browser PWA and expose an install notice in the footer only while the app is not installed.

## Approach
Use the platform primitives already available in Next.js and modern browsers:

- `app/manifest.ts` publishes the install metadata.
- `public/sw.js` provides a minimal service worker and a safe offline fallback for the public home route.
- `components/PwaInstallPrompt.tsx` registers the worker, handles `beforeinstallprompt` and `appinstalled`, and detects standalone mode.
- `components/Footer.tsx` renders the prompt in the existing footer surface.
- Existing `public/himasis.png` is resized into 192px and 512px icons.

## Safety boundaries
The service worker does not cache API, authentication, upload, or user-specific routes. The install notice is hidden when the app is already in standalone mode. iOS Safari gets a manual instruction because it does not expose the Chromium install prompt event.

## Verification
Run TypeScript checking, production build, browser smoke checks for the manifest and service worker, and a responsive visual check of the footer notice.
