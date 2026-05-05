// ============================================================
// Yalla Bites Chef Portal — Service Worker v2
// Route-based caching with offline fallback
// ============================================================

const CACHE_VERSION = "v2";
const STATIC_CACHE = `yb-static-${CACHE_VERSION}`;
const SHELL_CACHE = `yb-shell-${CACHE_VERSION}`;

// Only precache truly static assets + the offline page
const PRECACHE_URLS = [
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-128.png",
  "/icons/icon-256.png",
  "/icons/icon-384.png",
  "/icons/apple-touch-icon.png",
];

// ---- Install: precache offline page + icons ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Do NOT skipWaiting here — let the update flow in the client control it
});

// ---- Activate: clean old versioned caches ----
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, SHELL_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !currentCaches.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ---- Helpers ----
function isStaticAsset(url) {
  return /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|eot)(\?.*)?$/i.test(
    url.pathname
  );
}

function isAppShellAsset(url) {
  return /\.(js|css)(\?.*)?$/i.test(url.pathname) || url.pathname.startsWith("/_next/static/");
}

function isAPIRequest(url) {
  return url.pathname.startsWith("/api/");
}

// ---- Fetch: route-based strategy ----
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-only for non-GET requests (mutations) and API calls
  if (request.method !== "GET" || isAPIRequest(url)) {
    return;
  }

  // Static assets (icons, images, fonts): Cache-First
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // App shell assets (JS, CSS bundles): Cache-First
  if (isAppShellAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Navigation requests (HTML pages): Network-First with /offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline").then((offlinePage) => {
          if (offlinePage) return offlinePage;
          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        })
      )
    );
    return;
  }

  // Everything else: Network-First, silent fail
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then(
        (cached) =>
          cached ||
          new Response("", { status: 408, statusText: "Offline" })
      )
    )
  );
});

// ---- Listen for skipWaiting message from client ----
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ---- Push notifications ----
self.addEventListener("push", (event) => {
  let data = {
    title: "Yalla Bites Chef Portal",
    body: "You have a new notification",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-128.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/orders",
    },
    actions: data.actions || [
      { action: "open", title: "View" },
      { action: "dismiss", title: "Dismiss" },
    ],
    tag: data.tag || "yalla-bites-notification",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ---- Notification click — open the app ----
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/orders";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
