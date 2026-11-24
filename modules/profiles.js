// 👨‍👩‍👧‍👦 多家庭成員檔案管理彈窗（獨立收藏、打卡體質熱力圖、筆記、孕期安全鎖與字體設定，P2-1）
import {
  getProfiles,
  getActiveProfileId,
  setActiveProfileId,
  createProfile,
  renameProfile,
  deleteProfile,
  loadPersistedData
} from './storage.js';
import { escapeHtml, showToast } from './ui.js';

const ROLE_META = {
  adult: { icon: '👤', label: '成人保養', desc: '標準字體・標準節奏' },
  child: { icon: '👶', label: '寶寶 / 小孩', desc: '柔和節奏・切換後建議小兒推拿視圖' },
  elder: { icon: '👵', label: '家中長輩', desc: '自動啟用大字模式・柔和節奏' },
  pregnant: { icon: '🤰', label: '孕期媽咪', desc: '自動開啟孕期安全鎖・避開禁穴' }
};

export function openProfilesModal(onProfileChanged) {
  let modal = document.getElementById('profilesModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profilesModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '切換或管理家庭成員檔案');
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  let selectedNewRole = 'child';

  const paint = () => {
    const profiles = getProfiles();
    const activeId = getActiveProfileId();

    const listHtml = profiles
      .map((p) => {
        const isActive = p.id === activeId;
        const meta = ROLE_META[p.role] || ROLE_META.adult;
        return `
          <div class="profile-item-card ${isActive ? 'active' : ''}">
            <button type="button" class="profile-select-area" data-switch-prof="${escapeHtml(p.id)}">
              <span class="profile-avatar">${escapeHtml(p.icon || meta.icon)}</span>
              <div class="profile-info">
                <strong>${escapeHtml(p.name)} ${isActive ? '<span class="profile-active-tag">目前使用中</span>' : ''}</strong>
                <span>${escapeHtml(meta.label)}・${escapeHtml(meta.desc)}</span>
              </div>
            </button>
            <div class="profile-item-actions">
              <button type="button" class="editor-move-btn" data-rename-prof="${escapeHtml(p.id)}" title="修改名稱">✏️</button>
              ${
                p.id !== 'default'
                  ? `<button type="button" class="editor-del-btn" data-del-prof="${escapeHtml(p.id)}" title="刪除此成員與其本機紀錄">✕</button>`
                  : ''
              }
            </div>
          </div>
        `;
      })
      .join('');

    modal.innerHTML = `
      <div class="ar-modal-card settings-modal-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px;">
          <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0; font-size:1.08rem;">
            👨‍👩‍👧‍👦 家庭成員獨立檔案
          </h3>
          <button type="button" id="closeProfilesBtn" class="ar-close-btn">✕ 關閉</button>
        </div>

        <p style="font-size:0.8rem; color:var(--ink-muted); margin:0 0 12px; line-height:1.45;">
          每位家人擁有各自獨立的「收藏處方、按後體質熱力圖、單穴筆記、孕期安全鎖與字體大小」，互不干擾。
        </p>

        <div class="profile-list-wrap">${listHtml}</div>

        <div class="settings-section" style="margin-top:12px;">
          <strong style="font-size:0.88rem; color:var(--herb-deep);">➕ 新增家庭成員（自動套用專屬設定）</strong>
          <div class="profile-role-pills">
            ${Object.entries(ROLE_META)
              .map(
                ([roleKey, m]) => `
                <button type="button" class="wizard-chip ${selectedNewRole === roleKey ? 'active' : ''}" data-new-role="${roleKey}">
                  ${m.icon} ${m.label}
                </button>
              `
              )
              .join('')}
          </div>
          <div class="editor-add-row" style="margin-top:8px;">
            <input type="text" id="newProfileNameInput" class="editor-title-input" maxlength="14" placeholder="輸入稱呼（例：小寶、媽媽、阿公）" />
            <button type="button" id="confirmAddProfileBtn" class="btn-primary-timer" style="padding:8px 16px; white-space:nowrap;">建立並切換</button>
          </div>
        </div>
      </div>
    `;

    modal.querySelector('#closeProfilesBtn')?.addEventListener('click', () => modal.classList.remove('open'));

    modal.querySelectorAll('[data-switch-prof]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-switch-prof');
        if (!pid) return;
        setActiveProfileId(pid);
        loadPersistedData();
        const prof = getProfiles().find((x) => x.id === pid);
        modal.classList.remove('open');
        showToast(`${prof?.icon || '👤'} 已切換至「${prof?.name || '成員'}」的獨立檔案`);
        if (onProfileChanged) onProfileChanged(prof);
      });
    });

    modal.querySelectorAll('[data-rename-prof]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-rename-prof');
        const cur = getProfiles().find((x) => x.id === pid);
        const nextName = window.prompt('輸入新的成員稱呼（最多 14 字）：', cur?.name || '');
        if (nextName && nextName.trim()) {
          renameProfile(pid, nextName.trim());
          paint();
          if (pid === getActiveProfileId() && onProfileChanged) {
            onProfileChanged(getProfiles().find((x) => x.id === pid));
          }
        }
      });
    });

    modal.querySelectorAll('[data-del-prof]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-del-prof');
        const cur = getProfiles().find((x) => x.id === pid);
        if (!window.confirm(`確定刪除成員「${cur?.name}」及其所有本機打卡與收藏紀錄嗎？`)) return;
        const wasActive = pid === getActiveProfileId();
        deleteProfile(pid);
        if (wasActive) {
          loadPersistedData();
          if (onProfileChanged) onProfileChanged(getProfiles()[0]);
        }
        paint();
        showToast(`🗑 已刪除成員「${cur?.name}」`);
      });
    });

    modal.querySelectorAll('[data-new-role]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedNewRole = btn.getAttribute('data-new-role') || 'adult';
        paint();
      });
    });

    modal.querySelector('#confirmAddProfileBtn')?.addEventListener('click', () => {
      const input = modal.querySelector('#newProfileNameInput');
      const meta = ROLE_META[selectedNewRole] || ROLE_META.adult;
      const name = (input?.value || '').trim() || meta.label;
      const created = createProfile({ name, icon: meta.icon, role: selectedNewRole });
      setActiveProfileId(created.id);
      loadPersistedData();
      modal.classList.remove('open');
      showToast(`${created.icon} 已建立並切換至「${created.name}」檔案！`);
      if (onProfileChanged) onProfileChanged(created);
    });
  };

  paint();
  modal.classList.add('open');
}
