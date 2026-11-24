// 🖨️ 整套養生處方 A4 圖解單列印／PDF 輸出模組（按需懶載入，P1-3）
import { state } from './state.js';
import { getEffectiveRhythm, formatTime } from './timer.js';
import { escapeHtml } from './ui.js';

export function printPresetSheet(preset, allPoints, dietaryMap = {}) {
  if (!preset || !preset.points?.length) return;

  let container = document.getElementById('presetPrintSheet');
  if (!container) {
    container = document.createElement('section');
    container.id = 'presetPrintSheet';
    container.className = 'preset-print-sheet';
    document.body.appendChild(container);
  }

  const pts = preset.points
    .map((pid) => allPoints.find((p) => p.id === pid))
    .filter(Boolean);

  const totalSec = pts.reduce((acc, pt) => acc + getEffectiveRhythm(pt).totalDurationSec, 0);
  const today = new Date();
  const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

  const cardsHtml = pts
    .map((pt, idx) => {
      const rhythm = getEffectiveRhythm(pt);
      const diet = dietaryMap[pt.id];
      const isPreg = pt.contraindications?.pregnancyForbidden;
      return `
        <div class="pps-point-card">
          <div class="pps-point-head">
            <strong>${idx + 1}. ${escapeHtml(pt.name)} (${escapeHtml(pt.id)})</strong>
            <span class="pps-meta">${escapeHtml(pt.meridian)} ｜ 建議 ${formatTime(rhythm.totalDurationSec)}（深按 ${rhythm.pressSeconds}s・放鬆 ${rhythm.releaseSeconds}s）</span>
            ${isPreg ? '<span class="pps-preg-tag">🚫 孕期禁穴</span>' : ''}
          </div>
          <div class="pps-row"><b>📍 速找骨度：</b>${escapeHtml(pt.location?.quickFind || '')}（${escapeHtml(pt.location?.boneTip || '')}）</div>
          <div class="pps-row"><b>👐 按揉手法：</b>${escapeHtml(pt.massageGuide?.technique || '')} — ${escapeHtml(pt.massageGuide?.fingerToUse || '')}</div>
          <div class="pps-row"><b>✨ 得氣手感：</b>${escapeHtml(pt.massageGuide?.sensation || '')}</div>
          ${diet ? `<div class="pps-row"><b>🍵 搭配茶飲：</b>${escapeHtml(diet.teaName)}（${escapeHtml(diet.ingredients)}）</div>` : ''}
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="pps-header">
      <div>
        <h1>🌿 本草尋穴｜${escapeHtml(preset.icon || '')} ${escapeHtml(preset.title)}</h1>
        <p>${escapeHtml(preset.subtitle || '')} ｜ 共 ${pts.length} 穴・全程約 ${formatTime(totalSec)} ｜ 產出日期：${dateStr}</p>
      </div>
    </div>
    ${state.pregnancySafeMode ? '<div class="pps-alert">🤰 孕期安全鎖已開啟：標有「🚫 孕期禁穴」之穴位請務必避開。</div>' : ''}
    <div class="pps-list">${cardsHtml}</div>
    <footer class="pps-footer">
      ※ 本處方單僅供日常經絡養生保健參考，非醫療診斷或治療；皮膚破損、急性發炎、孕期或慢性病請諮詢專業中／西醫師。
    </footer>
  `;

  document.body.classList.add('printing-preset');

  const cleanup = () => {
    document.body.classList.remove('printing-preset');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);

  setTimeout(() => {
    window.print();
    // 備援清理（部分行動瀏覽器未觸發 afterprint）
    setTimeout(cleanup, 1500);
  }, 60);
}
