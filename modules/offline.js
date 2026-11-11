// 📦 離線能力：AR 模型離線包預載 + Service Worker 更新提示
import { VISION_CDN, WASM_PATH, HAND_MODEL_URL, FACE_MODEL_URL, POSE_MODEL_URL } from '../arFinder.js';

// 必須與 sw.js 的 AR_CACHE 相同；獨立於 CACHE_NAME，升版時不會被清掉
export const AR_CACHE = 'acupoint-ar-v1';

// 與 MediaPipe FilesetResolver.isSimdSupported() 相同的 SIMD 偵測位元組
const SIMD_PROBE = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]);

function isSimdSupported() {
  try {
    return WebAssembly.validate(SIMD_PROBE);
  } catch (_) {
    return false;
  }
}

export function getArAssetUrls() {
  const wasmBase = isSimdSupported() ? 'vision_wasm_internal' : 'vision_wasm_nosimd_internal';
  return [
    { url: `${VISION_CDN}/vision_bundle.mjs`, label: 'AI 視覺引擎', approxMB: 0.14 },
    { url: `${WASM_PATH}/${wasmBase}.js`, label: 'WASM 載入器', approxMB: 0.2 },
    { url: `${WASM_PATH}/${wasmBase}.wasm`, label: 'WASM 核心', approxMB: 9.5 },
    { url: HAND_MODEL_URL, label: '手部 21 點模型', approxMB: 7.8 },
    { url: FACE_MODEL_URL, label: '臉部 478 點模型', approxMB: 3.8 },
    { url: POSE_MODEL_URL, label: '小腿/背部 33 點姿態模型', approxMB: 5.5 }
  ];
}

export async function getArPackStatus() {
  if (!('caches' in window)) return { supported: false, cached: 0, total: 0 };
  const assets = getArAssetUrls();
  let cached = 0;
  for (const a of assets) {
    // caches.match 會搜尋所有快取（包含使用過 AR 後 SW 自動存下的）
    if (await caches.match(a.url)) cached += 1;
  }
  return { supported: true, cached, total: assets.length };
}

export async function preloadArPack(onProgress = () => {}) {
  if (!('caches' in window)) throw new Error('此瀏覽器不支援離線快取');
  const cache = await caches.open(AR_CACHE);
  const assets = getArAssetUrls();
  let done = 0;
  for (const a of assets) {
    onProgress({ done, total: assets.length, label: a.label });
    const hit = await caches.match(a.url);
    if (!hit) {
      const res = await fetch(a.url, { mode: 'cors', credentials: 'omit' });
      if (!res.ok) throw new Error(`${a.label} 下載失敗 (${res.status})`);
      await cache.put(a.url, res);
    }
    done += 1;
  }
  onProgress({ done, total: assets.length, label: '完成' });
  if (navigator.storage && navigator.storage.persist) {
    // 要求持久化儲存，降低 iOS 7 天未開啟就清快取的機率（瀏覽器可拒絕）
    navigator.storage.persist().catch(() => {});
  }
  return true;
}

// 🔄 註冊 SW + 新版本提示（stale-while-revalidate 會先顯示舊版，需提示重整）
export function registerServiceWorkerWithUpdates(onUpdateReady) {
  if (!('serviceWorker' in navigator)) return;
  const hadController = !!navigator.serviceWorker.controller;
  let notified = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // 首次安裝時 clients.claim() 也會觸發 controllerchange，此時不需提示
    if (!hadController || notified) return;
    notified = true;
    onUpdateReady();
  });
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
