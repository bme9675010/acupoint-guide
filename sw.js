const CACHE_NAME = 'acupoint-guide-v11';
const AR_CACHE = 'acupoint-ar-v1'; // AR 模型離線包（約 20MB），不隨版本升級清除
const KEEP_CACHES = [CACHE_NAME, AR_CACHE];

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './arFinder.js',
  './manifest.json',
  './icon.svg',
  './data/index.js',
  './data/acupoints.js',
  './data/earPoints.js',
  './data/childPoints.js',
  './data/solarTerms.js',
  './data/closeupDiagrams.js',
  './data/earDiagrams.js',
  './data/childDiagrams.js',
  './modules/state.js',
  './modules/storage.js',
  './modules/audio.js',
  './modules/bodySvg.js',
  './modules/ui.js',
  './modules/deeplink.js',
  './modules/gestures.js',
  './modules/theme.js',
  './modules/reminder.js',
  './modules/heatmap.js',
  './modules/presetEditor.js',
  './modules/posture.js',
  './modules/offline.js',
  './modules/voiceControl.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // cache: 'reload' 繞過 HTTP 快取，確保新版 SW 拿到的是最新檔案
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !KEEP_CACHES.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isCacheable(res) {
  return res && (res.ok || res.type === 'opaque');
}

// Stale-While-Revalidate：有快取先秒回，背景再抓新版更新快取
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // AR 大型模型：cache-first（檔名含版本號，內容不變）
  const isArAsset =
    url.hostname === 'storage.googleapis.com' || url.href.includes('@mediapipe/tasks-vision');

  event.respondWith(
    caches.match(request, { ignoreSearch: request.mode === 'navigate' }).then((cached) => {
      if (cached && isArAsset) return cached;

      const network = fetch(request)
        .then((res) => {
          if (isCacheable(res)) {
            const copy = res.clone();
            const target = isArAsset ? AR_CACHE : CACHE_NAME;
            caches.open(target).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => cached || (request.mode === 'navigate' ? caches.match('./index.html') : undefined));

      if (cached) {
        event.waitUntil(network.catch(() => {}));
        return cached;
      }
      return network.then((res) => res || Response.error());
    })
  );
});

// 🔔 點擊每日提醒通知 → 開啟（或聚焦）App
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(target).catch(() => {});
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
