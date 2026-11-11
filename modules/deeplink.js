// 🔗 Deep Link 網址同步 (?p=LI4&v=hand) 與一鍵分享給親友
import { state } from './state.js';
import { showToast } from './ui.js';

export function readDeepLinkFromUrl(allPoints) {
  try {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get('p');
    const view = params.get('v');
    const validViews = new Set(['front', 'back', 'head', 'hand', 'foot', 'sole', 'ear']);

    let targetPoint = null;
    if (pointId) {
      targetPoint = allPoints.find((pt) => pt.id.toUpperCase() === pointId.toUpperCase());
    }
    const targetView = view && validViews.has(view) ? view : null;
    return {
      pointId: targetPoint ? targetPoint.id : null,
      view: targetView
    };
  } catch (_) {
    return { pointId: null, view: null };
  }
}

export function syncUrlWithState() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('p', state.selectedPointId);
    url.searchParams.set('v', state.currentView);
    window.history.replaceState({ p: state.selectedPointId, v: state.currentView }, '', url);
  } catch (_) {}
}

export async function shareAcupointLink(point) {
  if (!point) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('p', point.id);
  shareUrl.searchParams.set('v', state.currentView);

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
