// ⏱️ 呼吸跟練計時器與處方連續推進引擎（從 app.js 獨立拆分）
import { state } from './state.js';
import { requestWakeLock, releaseWakeLock, playSingingBowl, speakGuide, vibrate } from './audio.js';
import { showToast } from './ui.js';

let deps = {
  getAllPoints: () => [],
  selectAcupoint: () => {},
  updatePlaylistBannerUI: () => {}
};

export function initTimerDeps(injected) {
  deps = { ...deps, ...injected };
}

export function formatTime(sec) {
  const safe = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const RHYTHM_MULTIPLIERS = {
  gentle: { label: '🪶 柔和', factor: 0.75 },
  standard: { label: '⚖️ 標準', factor: 1.0 },
  deep: { label: '💪 深層', factor: 1.4 }
};

export function getEffectiveRhythm(point) {
  const base = point?.massageGuide?.rhythm || { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true };
  const level = state.settings?.rhythmLevel || 'standard';
  const mult = RHYTHM_MULTIPLIERS[level]?.factor || 1.0;
  const pressSeconds = Math.max(2, Math.min(12, Math.round(base.pressSeconds * mult)));
  const releaseSeconds = Math.max(1, Math.min(6, Math.round(base.releaseSeconds * (level === 'deep' ? 1.2 : 1))));
  const totalDurationSec = state.playlist.durations?.[point?.id] || base.totalDurationSec || 60;
  return {
    pressSeconds,
    releaseSeconds,
    totalDurationSec,
    bilateral: !!base.bilateral,
    level
  };
}

export function getEffectiveDurationSec(point) {
  return getEffectiveRhythm(point).totalDurationSec;
}

// 統一渲染光圈、文案與選擇性觸發音效/語音
export function renderTimerFrame(point, { triggerSound = false, skipVoice = false, customPhaseText = null } = {}) {
  const ring = document.getElementById('breathingRing');
  const phaseEl = document.getElementById('orbPhase');
  const secEl = document.getElementById('orbSeconds');
  const totalEl = document.getElementById('orbTotalLeft');
  if (!point || !ring || !phaseEl || !secEl || !totalEl) return;

  const prefix = state.playlist.isPlaying
    ? `[處方 ${state.playlist.currentIndex + 1}/${state.playlist.queue.length} ${point.name}] `
    : '';
  const isChildPoint = point.id.startsWith('PED-');

  if (state.timer.phase === 'press') {
    phaseEl.textContent = customPhaseText || (isChildPoint ? '輕快推撫・柔和' : '吐氣・深按');
    ring.className = 'breathing-orb-ring pressing';
    if (triggerSound) {
      playSingingBowl('press');
      vibrate('press');
      if (!skipVoice) speakGuide(isChildPoint ? '輕撫' : '深按');
    }
  } else {
    phaseEl.textContent = customPhaseText || (isChildPoint ? '順時慢撫・放鬆' : '吸氣・緩放');
    ring.className = 'breathing-orb-ring releasing';
    if (triggerSound) {
      playSingingBowl('release');
      vibrate('release');
      if (!skipVoice) speakGuide('放鬆');
    }
  }

  secEl.textContent = `${Math.max(0, state.timer.phaseTimeLeft)}s`;
  totalEl.textContent = `${prefix}剩餘 ${formatTime(state.timer.totalTimeLeft)}`;
}

// 啟動或暫停呼吸跟練計時器（支援單穴跟練與處方自動跳下一穴 + iPhone 螢幕防休眠）
export function toggleTimer({ skipInitialVoice = false } = {}) {
  const point = deps.getAllPoints().find((p) => p.id === state.selectedPointId);
  if (!point) return;

  const btn = document.getElementById('startTimerBtn');
  const ring = document.getElementById('breathingRing');
  const phaseEl = document.getElementById('orbPhase');
  const secEl = document.getElementById('orbSeconds');

  if (state.timer.running) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
    state.timer.running = false;
    if (btn) btn.textContent = '繼續跟練';
    if (phaseEl) phaseEl.textContent = '已暫停';
    if (ring) ring.className = 'breathing-orb-ring';
    releaseWakeLock();
    return;
  }

  const { pressSeconds, releaseSeconds, totalDurationSec: effectiveDurationSec, bilateral } = getEffectiveRhythm(point);
  if (state.timer.phase === 'idle') {
    state.timer.phase = 'press';
    state.timer.phaseTimeLeft = pressSeconds;
    state.timer.totalTimeLeft = effectiveDurationSec;
  }

  state.timer.running = true;
  if (btn) btn.textContent = '暫停跟練';
  requestWakeLock();

  // 處方剛播報完整長句時，避免立刻用「深按」把長句截斷
  renderTimerFrame(point, { triggerSound: true, skipVoice: skipInitialVoice });

  state.timer.intervalId = setInterval(() => {
    state.timer.phaseTimeLeft -= 1;
    state.timer.totalTimeLeft -= 1;

    if (state.timer.totalTimeLeft <= 0) {
      stopAndResetTimer();

      // 若處於「處方連續跟練模式」，自動推進到下一顆穴位
      if (state.playlist.isPlaying) {
        state.playlist.completedIds.add(point.id);
        state.playlist.currentIndex += 1;

        if (state.playlist.currentIndex < state.playlist.queue.length) {
          const nextId = state.playlist.queue[state.playlist.currentIndex];
          const nextPt = deps.getAllPoints().find((p) => p.id === nextId);
          deps.selectAcupoint(nextId, true, true);
          deps.updatePlaylistBannerUI();
          playSingingBowl('press');
          vibrate('switchSide');
          if (nextPt) {
            speakGuide(`完成${point.name}穴，現在換下一穴：${nextPt.name}穴，請深按`);
          }
          toggleTimer({ skipInitialVoice: true });
          return;
        } else {
          // 整套處方全部按完
          state.playlist.isPlaying = false;
          deps.updatePlaylistBannerUI();
          if (phaseEl) phaseEl.textContent = '處方圓滿完成';
          if (secEl) secEl.textContent = '🎉';
          playSingingBowl('press');
          vibrate('done');
          speakGuide('恭喜您完成整套養生處方按揉，請紀錄下方按後手感並喝溫水休息');
          return;
        }
      }

      if (phaseEl) phaseEl.textContent = '功德圓滿';
      if (secEl) secEl.textContent = '✓';
      playSingingBowl('press');
      vibrate('done');
      speakGuide('按揉完成，請於下方點擊紀錄您的按後痛感');
      return;
    }

    // 若為左右雙穴，在計時過半（剩餘一半秒數）時提示「換另一側按揉」
    // 重要：不重複觸發 speakGuide('深按')，避免截斷換邊語音；也不蓋掉換邊提示文案
    const halfSec = Math.floor(effectiveDurationSec / 2);
    if (bilateral && state.timer.totalTimeLeft === halfSec) {
      playSingingBowl('press');
      vibrate('switchSide');
      speakGuide('時間過半，若單手按揉請換另一側');
      state.timer.phase = 'press';
      state.timer.phaseTimeLeft = pressSeconds;
      renderTimerFrame(point, {
        triggerSound: false,
        skipVoice: true,
        customPhaseText: '🔄 請換另一側・深按'
      });
      return;
    }

    if (state.timer.phaseTimeLeft <= 0) {
      if (state.timer.phase === 'press') {
        state.timer.phase = 'release';
        state.timer.phaseTimeLeft = releaseSeconds;
      } else {
        state.timer.phase = 'press';
        state.timer.phaseTimeLeft = pressSeconds;
      }
      renderTimerFrame(point, { triggerSound: true });
    } else {
      renderTimerFrame(point, { triggerSound: false });
    }
  }, 1000);
}

// 語音喊「換邊」或鍵盤按 M 時安全觸發換側（不再拋 ReferenceError）
export function triggerManualSwitchSide() {
  const point = deps.getAllPoints().find((p) => p.id === state.selectedPointId);
  if (!point) return;

  const { pressSeconds, bilateral } = getEffectiveRhythm(point);
  if (!bilateral) {
    showToast('本穴位為人體正中單穴或無需特別換側');
    return;
  }

  playSingingBowl('press');
  vibrate('switchSide');
  speakGuide('換另一側按揉，請深按');
  state.timer.phase = 'press';
  state.timer.phaseTimeLeft = pressSeconds;
  renderTimerFrame(point, {
    triggerSound: false,
    skipVoice: true,
    customPhaseText: '🔄 請換另一側・深按'
  });
}

export function stopAndResetTimer() {
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
  }
  releaseWakeLock();

  const point = deps.getAllPoints().find((p) => p.id === state.selectedPointId);
  const totalSec = getEffectiveDurationSec(point);

  state.timer = {
    running: false,
    phase: 'idle',
    phaseTimeLeft: 0,
    totalTimeLeft: totalSec,
    intervalId: null
  };

  const btn = document.getElementById('startTimerBtn');
  const ring = document.getElementById('breathingRing');
  const phaseEl = document.getElementById('orbPhase');
  const secEl = document.getElementById('orbSeconds');
  const totalEl = document.getElementById('orbTotalLeft');

  if (btn) btn.textContent = '開始跟練按揉';
  if (ring) ring.className = 'breathing-orb-ring';
  if (phaseEl) phaseEl.textContent = '準備開始';
  if (secEl) secEl.textContent = '--';
  if (totalEl) totalEl.textContent = `單穴時長 ${formatTime(totalSec)}`;
}
