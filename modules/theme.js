// 🌙 深色 / 夜間護眼模式（支援系統自動跟隨 prefers-color-scheme 與手動切換）
import { state } from './state.js';
import { saveSettings } from './storage.js';

const mediaQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

export function getEffectiveTheme() {
  const pref = state.settings?.theme || 'auto';
  if (pref === 'dark' || pref === 'light') return pref;
  return mediaQuery && mediaQuery.matches ? 'dark' : 'light';
}

export function applyTheme() {
  const effective = getEffectiveTheme();
  document.documentElement.setAttribute('data-theme', effective);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', effective === 'dark' ? '#141B17' : '#F6F2E9');
  }

  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    const pref = state.settings?.theme || 'auto';
    const labelMap = {
      auto: effective === 'dark' ? '🌙 夜間(自動)' : '☀️ 日間(自動)',
      dark: '🌙 夜間護眼',
      light: '☀️ 日間宣紙'
    };
    btn.textContent = labelMap[pref] || labelMap.auto;
  }
}

export function cycleThemeMode() {
  const order = ['auto', 'dark', 'light'];
  const current = state.settings?.theme || 'auto';
  const next = order[(order.indexOf(current) + 1) % order.length];
  state.settings.theme = next;
  saveSettings();
  applyTheme();
  return next;
}

export function initThemeListener() {
  applyTheme();
  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', () => {
      if ((state.settings?.theme || 'auto') === 'auto') {
        applyTheme();
      }
    });
  }
}
