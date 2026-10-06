import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

clientsClaim();

// Precache static assets compiled by Webpack/React-Scripts
precacheAndRoute(self.__WB_MANIFEST || []);

// Background Sync for Health Logs
// If the user submits a log in a rural area without internet, it gets stored in IndexedDB.
// When connectivity returns, the service worker retries the request automatically.
const bgSyncPlugin = new BackgroundSyncPlugin('healthLogsQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  /\/api\/logs/,
  new NetworkFirst({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

// Cache First strategy for Educational Content and Garden Guides
// This supports the "low-data usage mode" allowing users to read offline.
registerRoute(
  /\/api\/(education|gardens)/,
  new CacheFirst({
    cacheName: 'content-cache'
  })
);

// Network First strategy for the weekly meal plan GET endpoint.
// Falls back to cached JSON if the user is offline — supports offline viewing.
// The POST /generate endpoint intentionally has no cache route (mutation, always live).
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/meal-plan/') && !url.pathname.endsWith('/generate'),
  new NetworkFirst({
    cacheName: 'meal-plan-cache',
    networkTimeoutSeconds: 5
  }),
  'GET'
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
