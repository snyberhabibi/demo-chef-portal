const CACHE_NAME = "yalla-bites-chef-v1";
const STATIC_ASSETS = [
  "/dashboard",
  "/orders",
  "/menu",
  "/flash-sales",
  "/reviews",
  "/profile",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline — serve from cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Fallback to dashboard for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/dashboard");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  let data = { title: "Yalla Bites", body: "You have a new notification" };

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

// Notification click — open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/orders";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(url);
    })
  );
});
