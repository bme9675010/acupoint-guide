// 🔗 Deep Link 網址同步 (?p=LI4&v=hand&preset=office) 與一鍵分享給親友
import { state } from './state.js';
import { showToast } from './ui.js';

export function readDeepLinkFromUrl(allPoints, allPresets = []) {
  try {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get('p');
    const view = params.get('v');
    const presetId = params.get('preset');
    const validViews = new Set(['front', 'back', 'head', 'hand', 'foot', 'sole', 'ear', 'child']);

    let targetPoint = null;
    if (pointId) {
      targetPoint = allPoints.find((pt) => pt.id.toUpperCase() === pointId.toUpperCase());
    }
    const targetView = view && validViews.has(view) ? view : null;
    const targetPreset = presetId || null;

    return {
      pointId: targetPoint ? targetPoint.id : null,
      view: targetView,
      presetId: targetPreset
    };
  } catch (_) {
    return { pointId: null, view: null, presetId: null };
  }
}

export function syncUrlWithState() {
  try {
    const url = new URL(window.location.href);
    if (state.selectedPointId) {
      url.searchParams.set('p', state.selectedPointId);
    }
    if (state.currentView) {
      url.searchParams.set('v', state.currentView);
    }
    if (state.activePresetId) {
      url.searchParams.set('preset', state.activePresetId);
    } else {
      url.searchParams.delete('preset');
    }
    window.history.replaceState({ p: state.selectedPointId, v: state.currentView, preset: state.activePresetId }, '', url);
  } catch (_) {}
}

export async function shareAcupointLink(point) {
  if (!point) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('p', point.id);
  shareUrl.searchParams.set('v', state.currentView);
  if (state.activePresetId) {
    shareUrl.searchParams.set('preset', state.activePresetId);
  }

  const shareTitle = `本草尋穴｜${point.name} (${point.id}) 按摩定位與食療`;
  const shareText = `📍【${point.name} (${point.id})】${point.location.quickFind}\n🎯 改善：${point.benefits.symptoms.join('、')}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl.toString()
      });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n👉 ${shareUrl.toString()}`);
    showToast(`📋 已複製「${point.name}」專屬連結！可直接貼給親友`);
  } catch (_) {
    showToast(`🔗 分享網址：${shareUrl.toString()}`);
  }
}

export async function sharePresetLink(preset) {
  if (!preset) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.delete('p');
  shareUrl.searchParams.set('preset', preset.id);

  const shareTitle = `本草尋穴｜${preset.icon} 【${preset.title}】養生穴位處方`;
  const shareText = `🌿 推薦您這套養生對證處方：${preset.subtitle}\n📍 包含穴位：${preset.points.join(' → ')}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl.toString()
      });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n👉 ${shareUrl.toString()}`);
    showToast(`📋 已複製【${preset.title}】處方專屬連結！可直接傳給親友`);
  } catch (_) {
    showToast(`🔗 分享網址：${shareUrl.toString()}`);
  }
}
