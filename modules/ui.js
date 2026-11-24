// 🔔 輕量 Toast 通知、HTML 跳脫防護與全站彈窗捲動鎖定輔助
let toastTimer = null;

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function showToast(message, durationMs = 2800) {
  let el = document.getElementById('appToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'appToast';
    el.className = 'app-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('visible');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('visible');
  }, durationMs);
}

// 🔒 全站彈窗開啟時鎖定背景 body 捲動（防止 iOS Scroll Bleed，P0-2）
let modalLockObserver = null;

export function syncBodyModalLock() {
  if (typeof document === 'undefined' || !document.body) return;
  const hasOpenModal = !!document.querySelector('.ar-modal.open, .zen-modal.open');
  document.body.classList.toggle('modal-open', hasOpenModal);
}

export function initModalScrollLock() {
  if (typeof document === 'undefined' || !document.body || modalLockObserver) return;
  modalLockObserver = new MutationObserver(() => syncBodyModalLock());
  modalLockObserver.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class']
  });
  syncBodyModalLock();
}
