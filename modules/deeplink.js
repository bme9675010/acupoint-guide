// 🔗 Deep Link 網址同步 (?p=LI4&v=hand&preset=office-neck 或 ?preset=shared&pts=LI4,PC6&title=...)
import { state } from './state.js';
import { showToast } from './ui.js';

export function readDeepLinkFromUrl(allPoints) {
  try {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get('p');
    const view = params.get('v');
    const presetId = params.get('preset');
    const ptsParam = params.get('pts');
    const titleParam = params.get('title');
    const validViews = new Set(['front', 'back', 'head', 'hand', 'foot', 'sole', 'ear', 'child']);

    let targetPoint = null;
    if (pointId) {
      targetPoint = allPoints.find((pt) => pt.id.toUpperCase() === pointId.toUpperCase());
    }
    const targetView = view && validViews.has(view) ? view : null;

    // 支援親友分享的自訂／收藏處方 (?preset=shared&pts=LI4,PC6,KI1&title=...)
    let sharedPreset = null;
    if (ptsParam) {
      const idMap = new Map(allPoints.map((pt) => [pt.id.toUpperCase(), pt.id]));
      const validIds = ptsParam
        .split(',')
        .map((s) => idMap.get(s.trim().toUpperCase()))
        .filter(Boolean);
      const uniqueIds = [...new Set(validIds)];
      if (uniqueIds.length > 0) {
        const cleanTitle = (titleParam || '親友分享處方').slice(0, 24);
        const names = uniqueIds
          .map((id) => allPoints.find((p) => p.id === id)?.name)
          .filter(Boolean)
          .slice(0, 3)
          .join('＋');
        sharedPreset = {
          id: 'shared_link',
          title: cleanTitle,
          subtitle: `${names}${uniqueIds.length > 3 ? ` 等 ${uniqueIds.length} 穴` : ''}`,
          icon: '💌',
          points: uniqueIds,
          isShared: true
        };
      }
    }

    return {
      pointId: targetPoint ? targetPoint.id : null,
      view: targetView,
      presetId: presetId || null,
      sharedPreset
    };
  } catch (_) {
    return { pointId: null, view: null, presetId: null, sharedPreset: null };
  }
}

export function syncUrlWithState(activePresetObj = null, { push = false } = {}) {
  try {
    const currentHref = window.location.href;
    const url = new URL(currentHref);
    if (state.selectedPointId) {
      url.searchParams.set('p', state.selectedPointId);
    }
    if (state.currentView) {
      url.searchParams.set('v', state.currentView);
    }
    if (state.activePresetId) {
      const isPortableCustom =
        state.activePresetId === 'fav_custom' ||
        state.activePresetId.startsWith('custom_') ||
        state.activePresetId === 'shared_link' ||
        state.activePresetId === 'wizard_temp';
      if (isPortableCustom && activePresetObj?.points?.length) {
        url.searchParams.set('preset', 'shared');
        url.searchParams.set('pts', activePresetObj.points.join(','));
        url.searchParams.set('title', activePresetObj.title || '自訂處方');
      } else if (!isPortableCustom) {
        url.searchParams.set('preset', state.activePresetId);
        url.searchParams.delete('pts');
        url.searchParams.delete('title');
      }
    } else {
      url.searchParams.delete('preset');
      url.searchParams.delete('pts');
      url.searchParams.delete('title');
    }
    const nextHref = url.toString();
    const historyState = { p: state.selectedPointId, v: state.currentView, preset: state.activePresetId };
    if (push && nextHref !== currentHref) {
      window.history.pushState(historyState, '', url);
    } else {
      window.history.replaceState(historyState, '', url);
    }
  } catch (_) {}
}

export async function shareAcupointLink(point) {
  if (!point) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('p', point.id);
  shareUrl.searchParams.set('v', state.currentView);
  shareUrl.searchParams.delete('preset');
  shareUrl.searchParams.delete('pts');
  shareUrl.searchParams.delete('title');

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

export async function sharePresetLink(preset, allPoints = []) {
  if (!preset || !preset.points?.length) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.delete('p');
  shareUrl.searchParams.delete('v');

  const isCustomOrLocal =
    preset.id === 'fav_custom' ||
    preset.id.startsWith('custom_') ||
    preset.id === 'shared_link' ||
    preset.id === 'wizard_temp';

  if (isCustomOrLocal) {
    shareUrl.searchParams.set('preset', 'shared');
    shareUrl.searchParams.set('pts', preset.points.join(','));
    shareUrl.searchParams.set('title', preset.title);
  } else {
    shareUrl.searchParams.set('preset', preset.id);
    shareUrl.searchParams.delete('pts');
    shareUrl.searchParams.delete('title');
  }

  const pointNames = preset.points
    .map((id) => allPoints.find((p) => p.id === id)?.name || id)
    .join(' → ');

  const shareTitle = `本草尋穴｜${preset.icon} 【${preset.title}】養生穴位處方`;
  const shareText = `🌿 推薦您這套養生對證處方：${preset.subtitle}\n📍 包含穴位：${pointNames}`;

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
    showToast(`📋 已複製【${preset.title}】處方專屬連結！親友點開即可直接跟練`);
  } catch (_) {
    showToast(`🔗 分享網址：${shareUrl.toString()}`);
  }
}
