import { state } from './state.js';

// 🔆 iPhone 螢幕防休眠常亮鎖 (Screen Wake Lock API)
let wakeLockSentinel = null;

export async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLockSentinel = await navigator.wakeLock.request('screen');
    const badge = document.getElementById('wakeLockBadge');
    if (badge) badge.style.display = 'inline-block';
    wakeLockSentinel.addEventListener('release', () => {
      const b = document.getElementById('wakeLockBadge');
      if (b && !state.timer.running) b.style.display = 'none';
    });
  } catch (_) {}
}

export async function releaseWakeLock() {
  try {
    if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch (_) {}
  const badge = document.getElementById('wakeLockBadge');
  if (badge) badge.style.display = 'none';
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.timer.running) {
    requestWakeLock();
  }
});

// Web Audio API 頌缽與木魚溫潤音效合成器（完美解決 iPhone Safari 無震動 API 的問題）
let audioCtx = null;

export function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playSingingBowl(type = 'press') {
  const soundEnabled = document.getElementById('soundToggle')?.checked;
  if (!soundEnabled) return;

  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);

  if (type === 'press') {
    const freqs = [256, 512, 768];
    const gains = [0.28, 0.12, 0.05];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(gains[idx], now + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  } else {
    const freqs = [432, 648];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(idx === 0 ? 0.16 : 0.06, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.25);
    });
  }
}

export function speakGuide(text) {
  const soundEnabled = document.getElementById('soundToggle')?.checked;
  if (!soundEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-TW';
    utter.rate = 0.96;
    utter.pitch = 0.95;
    utter.volume = 0.8;
    window.speechSynthesis.speak(utter);
  } catch (_) {}
}

// 📳 震動提示（Android Chrome 有效；iOS Safari 不支援 Vibration API，會靜默略過，由頌缽聲補位）
export const HAPTIC_PATTERNS = {
  press: [180],
  release: [60],
  switchSide: [200, 120, 200],
  done: [300, 150, 300, 150, 500]
};

export function vibrate(type = 'press') {
  if (!state.settings?.haptics) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(HAPTIC_PATTERNS[type] || HAPTIC_PATTERNS.press);
  } catch (_) {}
}

export const supportsVibration = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
