// ✏️ 多組自訂處方與單穴秒數編輯器（支援收藏處方 + 建立/編輯/刪除多組命名處方）
import { state } from './state.js';
import { saveFavorites, saveCustomPresets, saveDurations } from './storage.js';
import { showToast } from './ui.js';

const PRESET_ICONS = ['🌿', '🌙', '💻', '👶', '🔥', '💆', '🧘', '⚡'];

/**
 * 開啟處方編輯彈窗
 * @param {Array} allPoints 全站穴位清單
 * @param {Function} onSaved 變更後回呼
 * @param {Object} options { targetPresetId: 'fav_custom' | 'custom_xxx' | '__new__' }
 */
export function renderPresetEditorModal(allPoints, onSaved, options = {}) {
  let modal = document.getElementById('presetEditorModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'presetEditorModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '編輯養生處方順序與秒數');
    document.body.appendChild(modal);
  }

  let editingPresetId = options.targetPresetId || state.activePresetId || 'fav_custom';

  // 若傳入 __new__，建立新處方草稿（預設帶入目前收藏或常用 3 穴）
  let draftNew = null;
  if (editingPresetId === '__new__') {
    const seedPoints = state.favorites.size > 0 ? [...state.favorites].slice(0, 5) : ['LI4', 'PC6', 'ST36'];
    draftNew = {
      id: `custom_${Date.now()}`,
      title: '我的專屬養生方',
      icon: '🌿',
      points: [...seedPoints]
    };
  }

  const getCurrentTarget = () => {
    if (draftNew) return draftNew;
    if (editingPresetId === 'fav_custom') {
      return {
        id: 'fav_custom',
        title: '我的收藏處方',
        icon: '⭐',
        points: [...state.favorites],
        isFav: true
      };
    }
    const found = state.customPresets.find((p) => p.id === editingPresetId);
    if (found) return found;
    return {
      id: 'fav_custom',
      title: '我的收藏處方',
      icon: '⭐',
      points: [...state.favorites],
      isFav: true
    };
  };

  const commitPoints = (target, newPoints) => {
    if (target.isFav) {
      state.favorites = new Set(newPoints);
      saveFavorites();
    } else {
      target.points = newPoints;
      if (!draftNew) saveCustomPresets();
    }
  };

  const paintModal = () => {
    const target = getCurrentTarget();
    const durations = state.playlist.durations || {};
    const existingSet = new Set(target.points);
    const availableToAdd = allPoints.filter((pt) => !existingSet.has(pt.id));

    const rowsHtml =
      target.points.length === 0
        ? `<p style="font-size:0.84rem; color:var(--ink-muted); text-align:center; padding:16px 0;">目前尚未加入穴位，請從下方選單加入穴位。</p>`
        : target.points
            .map((pid, idx) => {
              const pt = allPoints.find((p) => p.id === pid);
              const defaultSec = pt?.massageGuide?.rhythm?.totalDurationSec || 60;
              const sec = durations[pid] || defaultSec;
              const secChoices = [...new Set([30, 45, 60, 90, 120, 180, sec])].sort((a, b) => a - b);
              return `
                <div class="editor-item-row" data-pid="${pid}">
                  <span class="editor-step-num">${idx + 1}.</span>
                  <strong class="editor-pt-name">${pt ? pt.name : pid} <small>(${pid})</small></strong>
                  <label class="editor-sec-label">
                    秒數
                    <select class="editor-sec-select" data-sec-pid="${pid}">
                      ${secChoices
                        .map((s) => `<option value="${s}" ${s === sec ? 'selected' : ''}>${s}秒</option>`)
                        .join('')}
                    </select>
                  </label>
                  <div class="editor-row-btns">
                    <button type="button" class="editor-move-btn" data-dir="up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>↑</button>
                    <button type="button" class="editor-move-btn" data-dir="down" data-idx="${idx}" ${idx === target.points.length - 1 ? 'disabled' : ''}>↓</button>
                    <button type="button" class="editor-del-btn" data-del-pid="${pid}">✕</button>
                  </div>
                </div>
              `;
            })
            .join('');

    const titleSectionHtml = target.isFav
      ? `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
          <p style="font-size:0.82rem; color:var(--ink-muted); margin:0;">
            調整順序與每穴秒數（自動永久保存），也可另存為獨立命名處方：
          </p>
          <button type="button" id="saveFavAsCustomBtn" class="util-pill-btn">➕ 另存新自訂處方</button>
        </div>
      `
      : `
        <div class="editor-meta-row">
          <div class="editor-icon-picker">
            ${PRESET_ICONS.map(
              (ic) => `<button type="button" class="editor-icon-btn ${target.icon === ic ? 'active' : ''}" data-icon="${ic}">${ic}</button>`
            ).join('')}
          </div>
          <input type="text" id="customPresetTitleInput" class="editor-title-input" value="${target.title.replace(/"/g, '&quot;')}" maxlength="20" placeholder="輸入處方名稱（例：加班急救、媽媽睡前）" />
        </div>
      `;

    modal.innerHTML = `
      <div class="ar-modal-card" style="max-width: 560px; background: var(--bg-card); color: var(--ink-dark); padding: 18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px;">
          <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0; font-size:1.05rem;">
            ✏️ ${draftNew ? '建立新的自訂養生處方' : `編輯「${target.title}」`}
          </h3>
          <button type="button" id="closePresetEditorBtn" class="ar-close-btn" style="background:var(--herb-deep);">✓ ${draftNew ? '儲存處方' : '完成'}</button>
        </div>

        ${titleSectionHtml}

        <div id="editorRowsWrap" class="editor-rows-wrap">${rowsHtml}</div>

        <div class="editor-add-row">
          <select id="editorAddPointSelect" class="editor-add-select">
            <option value="">＋ 從 56 穴加入新穴位到本處方…</option>
            ${availableToAdd
              .map((pt) => `<option value="${pt.id}">${pt.name} (${pt.id}) — ${pt.benefits.symptoms.slice(0, 2).join('、')}</option>`)
              .join('')}
          </select>
          <button type="button" id="editorAddPointBtn" class="util-pill-btn">加入</button>
        </div>

        ${
          !target.isFav && !draftNew
            ? `<div style="margin-top:12px; display:flex; justify-content:flex-end;">
                 <button type="button" id="deleteCustomPresetBtn" class="util-pill-btn undo-pain-btn">🗑 刪除此自訂處方</button>
               </div>`
            : ''
        }
      </div>
    `;

    // 關閉／儲存按鈕
    modal.querySelector('#closePresetEditorBtn')?.addEventListener('click', () => {
      if (draftNew) {
        const titleInput = modal.querySelector('#customPresetTitleInput');
        const cleanTitle = (titleInput?.value || '').trim() || '我的專屬養生方';
        if (draftNew.points.length === 0) {
          showToast('⚠️ 請至少加入 1 顆穴位再儲存');
          return;
        }
        draftNew.title = cleanTitle;
        state.customPresets.unshift(draftNew);
        saveCustomPresets();
        state.activePresetId = draftNew.id;
        showToast(`✅ 已建立自訂處方【${draftNew.title}】！`);
      } else if (!target.isFav) {
        const titleInput = modal.querySelector('#customPresetTitleInput');
        if (titleInput && titleInput.value.trim()) {
          target.title = titleInput.value.trim();
        }
        saveCustomPresets();
      }
      modal.classList.remove('open');
      if (onSaved) onSaved(draftNew ? draftNew.id : target.id);
    });

    // 圖示與標題即時更新
    modal.querySelectorAll('.editor-icon-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        target.icon = btn.getAttribute('data-icon');
        if (!draftNew && !target.isFav) saveCustomPresets();
        paintModal();
      });
    });

    modal.querySelector('#customPresetTitleInput')?.addEventListener('input', (e) => {
      target.title = e.target.value;
    });

    // 從收藏另存為自訂處方
    modal.querySelector('#saveFavAsCustomBtn')?.addEventListener('click', () => {
      if (state.favorites.size === 0) {
        showToast('⭐ 請先收藏至少 1 顆穴位');
        return;
      }
      draftNew = {
        id: `custom_${Date.now()}`,
        title: `我的養生方 ${state.customPresets.length + 1}`,
        icon: '🌿',
        points: [...state.favorites]
      };
      editingPresetId = '__new__';
      paintModal();
    });

    // 秒數變更 → 同時寫入 DURATIONS 持久化（修復 P0-5）
    modal.querySelectorAll('.editor-sec-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const pid = sel.getAttribute('data-sec-pid');
        state.playlist.durations[pid] = Number(e.target.value);
        saveDurations();
        showToast(`⏱️ 已儲存「${allPoints.find((p) => p.id === pid)?.name || pid}」按揉時長為 ${e.target.value} 秒`, 1600);
      });
    });

    // 上下排序
    modal.querySelectorAll('.editor-move-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const dir = btn.getAttribute('data-dir');
        const arr = [...target.points];
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= arr.length) return;
        [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
        commitPoints(target, arr);
        paintModal();
        if (!draftNew && onSaved) onSaved(target.id);
      });
    });

    // 刪除單穴
    modal.querySelectorAll('.editor-del-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-del-pid');
        const arr = target.points.filter((id) => id !== pid);
        commitPoints(target, arr);
        paintModal();
        if (!draftNew && onSaved) onSaved(target.id);
      });
    });

    // 新增單穴
    modal.querySelector('#editorAddPointBtn')?.addEventListener('click', () => {
      const sel = modal.querySelector('#editorAddPointSelect');
      const pid = sel?.value;
      if (!pid) return;
      const arr = [...target.points, pid];
      commitPoints(target, arr);
      paintModal();
      if (!draftNew && onSaved) onSaved(target.id);
    });

    // 刪除整組自訂處方
    modal.querySelector('#deleteCustomPresetBtn')?.addEventListener('click', () => {
      state.customPresets = state.customPresets.filter((p) => p.id !== target.id);
      saveCustomPresets();
      if (state.activePresetId === target.id) {
        state.activePresetId = null;
      }
      modal.classList.remove('open');
      showToast(`🗑 已刪除自訂處方「${target.title}」`);
      if (onSaved) onSaved(null);
    });
  };

  paintModal();
  modal.classList.add('open');
}
