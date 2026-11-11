// ✏️ 收藏處方順序與單穴秒數自訂編輯器
import { state } from './state.js';
import { saveFavorites, saveCustomPresets } from './storage.js';
import { showToast } from './ui.js';

export function renderPresetEditorModal(allPoints, onSaved) {
  let modal = document.getElementById('presetEditorModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'presetEditorModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '編輯我的收藏處方順序與秒數');
    document.body.appendChild(modal);
  }

  const favIds = [...state.favorites];
  const durations = state.playlist.durations || {};

  if (favIds.length === 0) {
    showToast('⭐ 請先點擊穴位右上角的「☆ 收藏」，即可自訂處方順序與秒數！');
    return;
  }

  const renderRows = () => {
    const currentFavs = [...state.favorites];
    return currentFavs
      .map((pid, idx) => {
        const pt = allPoints.find((p) => p.id === pid);
        const defaultSec = pt?.massageGuide?.rhythm?.totalDurationSec || 60;
        const sec = durations[pid] || defaultSec;
        return `
          <div class="editor-item-row" data-pid="${pid}">
            <span class="editor-step-num">${idx + 1}.</span>
            <strong class="editor-pt-name">${pt ? pt.name : pid} <small>(${pid})</small></strong>
            <label class="editor-sec-label">
              秒數
              <select class="editor-sec-select" data-sec-pid="${pid}">
                ${[30, 45, 60, 90, 120]
                  .map((s) => `<option value="${s}" ${s === sec ? 'selected' : ''}>${s}秒</option>`)
                  .join('')}
              </select>
            </label>
            <div class="editor-row-btns">
              <button type="button" class="editor-move-btn" data-dir="up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>↑</button>
              <button type="button" class="editor-move-btn" data-dir="down" data-idx="${idx}" ${idx === currentFavs.length - 1 ? 'disabled' : ''}>↓</button>
              <button type="button" class="editor-del-btn" data-del-pid="${pid}">✕</button>
            </div>
          </div>
        `;
      })
      .join('');
  };

  const paintModal = () => {
    modal.innerHTML = `
      <div class="ar-modal-card" style="max-width: 520px; background: var(--bg-card); color: var(--ink-dark); padding: 18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0;">
            ✏️ 編輯「我的收藏處方」順序與秒數
          </h3>
          <button type="button" id="closePresetEditorBtn" class="ar-close-btn" style="background:var(--cinnabar);">✕ 完成</button>
        </div>
        <p style="font-size:0.84rem; color:var(--ink-muted); margin-bottom:12px;">
          可自由上下調整連續跟練順序，並設定每一穴的專屬按揉秒數：
        </p>
        <div id="editorRowsWrap" class="editor-rows-wrap">${renderRows()}</div>
      </div>
    `;

    modal.querySelector('#closePresetEditorBtn')?.addEventListener('click', () => {
      modal.classList.remove('open');
      if (onSaved) onSaved();
    });

    modal.querySelectorAll('.editor-sec-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const pid = sel.getAttribute('data-sec-pid');
        state.playlist.durations[pid] = Number(e.target.value);
        saveCustomPresets();
      });
    });

    modal.querySelectorAll('.editor-move-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const dir = btn.getAttribute('data-dir');
        const arr = [...state.favorites];
        const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= arr.length) return;
        [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
        state.favorites = new Set(arr);
        saveFavorites();
        paintModal();
        if (onSaved) onSaved();
      });
    });

    modal.querySelectorAll('.editor-del-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-del-pid');
        state.favorites.delete(pid);
        saveFavorites();
        if (state.favorites.size === 0) {
          modal.classList.remove('open');
        } else {
          paintModal();
        }
        if (onSaved) onSaved();
      });
    });
  };

  paintModal();
  modal.classList.add('open');
}
