// 💾 localStorage 持久化（支援多家庭成員獨立命名空間 + 備份匯出／匯入，100% 向下相容既有單人資料）
import { state } from './state.js';

export const STORAGE_KEYS = {
  FAVS: 'acupoint_favs_v1',
  LOGS: 'acupoint_logs_v1',
  NOTES: 'acupoint_notes_v1',
  CUSTOM_PRESETS: 'acupoint_custom_presets_v1',
  DURATIONS: 'acupoint_durations_v1',
  SETTINGS: 'acupoint_settings_v1',
  PROFILES: 'acupoint_profiles_v1',
  ACTIVE_PROFILE: 'acupoint_active_profile_v1'
};

const DEFAULT_PROFILE = { id: 'default', name: '我自己', icon: '👤', role: 'adult' };

const DEFAULT_SETTINGS = {
  theme: 'auto',
  haptics: true,
  reminderEnabled: false,
  reminderTime: '21:30',
  pregnancySafeMode: false,
  soundEnabled: true,
  fontScale: 'normal',
  rhythmLevel: 'standard'
};

const MAX_LOGS = 300;
const BACKUP_VERSION = 4;

let activeProfileId = 'default';

function scopedKey(baseKey, profileId = activeProfileId) {
  return profileId === 'default' ? baseKey : `p_${profileId}_${baseKey}`;
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    if (key.endsWith(STORAGE_KEYS.LOGS) && state.painLogs.length > 20) {
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

export function getProfiles() {
  const list = safeParse(localStorage.getItem(STORAGE_KEYS.PROFILES), null);
  if (Array.isArray(list) && list.length > 0 && list.some((p) => p && p.id)) {
    return list;
  }
  return [{ ...DEFAULT_PROFILE }];
}

export function saveProfilesList(list) {
  safeSet(STORAGE_KEYS.PROFILES, JSON.stringify(list));
}

export function getActiveProfileId() {
  return activeProfileId;
}

export function getActiveProfile() {
  const list = getProfiles();
  return list.find((p) => p.id === activeProfileId) || list[0] || { ...DEFAULT_PROFILE };
}

export function setActiveProfileId(profileId) {
  const list = getProfiles();
  const target = list.find((p) => p.id === profileId) || list[0];
  activeProfileId = target ? target.id : 'default';
  safeSet(STORAGE_KEYS.ACTIVE_PROFILE, activeProfileId);
  return activeProfileId;
}

export function createProfile({ name, icon = '👤', role = 'adult' }) {
  const list = getProfiles();
  const id = `prof_${Date.now()}`;
  const cleanName = String(name || '新成員').trim().slice(0, 14) || '新成員';
  const entry = { id, name: cleanName, icon, role };
  list.push(entry);
  saveProfilesList(list);

  // 依成員角色預置貼心初始偏好（孕媽自動開孕期鎖、長輩自動開大字體、寶寶用柔和節奏）
  const initSettings = { ...DEFAULT_SETTINGS };
  if (role === 'pregnant') initSettings.pregnancySafeMode = true;
  if (role === 'elder') {
    initSettings.fontScale = 'large';
    initSettings.rhythmLevel = 'gentle';
  }
  if (role === 'child') {
    initSettings.rhythmLevel = 'gentle';
  }
  safeSet(scopedKey(STORAGE_KEYS.SETTINGS, id), JSON.stringify(initSettings));
  return entry;
}

export function renameProfile(profileId, newName) {
  const list = getProfiles();
  const target = list.find((p) => p.id === profileId);
  if (!target) return false;
  target.name = String(newName || '').trim().slice(0, 14) || target.name;
  saveProfilesList(list);
  return true;
}

export function deleteProfile(profileId) {
  if (profileId === 'default') return false;
  const list = getProfiles().filter((p) => p.id !== profileId);
  saveProfilesList(list.length ? list : [{ ...DEFAULT_PROFILE }]);

  // 清理該成員獨立儲存空間
  [
    STORAGE_KEYS.FAVS,
    STORAGE_KEYS.LOGS,
    STORAGE_KEYS.NOTES,
    STORAGE_KEYS.CUSTOM_PRESETS,
    STORAGE_KEYS.DURATIONS,
    STORAGE_KEYS.SETTINGS
  ].forEach((baseKey) => {
    try {
      localStorage.removeItem(scopedKey(baseKey, profileId));
    } catch (_) {}
  });

  if (activeProfileId === profileId) {
    setActiveProfileId('default');
  }
  return true;
}

export function loadPersistedData() {
  const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
  const profiles = getProfiles();
  if (savedActive && profiles.some((p) => p.id === savedActive)) {
    activeProfileId = savedActive;
  } else {
    activeProfileId = profiles[0]?.id || 'default';
  }

  state.favorites = new Set(safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.FAVS)), []));
  state.painLogs = safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.LOGS)), []);
  const loadedNotes = safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.NOTES)), {});
  state.pointNotes = loadedNotes && typeof loadedNotes === 'object' ? loadedNotes : {};
  const loadedPresets = safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.CUSTOM_PRESETS)), []);
  state.customPresets = Array.isArray(loadedPresets) ? loadedPresets : [];
  const loadedDurations = safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.DURATIONS)), {});
  state.playlist.durations = loadedDurations && typeof loadedDurations === 'object' ? loadedDurations : {};
  state.settings = {
    ...DEFAULT_SETTINGS,
    ...safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.SETTINGS)), {})
  };

  // 同步還原孕期安全鎖（避免重整後重置成關閉）
  state.pregnancySafeMode = !!state.settings.pregnancySafeMode;
}

export function saveFavorites() {
  safeSet(scopedKey(STORAGE_KEYS.FAVS), JSON.stringify([...state.favorites]));
}

export function savePainLogs() {
  state.painLogs = state.painLogs.slice(-MAX_LOGS);
  safeSet(scopedKey(STORAGE_KEYS.LOGS), JSON.stringify(state.painLogs));
}

export function savePointNotes() {
  safeSet(scopedKey(STORAGE_KEYS.NOTES), JSON.stringify(state.pointNotes || {}));
}

export function saveCustomPresets() {
  safeSet(scopedKey(STORAGE_KEYS.CUSTOM_PRESETS), JSON.stringify(state.customPresets));
}

export function saveDurations() {
  safeSet(scopedKey(STORAGE_KEYS.DURATIONS), JSON.stringify(state.playlist.durations || {}));
}

export function saveSettings() {
  safeSet(scopedKey(STORAGE_KEYS.SETTINGS), JSON.stringify(state.settings));
}

// 📤 匯出備份 JSON（含全部家庭成員獨立資料，並保留頂層欄位向下相容舊版）
export async function exportBackup() {
  const profiles = getProfiles();
  const profileDataMap = {};
  profiles.forEach((p) => {
    profileDataMap[p.id] = {
      favorites: safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.FAVS, p.id)), []),
      painLogs: safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.LOGS, p.id)), []),
      pointNotes: safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.NOTES, p.id)), {}),
      customPresets: safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.CUSTOM_PRESETS, p.id)), []),
      durations: safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.DURATIONS, p.id)), {}),
      settings: safeParse(localStorage.getItem(scopedKey(STORAGE_KEYS.SETTINGS, p.id)), {})
    };
  });

  const payload = {
    app: 'acupoint-guide',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    activeProfileId,
    profiles,
    profileDataMap,
    // 向下相容 v1-v3 欄位（當前成員快照）
    favorites: [...state.favorites],
    painLogs: state.painLogs,
    pointNotes: state.pointNotes || {},
    customPresets: state.customPresets,
    durations: state.playlist.durations || {},
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

// 📥 匯入備份（相容 v1-v3 單人與 v4 多家庭成員備份）
export async function importBackup(file, mode = 'merge') {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || data.app !== 'acupoint-guide') {
    throw new Error('這不是本草尋穴的備份檔');
  }

  // 若含 v4 多成員資料，先合併其他成員
  if (Array.isArray(data.profiles) && data.profileDataMap && typeof data.profileDataMap === 'object') {
    const existing = getProfiles();
    const existingIds = new Set(existing.map((p) => p.id));
    data.profiles.forEach((p) => {
      if (p && p.id && !existingIds.has(p.id)) {
        existing.push(p);
        existingIds.add(p.id);
      }
      const pData = data.profileDataMap[p.id];
      if (p && p.id && p.id !== activeProfileId && pData) {
        if (Array.isArray(pData.favorites)) safeSet(scopedKey(STORAGE_KEYS.FAVS, p.id), JSON.stringify(pData.favorites));
        if (Array.isArray(pData.painLogs)) safeSet(scopedKey(STORAGE_KEYS.LOGS, p.id), JSON.stringify(pData.painLogs.slice(-MAX_LOGS)));
        if (pData.pointNotes) safeSet(scopedKey(STORAGE_KEYS.NOTES, p.id), JSON.stringify(pData.pointNotes));
        if (Array.isArray(pData.customPresets)) safeSet(scopedKey(STORAGE_KEYS.CUSTOM_PRESETS, p.id), JSON.stringify(pData.customPresets));
        if (pData.durations) safeSet(scopedKey(STORAGE_KEYS.DURATIONS, p.id), JSON.stringify(pData.durations));
        if (pData.settings) safeSet(scopedKey(STORAGE_KEYS.SETTINGS, p.id), JSON.stringify(pData.settings));
      }
    });
    saveProfilesList(existing);
  }

  const favs = Array.isArray(data.favorites) ? data.favorites : [];
  const logs = Array.isArray(data.painLogs) ? data.painLogs.filter((l) => l && l.pointId && l.timestamp) : [];
  const notes = data.pointNotes && typeof data.pointNotes === 'object' ? data.pointNotes : {};
  const presets = Array.isArray(data.customPresets) ? data.customPresets : [];
  const durations = data.durations && typeof data.durations === 'object' ? data.durations : {};

  if (mode === 'replace') {
    state.favorites = new Set(favs);
    state.painLogs = logs;
    state.pointNotes = { ...notes };
    state.customPresets = presets;
    state.playlist.durations = { ...durations };
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
    state.pointNotes = { ...(state.pointNotes || {}), ...notes };
    const presetIds = new Set(state.customPresets.map((p) => p.id));
    presets.forEach((p) => {
      if (p && p.id && !presetIds.has(p.id)) state.customPresets.push(p);
    });
    state.playlist.durations = { ...(state.playlist.durations || {}), ...durations };
  }

  if (data.settings && typeof data.settings === 'object') {
    state.settings = { ...state.settings, ...data.settings };
    state.pregnancySafeMode = !!state.settings.pregnancySafeMode;
  }

  saveFavorites();
  savePainLogs();
  savePointNotes();
  saveCustomPresets();
  saveDurations();
  saveSettings();

  return {
    favorites: state.favorites.size,
    logs: state.painLogs.length,
    notes: Object.keys(state.pointNotes || {}).filter((k) => state.pointNotes[k]).length,
    presets: state.customPresets.length,
    profiles: getProfiles().length
  };
}
