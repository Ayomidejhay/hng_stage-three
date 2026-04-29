/* Habit Tracker PWA Service Worker — Production Ready */

const CACHE_NAME = "habit-tracker-v1";
const OFFLINE_URL = "/offline";

/**
 * Core app shell (critical routes only)
 * Avoid over-caching dynamic or API-heavy routes
 */
const APP_SHELL = [
  "/",
  "/login",
  "/signup",
  "/dashboard",
  "/offline",
  "/manifest.json"
];

/* ---------------------------
   INSTALL EVENT
----------------------------*/
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Safer caching (does not fail entire install if one file fails)
      await Promise.allSettled(
        APP_SHELL.map((url) => cache.add(url))
      );
    })()
  );

  // Activate immediately
  self.skipWaiting();
});

/* ---------------------------
   ACTIVATE EVENT
----------------------------*/
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })()
  );

  // Take control immediately
  self.clients.claim();
});

/* ---------------------------
   FETCH EVENT
----------------------------*/
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ❌ Do NOT cache API requests
  if (url.pathname.startsWith("/api/")) return;

  /* ---------------------------
     NAVIGATION REQUESTS (Pages)
     Network-first with offline fallback
  ----------------------------*/
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);

          // Update cache in background
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());

          return fresh;
        } catch (err) {
          // Offline fallback
          const cached = await caches.match(req);
          return cached || caches.match(OFFLINE_URL);
        }
      })()
    );

    return;
  }

  /* ---------------------------
     STATIC ASSETS (JS/CSS/images)
     Cache-first strategy
  ----------------------------*/
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);

        // Only cache valid responses
        if (!res || res.status !== 200 || res.type === "opaque") {
          return res;
        }

        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());

        return res;
      } catch (err) {
        return cached;
      }
    })()
  );
});