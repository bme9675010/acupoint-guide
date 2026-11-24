// 🆚 易混淆鄰近穴位並排 PK 對照彈窗（按需懶載入 UI 模組）
import { escapeHtml } from './ui.js';
import { CONFUSION_GROUPS, getConfusionGroupForPoint } from '../data/confusionGroups.js';

export { CONFUSION_GROUPS, getConfusionGroupForPoint };

export function openPointCompareModal(currentPointId, allPoints, onJumpPoint) {
  const group = getConfusionGroupForPoint(currentPointId);
  if (!group) return;

  let modal = document.getElementById('compareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'compareModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '易混淆鄰近穴位並排對照');
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  const pts = group.points
    .map((pid) => allPoints.find((p) => p.id === pid))
    .filter(Boolean);

  const cardsHtml = pts
    .map((pt) => {
      const isCurrent = pt.id === currentPointId;
      const isPreg = pt.contraindications?.pregnancyForbidden;
      return `
        <div class="compare-pt-card ${isCurrent ? 'current' : ''}">
          <div class="compare-pt-head">
            <div>
              <strong>${escapeHtml(pt.name)} <small>(${escapeHtml(pt.id)})</small></strong>
              ${isCurrent ? '<span class="compare-current-tag">當前查看</span>' : ''}
              ${isPreg ? '<span class="compare-preg-tag">🚫 孕忌</span>' : ''}
            </div>
            <span class="compare-meridian">${escapeHtml(pt.meridian)}</span>
          </div>
          <div class="compare-row"><b>📍 關鍵骨度：</b>${escapeHtml(pt.location?.boneTip || pt.location?.quickFind || '')}</div>
          <div class="compare-row"><b>✨ 核心主治：</b>${escapeHtml((pt.benefits?.symptoms || []).slice(0, 4).join('、'))}</div>
          <div class="compare-row"><b>👐 按揉手法：</b>${escapeHtml(pt.massageGuide?.technique || '')}</div>
          ${
            !isCurrent
              ? `<button type="button" class="pairing-Jump-btn compare-jump-btn" data-compare-jump="${escapeHtml(pt.id)}">切換查看「${escapeHtml(pt.name)}」→</button>`
              : ''
          }
        </div>
      `;
    })
    .join('');

  modal.innerHTML = `
    <div class="ar-modal-card compare-modal-card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
        <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0; font-size:1.06rem;">
          🆚 ${escapeHtml(group.title)}
        </h3>
        <button type="button" id="closeCompareBtn" class="ar-close-btn">✕ 關閉</button>
      </div>
      <div class="compare-mnemonic-box">💡 ${escapeHtml(group.mnemonic)}</div>
      <div class="compare-grid">${cardsHtml}</div>
    </div>
  `;

  modal.querySelector('#closeCompareBtn')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.querySelectorAll('[data-compare-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-compare-jump');
      modal.classList.remove('open');
      if (onJumpPoint && pid) onJumpPoint(pid);
    });
  });

  modal.classList.add('open');
}
