// 💾 localStorage 持久化 + 備份匯出／匯入（收藏、體質紀錄、自訂處方、偏好設定）
import { state } from './state.js';

export const STORAGE_KEYS = {
  FAVS: 'acupoint_favs_v1',
  LOGS: 'acupoint_logs_v1',
  CUSTOM_PRESETS: 'acupoint_custom_presets_v1',
  SETTINGS: 'acupoint_settings_v1'
};

const MAX_LOGS = 300;
const BACKUP_VERSION = 1;

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    // QuotaExceededError：體質紀錄砍半後重試一次，避免整個儲存失效
    if (key === STORAGE_KEYS.LOGS && state.painLogs.length > 20) {
      state.painLogs = state.painLogs.slice(-Math.floor(state.painLogs.length / 2));
      try {
        localStorage.setItem(key, JSON.stringify(state.painLogs));
        return true;
      } catch (_) {}
    }
    console.warn('[storage] 寫入失敗', key, err);
    return false;
  }
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

export function loadPersistedData() {
  state.favorites = new Set(safeParse(localStorage.getItem(STORAGE_KEYS.FAVS), []));
  state.painLogs = safeParse(localStorage.getItem(STORAGE_KEYS.LOGS), []);
  state.customPresets = safeParse(localStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS), []);
  state.settings = { ...state.settings, ...safeParse(localStorage.getItem(STORAGE_KEYS.SETTINGS), {}) };
}

export function saveFavorites() {
  safeSet(STORAGE_KEYS.FAVS, JSON.stringify([...state.favorites]));
}

export function savePainLogs() {
  state.painLogs = state.painLogs.slice(-MAX_LOGS);
  safeSet(STORAGE_KEYS.LOGS, JSON.stringify(state.painLogs));
}

export function saveCustomPresets() {
  safeSet(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(state.customPresets));
}

export function saveSettings() {
  safeSet(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
}

// 📤 匯出備份 JSON（iOS 走 Web Share 檔案分享，可直接 AirDrop / LINE 傳給自己）
export async function exportBackup() {
  const payload = {
    app: 'acupoint-guide',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    favorites: [...state.favorites],
    painLogs: state.painLogs,
    customPresets: state.customPresets,
    settings: state.settings
  };
  const json = JSON.stringify(payload, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `本草尋穴備份-${stamp}.json`;
  const file = new File([json], filename, { type: 'application/json' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: '本草尋穴備份' });
      return 'shared';
    } catch (err) {
      if (err && err.name === 'AbortError') return 'aborted';
    }
  }

  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return 'downloaded';
}

// 📥 匯入備份：mode = 'merge'（合併去重）| 'replace'（覆蓋）
export async function importBackup(file, mode = 'merge') {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || data.app !== 'acupoint-guide') {
    throw new Error('這不是本草尋穴的備份檔');
  }

  const favs = Array.isArray(data.favorites) ? data.favorites : [];
  const logs = Array.isArray(data.painLogs) ? data.painLogs.filter((l) => l && l.pointId && l.timestamp) : [];
  const presets = Array.isArray(data.customPresets) ? data.customPresets : [];

  if (mode === 'replace') {
    state.favorites = new Set(favs);
    state.painLogs = logs;
    state.customPresets = presets;
  } else {
    favs.forEach((id) => state.favorites.add(id));
    const seen = new Set(state.painLogs.map((l) => `${l.pointId}|${l.timestamp}`));
    logs.forEach((l) => {
      const key = `${l.pointId}|${l.timestamp}`;
      if (!seen.has(key)) {
        seen.add(key);
        state.painLogs.push(l);
      }
    });
    state.painLogs.sort((a, b) => a.timestamp - b.timestamp);
    const presetIds = new Set(state.customPresets.map((p) => p.id));
    presets.forEach((p) => {
      if (!presetIds.has(p.id)) state.customPresets.push(p);
    });
  }
  if (data.settings && typeof data.settings === 'object') {
    state.settings = { ...state.settings, ...data.settings };
  }

  saveFavorites();
  savePainLogs();
  saveCustomPresets();
  saveSettings();
  return { favorites: state.favorites.size, logs: state.painLogs.length, presets: state.customPresets.length };
}
