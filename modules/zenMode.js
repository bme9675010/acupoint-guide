// 🧘 全螢幕沉浸跟練模式（Zen Mode）— 適合放桌上遠看或躺床睡前護眼跟練（P2-1）
import { state } from './state.js';
import { getCloseupSvgMarkup } from '../data/index.js';
import { escapeHtml, showToast } from './ui.js';
import { formatTime, getEffectiveDurationSec } from './timer.js';

let zenCallbacks = {
  getAllPoints: () => [],
  onToggleTimer: () => {},
  onSwitchSide: () => {},
  onNext: () => {},
  onPrev: () => {},
  onRecordPain: () => {}
};

let showCloseupInZen = false;

export function isZenModeOpen() {
  return !!document.getElementById('zenModeModal')?.classList.contains('open');
}

export function closeZenMode() {
  document.getElementById('zenModeModal')?.classList.remove('open');
}

export function refreshZenModePoint() {
  const modal = document.getElementById('zenModeModal');
  if (!modal || !modal.classList.contains('open')) return;

  const pt = zenCallbacks.getAllPoints().find((p) => p.id === state.selectedPointId);
  if (!pt) return;

  const nameEl = document.getElementById('zenPointTitle');
  const metaEl = document.getElementById('zenPointMeta');
  const quickEl = document.getElementById('zenPointQuick');
  const closeupEl = document.getElementById('zenCloseupWrap');
  const totalEl = document.getElementById('zenOrbTotal');
  const btnEl = document.getElementById('zenStartBtn');

  if (nameEl) nameEl.textContent = `${pt.name} (${pt.id})`;
  if (metaEl) metaEl.textContent = `${pt.meridian}・${pt.massageGuide?.technique || ''}`;
  if (quickEl) quickEl.textContent = `📍 ${pt.location?.quickFind || ''}`;
  if (closeupEl) {
    closeupEl.innerHTML = getCloseupSvgMarkup(pt.id);
    closeupEl.style.display = showCloseupInZen ? 'block' : 'none';
  }
  if (totalEl && !state.timer.running) {
    totalEl.textContent = `單穴時長 ${formatTime(getEffectiveDurationSec(pt))}`;
  }
  if (btnEl) {
    btnEl.textContent = state.timer.running ? '⏸ 暫停跟練' : '▶️ 開始跟練';
  }
}

export function openZenMode(callbacks) {
  zenCallbacks = { ...zenCallbacks, ...callbacks };

  let modal = document.getElementById('zenModeModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'zenModeModal';
    modal.className = 'zen-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '全螢幕沉浸跟練模式');

    modal.innerHTML = `
      <div class="zen-shell">
        <div class="zen-top-bar">
          <div>
            <h2 id="zenPointTitle" class="zen-point-title">--</h2>
            <p id="zenPointMeta" class="zen-point-meta">--</p>
          </div>
          <div class="zen-top-btns">
            <button type="button" id="zenToggleCloseupBtn" class="zen-ghost-btn">🔬 顯示微距圖</button>
            <button type="button" id="closeZenBtn" class="zen-close-btn">✕ 離開沉浸</button>
          </div>
        </div>

        <div id="zenPointQuick" class="zen-point-quick"></div>
        <div id="zenCloseupWrap" class="zen-closeup-wrap" style="display:none;"></div>

        <div class="zen-orb-stage">
          <div class="breathing-orb-wrap zen-orb-wrap">
            <div id="zenOrbRing" class="breathing-orb-ring"></div>
            <div class="orb-center-text">
              <span id="zenOrbPhase" class="orb-phase zen-orb-phase">準備開始</span>
              <span id="zenOrbSeconds" class="orb-seconds zen-orb-seconds">--</span>
              <span id="zenOrbTotal" class="orb-total-left zen-orb-total">單穴時長 01:00</span>
            </div>
          </div>
        </div>

        <div class="zen-controls-row">
          <button type="button" id="zenPrevBtn" class="zen-ctrl-btn">⏮ 上一穴</button>
          <button type="button" id="zenStartBtn" class="zen-play-btn">▶️ 開始跟練</button>
          <button type="button" id="zenSwitchSideBtn" class="zen-ctrl-btn">🔄 換側</button>
          <button type="button" id="zenNextBtn" class="zen-ctrl-btn">⏭ 下一穴</button>
        </div>

        <div class="zen-pain-row">
          <span class="zen-pain-label">按後一鍵打卡：</span>
          <button type="button" class="zen-pain-btn" data-zen-pain="smooth">😌 微痠舒暢</button>
          <button type="button" class="zen-pain-btn" data-zen-pain="sharp">⚡ 劇烈痠痛</button>
          <button type="button" class="zen-pain-btn" data-zen-pain="empty">☁️ 空軟無力</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#closeZenBtn')?.addEventListener('click', closeZenMode);
    modal.querySelector('#zenToggleCloseupBtn')?.addEventListener('click', (e) => {
      showCloseupInZen = !showCloseupInZen;
      e.currentTarget.textContent = showCloseupInZen ? '🔬 隱藏微距圖' : '🔬 顯示微距圖';
      const wrap = document.getElementById('zenCloseupWrap');
      if (wrap) wrap.style.display = showCloseupInZen ? 'block' : 'none';
    });
    modal.querySelector('#zenStartBtn')?.addEventListener('click', () => zenCallbacks.onToggleTimer());
    modal.querySelector('#zenSwitchSideBtn')?.addEventListener('click', () => zenCallbacks.onSwitchSide());
    modal.querySelector('#zenPrevBtn')?.addEventListener('click', () => {
      zenCallbacks.onPrev();
      refreshZenModePoint();
    });
    modal.querySelector('#zenNextBtn')?.addEventListener('click', () => {
      zenCallbacks.onNext();
      refreshZenModePoint();
    });
    modal.querySelectorAll('[data-zen-pain]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pain = btn.getAttribute('data-zen-pain');
        if (pain) {
          zenCallbacks.onRecordPain(pain);
          showToast(`✅ 已記錄本穴體感（${escapeHtml(btn.textContent.trim())}）`);
        }
      });
    });
  }

  modal.classList.add('open');
  refreshZenModePoint();

  // 若計時器正在運行中，立即同步目前光圈文案
  const mainPhase = document.getElementById('orbPhase')?.textContent;
  const mainSec = document.getElementById('orbSeconds')?.textContent;
  const mainTotal = document.getElementById('orbTotalLeft')?.textContent;
  const mainRingCls = document.getElementById('breathingRing')?.className;
  if (mainPhase) document.getElementById('zenOrbPhase').textContent = mainPhase;
  if (mainSec) document.getElementById('zenOrbSeconds').textContent = mainSec;
  if (mainTotal) document.getElementById('zenOrbTotal').textContent = mainTotal;
  if (mainRingCls) document.getElementById('zenOrbRing').className = mainRingCls;
}
