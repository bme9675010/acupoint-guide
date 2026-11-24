// 📋 全站 56 穴經絡與部位目錄總表抽屜（支援即時過濾、分組折疊與一鍵跳轉）
import { state } from './state.js';
import { escapeHtml } from './ui.js';
import { matchesNormalizedQuery } from './searchNorm.js';

function getRegionGroupLabel(pt) {
  if (pt.id.startsWith('PED-') || pt.id === 'GB39' || pt.id === 'ST2') return '👶 小兒推拿與青少年轉骨護眼';
  if (pt.id.startsWith('EAR-')) return '👂 耳穴全息反射區';
  if (pt.id.startsWith('REFLEX-') || pt.id === 'KI1' || pt.id === 'EX-LE-SHIMIAN' || pt.id === 'EX-LE-LINEITING') {
    return '🦶 足底反射區與湧泉要穴';
  }
  if (pt.views?.head) return '😊 頭面部與五官';
  if (pt.views?.hand) return '✋ 手掌・手腕・前臂';
  if (pt.views?.foot) return '🦵 下肢・膝蓋・腳踝';
  if (pt.views?.back && !pt.views?.front) return '🧘 肩頸・腰背';
  return '🫁 胸腹正中與四肢';
}

export function openDirectoryModal(allPoints, onSelectPoint) {
  let modal = document.getElementById('directoryModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'directoryModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '56 穴經絡與部位目錄總表');
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  let groupBy = 'meridian'; // 'meridian' | 'region'
  let filterQuery = '';

  const renderBody = () => {
    const filtered = allPoints.filter((pt) => {
      if (!filterQuery.trim()) return true;
      return matchesNormalizedQuery(
        [
          pt.name,
          pt.id,
          pt.pinyin,
          pt.meridian,
          pt.location?.quickFind || '',
          ...(pt.benefits?.symptoms || [])
        ],
        filterQuery
      );
    });

    const groups = new Map();
    filtered.forEach((pt) => {
      const key = groupBy === 'meridian' ? pt.meridian || '其他經絡' : getRegionGroupLabel(pt);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(pt);
    });

    const listEl = modal.querySelector('#directoryListWrap');
    const countEl = modal.querySelector('#directoryCountBadge');
    if (countEl) countEl.textContent = `顯示 ${filtered.length} / ${allPoints.length} 穴`;
    if (!listEl) return;

    if (filtered.length === 0) {
      listEl.innerHTML = `<p style="text-align:center; color:var(--ink-muted); padding:24px 0;">查無「${escapeHtml(filterQuery)}」相符穴位</p>`;
      return;
    }

    listEl.innerHTML = [...groups.entries()]
      .map(([groupName, pts]) => {
        const itemsHtml = pts
          .map((pt) => {
            const isSelected = state.selectedPointId === pt.id;
            const isFav = state.favorites.has(pt.id);
            const hasNote = !!(state.pointNotes?.[pt.id] || '').trim();
            const isPregForbidden = state.pregnancySafeMode && pt.contraindications?.pregnancyForbidden;
            const symPreview = (pt.benefits?.symptoms || []).slice(0, 3).join('・');
            return `
              <button type="button" class="dir-point-item ${isSelected ? 'active' : ''}" data-dir-pid="${escapeHtml(pt.id)}">
                <div class="dir-point-top">
                  <strong>
                    ${isPregForbidden ? '🚫 ' : ''}${escapeHtml(pt.name)}
                    <small>(${escapeHtml(pt.id)})</small>
                  </strong>
                  <span class="dir-badges">
                    ${isFav ? '<span title="已收藏">⭐</span>' : ''}
                    ${hasNote ? '<span title="有個人筆記">📝</span>' : ''}
                  </span>
                </div>
                <div class="dir-point-quick">${escapeHtml(pt.location?.quickFind || '')}</div>
                <div class="dir-point-sym">🎯 ${escapeHtml(symPreview)}</div>
              </button>
            `;
          })
          .join('');

        return `
          <details class="dir-group" open>
            <summary class="dir-group-summary">
              <span>${escapeHtml(groupName)}</span>
              <span class="dir-group-count">${pts.length} 穴</span>
            </summary>
            <div class="dir-group-grid">${itemsHtml}</div>
          </details>
        `;
      })
      .join('');

    listEl.querySelectorAll('[data-dir-pid]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-dir-pid');
        modal.classList.remove('open');
        if (onSelectPoint && pid) onSelectPoint(pid);
      });
    });
  };

  modal.innerHTML = `
    <div class="ar-modal-card directory-modal-card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px;">
        <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0; font-size:1.08rem;">
          📋 本草尋穴・56 穴經絡總表
        </h3>
        <button type="button" id="closeDirectoryBtn" class="ar-close-btn">✕ 關閉</button>
      </div>

      <div class="dir-toolbar">
        <input type="search" id="directoryFilterInput" class="dir-filter-input" placeholder="篩選穴名、代碼、經絡或症狀（例：胃經、失眠、LI4…）" autocomplete="off" />
        <div class="dir-mode-switch">
          <button type="button" class="util-pill-btn dir-group-btn active" data-group-by="meridian">依經絡</button>
          <button type="button" class="util-pill-btn dir-group-btn" data-group-by="region">依部位</button>
        </div>
        <span id="directoryCountBadge" class="dir-count-badge"></span>
      </div>

      <div id="directoryListWrap" class="dir-list-wrap"></div>
    </div>
  `;

  modal.querySelector('#closeDirectoryBtn')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.querySelector('#directoryFilterInput')?.addEventListener('input', (e) => {
    filterQuery = e.target.value;
    renderBody();
  });
  modal.querySelectorAll('.dir-group-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      groupBy = btn.getAttribute('data-group-by');
      modal.querySelectorAll('.dir-group-btn').forEach((b) => b.classList.toggle('active', b === btn));
      renderBody();
    });
  });

  renderBody();
  modal.classList.add('open');
}
