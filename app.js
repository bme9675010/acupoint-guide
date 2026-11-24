import {
  ACUPOINTS,
  SYMPTOM_PRESETS,
  ZIWU_LIUZHU,
  DIETARY_THERAPY,
  ZIWU_DIET,
  EAR_SYNONYMS,
  CHILD_SYNONYMS,
  getCurrentSolarTerm,
  getCloseupSvgMarkup
} from './data/index.js';
import { AR_SUPPORTED_POINTS, openArModal, closeArModal, isArModalOpen, initArControls } from './arFinder.js';
import { state, COLLOQUIAL_SYNONYMS } from './modules/state.js';
import { speakGuide } from './modules/audio.js';
import { getBaseBodySvgMarkup } from './modules/bodySvg.js';
import { loadPersistedData, saveFavorites, savePainLogs, savePointNotes, saveCustomPresets, saveSettings, exportBackup, importBackup } from './modules/storage.js';
import { showToast, escapeHtml } from './modules/ui.js';
import { readDeepLinkFromUrl, syncUrlWithState, shareAcupointLink, sharePresetLink } from './modules/deeplink.js';
import {
  initCanvasGestures,
  setCurrentViewBox,
  resetViewBoxTransform,
  wasDraggingCanvas,
  bindNodeKeyboardEvents
} from './modules/gestures.js';
import { initThemeListener, cycleThemeMode } from './modules/theme.js';
import {
  toggleDailyReminder,
  startReminderScheduler,
  setReminderTime,
  downloadCalendarReminderIcs,
  updateReminderUI
} from './modules/reminder.js';
import { buildMeridianHeatmapHtml } from './modules/heatmap.js';
import { renderPresetEditorModal } from './modules/presetEditor.js';
import { POSTURE_SCENARIOS } from './modules/posture.js';
import { getArPackStatus, preloadArPack, registerServiceWorkerWithUpdates } from './modules/offline.js';
import { initVoiceAndKeyboardControls, toggleVoiceControl } from './modules/voiceControl.js';
import {
  initTimerDeps,
  toggleTimer,
  stopAndResetTimer,
  triggerManualSwitchSide,
  formatTime,
  getEffectiveRhythm
} from './modules/timer.js';
import { openSymptomWizardModal } from './modules/wizard.js';
import { openDirectoryModal } from './modules/directory.js';
import { exportConstitutionReportCard } from './modules/reportCard.js';
import { getConfusionGroupForPoint, openPointCompareModal } from './modules/compare.js';
import { openZenMode, refreshZenModePoint, closeZenMode } from './modules/zenMode.js';

// 暫存由親友分享連結或 3 題問診精靈產生的即時處方
let sharedTempPreset = null;
let wizardTempPreset = null;
let isMobileViewingInspector = false;

function updateMobileJumpFabUI() {
  const fab = document.getElementById('mobileJumpFab');
  if (!fab) return;
  const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
  if (isMobileViewingInspector) {
    fab.textContent = '👆 返回人體穴位圖';
    fab.classList.add('back-top');
  } else {
    fab.textContent = `👇 查看「${pt ? pt.name : '本穴'}」找穴與跟練`;
    fab.classList.remove('back-top');
  }
}

// 動態更新畫布底部保健參考免責與視圖安全提醒（P1-2）
function updateSafetyDisclaimerUI() {
  const bar = document.getElementById('safetyDisclaimerBar');
  if (!bar) return;
  const viewNotices = {
    sole: '🦶 足底反射區屬日常保健放鬆參考，非醫療診斷或治療；飯後 1 小時內、皮膚破皮、孕期或嚴重糖尿病足切忌強力刮壓。',
    ear: '👂 耳穴全息圖屬日常養生參考，非醫療診斷；按壓時請使用圓潤指腹或耳豆輕壓，避免尖銳物刮傷耳軟骨發炎。',
    child: '👶 小兒推拿特定穴主要適用於 0–6 歲嬰幼兒（7–18 歲適用轉骨／護眼穴）；操作前務必塗抹乳液潤滑、手法輕快柔和，發高燒不退或精神萎靡請立即就醫。'
  };
  bar.textContent =
    viewNotices[state.currentView] ||
    'ℹ️ 本圖鑑屬日常經絡保健參考，非醫療診斷或治療；急性劇痛、外傷腫脹或慢性病請諮詢專業中／西醫師。';
}

// 繪製當前選中穴位的「同經絡流光連線」（P2-3 + P1-4 修正正面手陽明大腸經折點不斜切人臉）
function buildSameMeridianFlowSvg(selectedPt, currentView) {
  if (!selectedPt || !selectedPt.meridian) return '';
  if (
    ['sole', 'ear'].includes(currentView) ||
    selectedPt.meridian.includes('奇穴') ||
    selectedPt.meridian.includes('反射') ||
    selectedPt.meridian.includes('耳穴')
  ) {
    return '';
  }

  const sameMeridianPts = ACUPOINTS.filter(
    (pt) => pt.meridian === selectedPt.meridian && pt.views[currentView]
  ).sort((a, b) => a.views[currentView].y - b.views[currentView].y);

  if (sameMeridianPts.length < 2) return '';

  const buildPath = (coords) =>
    coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  let mainCoords = sameMeridianPts.map((pt) => ({ ...pt.views[currentView], id: pt.id }));

  // 正面「手陽明大腸經」循行：迎香(鼻翼) → 頸側 → 肩髃 → 曲池(手肘) → 合谷(虎口)，避免直線斜穿過臉頰
  if (currentView === 'front' && selectedPt.meridian === '手陽明大腸經') {
    const li20Idx = mainCoords.findIndex((c) => c.id === 'LI20');
    const li11Idx = mainCoords.findIndex((c) => c.id === 'LI11');
    if (li20Idx !== -1 && li11Idx === li20Idx + 1) {
      mainCoords.splice(li11Idx, 0, { x: 178, y: 114 }, { x: 142, y: 152 });
    }
  }

  let paths = `<path class="meridian-flow-line" d="${buildPath(mainCoords)}" />`;

  // 若為左右對稱全身視圖且此經絡非正中單線，也繪製對稱側流光線
  const isSymmetricView = ['front', 'back', 'head'].includes(currentView);
  const hasOffCenter = mainCoords.some((c) => Math.abs(c.x - 200) > 4);
  if (isSymmetricView && hasOffCenter) {
    const mirrorCoords = mainCoords.map((c) => ({ x: 400 - c.x, y: c.y }));
    paths += `<path class="meridian-flow-line mirror" d="${buildPath(mirrorCoords)}" />`;
  }

  return `<g class="meridian-flow-layer" aria-hidden="true">${paths}</g>`;
}

// 渲染人體 SVG 與穴位點
function renderBodyCanvas() {
  const svg = document.getElementById('bodySvg');
  if (!svg) return;

  const baseMarkup = getBaseBodySvgMarkup(state.currentView, state.xrayOpacity);
  const selectedPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
  const meridianFlowMarkup = buildSameMeridianFlowSvg(selectedPt, state.currentView);
  const nodesMarkup = [];

  ACUPOINTS.forEach((pt) => {
    const coord = pt.views[state.currentView];
    if (!coord) return;

    const isSelected = state.selectedPointId === pt.id;
    const isHighlighted = state.highlightedIds.has(pt.id);
    const hasActiveFilter = state.highlightedIds.size > 0;
    const isDimmed = hasActiveFilter && !isHighlighted && !isSelected;
    const isPregnancyForbidden = state.pregnancySafeMode && pt.contraindications.pregnancyForbidden;

    const statusClass = [
      'acupoint-node',
      isSelected ? 'selected' : '',
      isHighlighted ? 'highlighted' : '',
      isDimmed ? 'dimmed' : '',
      isPregnancyForbidden ? 'pregnancy-forbidden' : ''
    ].filter(Boolean).join(' ');

    const labelOnRight = coord.x > 210;
    const labelX = labelOnRight ? coord.x + 12 : coord.x - 12;
    const labelAnchor = labelOnRight ? 'start' : 'end';
    let shortName = pt.name;
    if (pt.id === 'REFLEX-LIVER') shortName = '右腳：肝膽區';
    if (pt.id === 'REFLEX-HEART') shortName = '左腳：心脾區';
    const displayLabel = isPregnancyForbidden ? `🚫${shortName}` : shortName;

    nodesMarkup.push(`
      <g class="${statusClass}" data-point-id="${pt.id}" role="button" tabindex="0" aria-label="${pt.name} (${pt.id})">
        <circle class="acupoint-pulse" cx="${coord.x}" cy="${coord.y}" r="11" />
        <circle class="acupoint-core" cx="${coord.x}" cy="${coord.y}" r="6.5" />
        <text class="acupoint-label" x="${labelX}" y="${coord.y + 4}" text-anchor="${labelAnchor}">${displayLabel}</text>
      </g>
    `);

    // 正面、背面、頭面部與足底特寫視圖繪製左右對稱鏡像點（正中線 x=200 單穴及左右腳單側專屬區除外）
    if (!pt.asymmetric && ['front', 'back', 'head', 'sole'].includes(state.currentView) && Math.abs(coord.x - 200) > 4) {
      const mirrorX = 400 - coord.x;
      nodesMarkup.push(`
        <g class="${statusClass}" data-point-id="${pt.id}" aria-hidden="true">
          <circle class="acupoint-pulse" cx="${mirrorX}" cy="${coord.y}" r="11" />
          <circle class="acupoint-core" cx="${mirrorX}" cy="${coord.y}" r="6" />
        </g>
      `);
    }
  });

  svg.innerHTML = baseMarkup + meridianFlowMarkup + `<g class="acupoints-layer">${nodesMarkup.join('')}</g>`;

  svg.querySelectorAll('.acupoint-node, .reflex-zone-poly').forEach((node) => {
    node.addEventListener('click', () => {
      if (wasDraggingCanvas()) return;
      const pointId = node.getAttribute('data-point-id');
      if (pointId) selectAcupoint(pointId, true);
    });
  });

  bindNodeKeyboardEvents(svg, (pointId) => selectAcupoint(pointId, true));
  updateSafetyDisclaimerUI();
}

// 選取穴位並更新右側教學面板（支援 popstate 歷史同步 + 手機版浮動導引 + 全螢幕 Zen Mode 同步）
function selectAcupoint(pointId, autoSwitchViewIfNeeded = false, keepTimerIfPlaylist = false, { pushHistory = true } = {}) {
  const point = ACUPOINTS.find((p) => p.id === pointId);
  if (!point) return;

  state.selectedPointId = point.id;

  // 若當前視圖沒有這個穴位，優先切換到局部特寫視圖或正反面視圖
  if (autoSwitchViewIfNeeded && !point.views[state.currentView]) {
    const preferredOrder = ['child', 'ear', 'sole', 'head', 'hand', 'foot', 'front', 'back'];
    const availableView = preferredOrder.find((v) => v in point.views) || Object.keys(point.views)[0];
    if (availableView) {
      state.currentView = availableView;
      updateViewTabButtons();
    }
  }

  if (!keepTimerIfPlaylist) {
    if (state.playlist.isPlaying) {
      state.playlist.isPlaying = false;
    }
    stopAndResetTimer();
  }
  renderBodyCanvas();
  applySvgZoomForPoint(point);
  renderInspector(point);
  updatePlaylistBannerUI();
  updateMobileJumpFabUI();
  refreshZenModePoint();
  const activePresetObj = getAllPresets().find((p) => p.id === state.activePresetId) || null;
  syncUrlWithState(activePresetObj, { push: pushHistory });
}

// 針對選中穴位自動將全身畫布局部放大聚焦
function applySvgZoomForPoint(point) {
  const svg = document.getElementById('bodySvg');
  if (!svg) return;

  const coord = point?.views[state.currentView];
  // 特寫視圖 (head / hand / foot / sole / ear / child) 本身已經是放大圖，不需再裁切 viewBox
  if (!state.autoZoomEnabled || !coord || ['head', 'hand', 'foot', 'sole', 'ear', 'child'].includes(state.currentView)) {
    resetViewBoxTransform();
    return;
  }

  const zoomW = 180;
  const zoomH = 306;
  const minX = Math.max(0, Math.min(400 - zoomW, coord.x - zoomW / 2));
  const minY = Math.max(0, Math.min(680 - zoomH, coord.y - zoomH / 2));

  setCurrentViewBox(minX, minY, zoomW, zoomH);
}

function resetSvgZoom() {
  resetViewBoxTransform();
}

// 更新收藏按鈕狀態
function updateFavButtonUI(pointId) {
  const favBtn = document.getElementById('favPointBtn');
  if (!favBtn) return;
  const isFav = state.favorites.has(pointId);
  favBtn.textContent = isFav ? '⭐ 已收藏' : '☆ 收藏';
  favBtn.classList.toggle('active', isFav);
}

// 計算真實連續打卡天數（以使用者當地時區之日曆天為準）
function calculateStreakDays(logs) {
  if (!logs || logs.length === 0) return 0;
  const daySet = new Set(
    logs.map((log) => {
      const d = new Date(log.timestamp);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${date}`;
    })
  );

  const now = new Date();
  const formatD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${date}`;
  };

  const todayStr = formatD(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatD(yesterday);

  let currentCheck = new Date(now);
  // 若今日尚未打卡，但昨日有打卡，從昨日往前回溯計算以保留 Streak
  if (!daySet.has(todayStr)) {
    if (daySet.has(yesterdayStr)) {
      currentCheck = yesterday;
    } else {
      return 0;
    }
  }

  let streak = 0;
  while (true) {
    const dateStr = formatD(currentCheck);
    if (daySet.has(dateStr)) {
      streak += 1;
      currentCheck.setDate(currentCheck.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// 渲染「按後痛感體質自我檢測紀錄」與打卡統計
function updatePainLogAndConstitutionUI() {
  const countEl = document.getElementById('totalLogsCount');
  if (countEl) {
    countEl.textContent = String(state.painLogs.length);
  }

  const streak = calculateStreakDays(state.painLogs);
  const streakDaysText = document.getElementById('streakDaysText');
  if (streakDaysText) {
    streakDaysText.textContent = streak > 0 ? `🔥 連續 ${streak} 天` : '🌱 今日尚未打卡';
  }
  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    streakBadge.title = `已連續打卡 ${streak} 天・累計 ${state.painLogs.length} 次手感紀錄`;
  }

  const hasLogs = state.painLogs.length > 0;
  ['undoPainLogBtn', 'openPainHistoryBtn', 'exportReportCardBtn'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = hasLogs ? 'inline-block' : 'none';
  });

  const pointLogs = state.painLogs.filter((item) => item.pointId === state.selectedPointId);
  const latestForPoint = pointLogs.length > 0 ? pointLogs[pointLogs.length - 1] : null;
  document.querySelectorAll('.pain-log-btn').forEach((btn) => {
    btn.classList.toggle('active', latestForPoint && btn.getAttribute('data-pain') === latestForPoint.painType);
  });

  const insightEl = document.getElementById('constitutionInsight');
  if (!insightEl) return;

  if (state.painLogs.length === 0) {
    insightEl.style.display = 'none';
    return;
  }

  // 統計各經絡「劇烈痠痛(氣滯不通)」與「空軟無力(氣血偏虛)」次數
  const sharpMeridians = {};
  const emptyMeridians = {};
  let smoothCount = 0;

  state.painLogs.forEach((log) => {
    if (log.painType === 'sharp') {
      sharpMeridians[log.meridian] = (sharpMeridians[log.meridian] || 0) + 1;
    } else if (log.painType === 'empty') {
      emptyMeridians[log.meridian] = (emptyMeridians[log.meridian] || 0) + 1;
    } else {
      smoothCount += 1;
    }
  });

  const topSharp = Object.entries(sharpMeridians).sort((a, b) => b[1] - a[1])[0];
  const topEmpty = Object.entries(emptyMeridians).sort((a, b) => b[1] - a[1])[0];

  const lines = [];
  if (latestForPoint) {
    const labelMap = {
      smooth: '😌 微痠舒暢（經氣通暢）',
      sharp: '⚡ 劇烈痠痛（氣滯瘀堵，建議熱敷並放輕力道）',
      empty: '☁️ 空軟無力（氣血偏虛，宜用指腹輕柔久按補氣）'
    };
    lines.push(`<strong>本穴最新手感：</strong>${labelMap[latestForPoint.painType]}`);

    const diet = DIETARY_THERAPY[state.selectedPointId];
    if (diet && diet.byPainType[latestForPoint.painType]) {
      lines.push(`🍵 <strong>專屬對證食療：</strong>${diet.byPainType[latestForPoint.painType]}`);
    }
  }

  if (topSharp) {
    lines.push(`🔥 <strong>近期易堵經絡：</strong>【${topSharp[0]}】（累計 ${topSharp[1]} 次痠脹刺痛，中醫所謂「不通則痛」，日常可多推揉該經絡疏通氣機）`);
  }
  if (topEmpty) {
    lines.push(`🌿 <strong>需溫養經絡：</strong>【${topEmpty[0]}】（累計 ${topEmpty[1]} 次按之空軟，中醫所謂「不榮則痛」，宜早睡並配合溫水泡腳養血）`);
  }
  if (!topSharp && !topEmpty && smoothCount > 0) {
    lines.push(`✨ <strong>整體經絡狀態：</strong>近期打卡 ${smoothCount} 次皆為「微痠舒暢」，代表周身氣血運行相當平順！`);
  }

  lines.push(`<button type="button" id="jumpToDietTabBtn" class="pairing-Jump-btn" style="margin-top:6px;">🍵 查看本穴 3 分鐘茶飲＆超商外食清單 →</button>`);

  const heatmapHtml = buildMeridianHeatmapHtml(state.painLogs);
  insightEl.innerHTML = lines.join('<br/>') + heatmapHtml;
  insightEl.style.display = 'block';

  document.getElementById('jumpToDietTabBtn')?.addEventListener('click', () => {
    switchDetailTab('tab-diet');
  });
}

// 渲染分頁 4：🍵 本草食療專區
function renderDietaryTherapy(point) {
  const diet = DIETARY_THERAPY[point.id];
  if (!diet) return;

  const teaNameEl = document.getElementById('dietTeaName');
  const ingEl = document.getElementById('dietIngredients');
  const effEl = document.getElementById('dietEffect');
  const pregBox = document.getElementById('dietPregnancyNote');
  const cvsEl = document.getElementById('dietCvsOption');
  const byPainEl = document.getElementById('dietByPainList');
  const avoidEl = document.getElementById('dietAvoidText');

  if (teaNameEl) teaNameEl.textContent = diet.teaName;
  if (ingEl) ingEl.textContent = `🫖 沖泡配方：${diet.ingredients}`;
  if (effEl) effEl.textContent = `✨ 協同功效：${diet.effect}`;
  if (cvsEl) cvsEl.textContent = diet.cvsOption;
  if (avoidEl) avoidEl.textContent = diet.avoid;

  if (pregBox) {
    if (state.pregnancySafeMode || point.contraindications.pregnancyForbidden) {
      pregBox.style.display = 'block';
      pregBox.textContent = diet.pregnancySafeAlt;
    } else {
      pregBox.style.display = 'none';
    }
  }

  // 取得該穴位最新按後痛感紀錄（預設高亮 smooth 或最新打卡項目）
  const pointLogs = state.painLogs.filter((item) => item.pointId === point.id);
  const activePainType = pointLogs.length > 0 ? pointLogs[pointLogs.length - 1].painType : null;

  if (byPainEl && diet.byPainType) {
    const order = ['sharp', 'empty', 'smooth'];
    byPainEl.innerHTML = order
      .map((type) => {
        const isMatched = activePainType === type;
        return `
          <div class="diet-by-pain-item ${isMatched ? 'matched' : ''}" data-pain-item="${type}">
            ${isMatched ? '<span class="diet-badge" style="margin-right:6px;">✓ 您的最新打卡體質</span>' : ''}
            ${diet.byPainType[type]}
          </div>
        `;
      })
      .join('');
  }

  // 更新當下時辰子午流注當令飲品
  const hour = new Date().getHours();
  const currentZiwu = ZIWU_LIUZHU.find((item) => {
    if (item.startHour === 23) return hour >= 23 || hour < 1;
    return hour >= item.startHour && hour < item.endHour;
  }) || ZIWU_LIUZHU[0];
  const ziwuDiet = ZIWU_DIET[currentZiwu.zhi];

  if (ziwuDiet) {
    const zTitle = document.getElementById('dietZiwuTitle');
    const zDrink = document.getElementById('dietZiwuDrink');
    const zCvs = document.getElementById('dietZiwuCvs');
    const zAvoid = document.getElementById('dietZiwuAvoid');
    if (zTitle) zTitle.textContent = `⏳ 當下【${currentZiwu.zhi}・${currentZiwu.meridian}】當令養生飲`;
    if (zDrink) zDrink.textContent = `🍵 當令宜飲：${ziwuDiet.drink}`;
    if (zCvs) zCvs.textContent = `🏪 超商可買：${ziwuDiet.cvs}`;
    if (zAvoid) zAvoid.textContent = `⚠️ 時辰忌口：${ziwuDiet.avoid}`;
  }

  // 更新當令二十四節氣養生食療
  const termData = getCurrentSolarTerm();
  if (termData && termData.current) {
    const term = termData.current;
    const sBadge = document.getElementById('dietSolarBadge');
    const sTitle = document.getElementById('dietSolarTitle');
    const sEssence = document.getElementById('dietSolarEssence');
    const sDrink = document.getElementById('dietSolarDrink');
    const sCvs = document.getElementById('dietSolarCvs');
    const sAvoid = document.getElementById('dietSolarAvoid');

    if (sBadge) sBadge.textContent = `📅 當令節氣・${term.season}`;
    if (sTitle) sTitle.textContent = `【${term.name}】${term.slogan}・本草養生`;
    if (sEssence) sEssence.textContent = term.essence;
    if (sDrink) sDrink.textContent = `🫖 節氣專屬：${term.tea.name}（${term.tea.recipe}・${term.tea.effect}）`;
    if (sCvs) sCvs.textContent = `🏪 超商替代：${term.tea.cvsOption}`;
    if (sAvoid) sAvoid.textContent = `🚫 節氣忌口：${term.tea.avoid}`;

    const jumpBtn = document.getElementById('solarTermJumpBtn');
    if (jumpBtn) {
      const recNames = term.recommendedPointIds
        .map((id) => ACUPOINTS.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join('、');
      jumpBtn.textContent = `🌿 一鍵標記當令【${term.name}】推薦穴位（${recNames}）→`;
    }
  }
}

function recordPainSensation(painType) {
  const point = ACUPOINTS.find((p) => p.id === state.selectedPointId);
  if (!point) return;

  state.painLogs.push({
    pointId: point.id,
    pointName: point.name,
    meridian: point.meridian,
    painType,
    timestamp: Date.now()
  });

  savePainLogs();
  updatePainLogAndConstitutionUI();
  renderDietaryTherapy(point);
}

// 更新右側詳情面板內容
function renderInspector(point) {
  document.getElementById('pointName').textContent = point.name;
  document.getElementById('pointCode').textContent = point.id;
  document.getElementById('pointPinyin').textContent = point.pinyin;
  document.getElementById('pointMeridian').textContent = point.meridian;
  document.getElementById('pointAttr').textContent = point.attribute;

  const sideBadge = document.getElementById('pointSideBadge');
  if (sideBadge) {
    const midlineIds = new Set(['GV20', 'EX-HN3', 'CV17', 'CV12', 'CV6', 'GV14']);
    if (point.id.startsWith('PED-')) {
      sideBadge.textContent = '👶 小兒推拿特定穴（手法宜輕快柔和・塗乳液防破皮）';
      sideBadge.style.background = 'rgba(42, 115, 82, 0.16)';
      sideBadge.style.color = '#1D4734';
    } else if (point.id === 'GB39') {
      sideBadge.textContent = '🌱 青少年轉骨長高要穴（八會穴之髓會・雙側皆可按）';
      sideBadge.style.background = 'rgba(196, 137, 59, 0.2)';
      sideBadge.style.color = '#7A4F13';
    } else if (point.id === 'ST2') {
      sideBadge.textContent = '👀 學生護眼操核心穴（雙側眼眶眶下孔・輕柔按揉）';
      sideBadge.style.background = 'rgba(196, 137, 59, 0.2)';
      sideBadge.style.color = '#7A4F13';
    } else if (point.id === 'REFLEX-LIVER') {
      sideBadge.textContent = '🟢 僅按【右腳底】外側（左腳無此區）';
      sideBadge.style.background = 'rgba(42, 115, 82, 0.16)';
      sideBadge.style.color = '#1D4734';
    } else if (point.id === 'REFLEX-HEART') {
      sideBadge.textContent = '🔴 僅按【左腳底】外側（右腳無此區）';
      sideBadge.style.background = 'rgba(184, 61, 46, 0.16)';
      sideBadge.style.color = '#8A2519';
    } else if ('child' in point.views) {
      sideBadge.textContent = '👶 小兒經絡與青少年生長穴（輕揉撫按）';
      sideBadge.style.background = 'rgba(42, 72, 58, 0.12)';
      sideBadge.style.color = '#2A483A';
    } else if ('ear' in point.views) {
      sideBadge.textContent = '👂 左右雙耳對稱（雙耳皆可對捏或貼耳豆）';
      sideBadge.style.background = 'rgba(196, 137, 59, 0.18)';
      sideBadge.style.color = '#7A4F13';
    } else if ('sole' in point.views) {
      sideBadge.textContent = '🦶 左右雙腳對稱（雙腳皆有・建議先左腳後右腳）';
      sideBadge.style.background = 'rgba(196, 137, 59, 0.18)';
      sideBadge.style.color = '#7A4F13';
    } else if (midlineIds.has(point.id)) {
      sideBadge.textContent = '🎯 正中線單穴（居中按壓）';
      sideBadge.style.background = 'rgba(140, 109, 70, 0.15)';
      sideBadge.style.color = '#5A4328';
    } else {
      sideBadge.textContent = '👐 左右對稱雙穴（雙側皆可按）';
      sideBadge.style.background = 'rgba(42, 72, 58, 0.12)';
      sideBadge.style.color = '#2A483A';
    }
  }

  updateFavButtonUI(point.id);
  updatePainLogAndConstitutionUI();
  renderDietaryTherapy(point);

  const cautionEl = document.getElementById('cautionBanner');
  if (state.pregnancySafeMode && point.contraindications.pregnancyForbidden) {
    cautionEl.textContent = `🤰【孕期安全鎖已啟動】${point.contraindications.notes}（處方連播時將自動為您跳過此穴）`;
    cautionEl.className = 'caution-banner';
  } else {
    cautionEl.textContent = point.contraindications.notes;
    cautionEl.className = point.contraindications.pregnancyForbidden
      ? 'caution-banner'
      : 'caution-banner safe';
  }

  const inspectorArBtn = document.getElementById('inspectorArBtn');
  if (inspectorArBtn) {
    if (point.id in AR_SUPPORTED_POINTS) {
      inspectorArBtn.textContent = `📷 AR 鏡頭照「${point.name}」`;
    } else {
      inspectorArBtn.textContent = `📷 開啟手部/臉部 AR`;
    }
  }

  // 🔬 渲染 1:1 微距解剖與手指同身寸特寫 SVG
  const closeupContainer = document.getElementById('closeupSvgContainer');
  if (closeupContainer) {
    closeupContainer.innerHTML = getCloseupSvgMarkup(point.id);
  }

  // Tab 1: 精準找穴
  const stepsListEl = document.getElementById('locStepsList');
  if (stepsListEl && point.location.steps) {
    stepsListEl.innerHTML = point.location.steps
      .map((step) => `<li>${step}</li>`)
      .join('');
  }

  const hitCorrectEl = document.getElementById('hitCorrectText');
  const hitWrongEl = document.getElementById('hitWrongText');
  if (hitCorrectEl && point.location.hitCheck) {
    hitCorrectEl.textContent = point.location.hitCheck.correct;
  }
  if (hitWrongEl && point.location.hitCheck) {
    hitWrongEl.textContent = point.location.hitCheck.wrong;
  }

  document.getElementById('locBoneTip').textContent = `📍 關鍵骨縫地標：${point.location.boneTip}`;
  document.getElementById('locCunRef').textContent = `📏 比例尺基準：${point.location.cunReference}`;
  document.getElementById('locAnatomical').textContent = `標準解剖定位：${point.location.anatomical}`;

  // 🆚 若本穴屬於易混淆鄰近穴位群組，顯示一鍵並排 PK 對比按鈕（P2-2）
  const compareBtn = document.getElementById('comparePointBtn');
  if (compareBtn) {
    const confGroup = getConfusionGroupForPoint(point.id);
    if (confGroup) {
      const peers = confGroup.points
        .filter((id) => id !== point.id)
        .map((id) => ACUPOINTS.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(' / ');
      compareBtn.textContent = `🆚 易混鄰穴對比：與「${peers}」並排區分 →`;
      compareBtn.style.display = 'inline-block';
    } else {
      compareBtn.style.display = 'none';
    }
  }

  // Tab 2: 如何按揉
  document.getElementById('guideTechnique').textContent = `【手法】${point.massageGuide.technique}`;
  document.getElementById('guideFinger').textContent = point.massageGuide.fingerToUse;
  document.getElementById('guideSensation').textContent = point.massageGuide.sensation;

  // 非孕期臨床與操作安全守則（依穴位區域動態提醒，P1-2）
  const cautionEl = document.getElementById('clinicalCautionBox');
  if (cautionEl) {
    if (['CV12', 'ST25', 'CV6'].includes(point.id)) {
      cautionEl.textContent = '⚠️ 腹部安全守則：飯後 30–60 分鐘內或極度空腹時忌強力深壓腹部；有腹主動脈瘤、近期腹部手術或孕期請避開。';
    } else if (point.id.startsWith('PED-')) {
      cautionEl.textContent = '👶 小兒推拿守則：主要適用於 0–6 歲嬰幼兒，務必先塗抹乳液潤滑皮膚、手法輕快柔和；高燒不退或精神萎靡請立刻就醫。';
    } else if (point.id.startsWith('REFLEX-') || point.id === 'KI1') {
      cautionEl.textContent = '🦶 足底保健守則：飯後 1 小時內勿強壓足底；糖尿病足、足部外傷或服抗凝血劑者切忌重按，按後請飲溫水。';
    } else {
      cautionEl.textContent = '⚠️ 安全守則：皮膚有傷口、發炎紅腫、嚴重靜脈曲張、高血壓急性期或正服用抗凝血劑者，切勿於局部強力深壓。';
    }
  }

  const { pressSeconds, releaseSeconds, totalDurationSec: effectiveSec, bilateral } = getEffectiveRhythm(point);
  document.getElementById('timerRhythmMeta').textContent =
    `深按 ${pressSeconds} 秒・放鬆 ${releaseSeconds} 秒（${bilateral ? '左右交替' : '單點按揉'}）`;
  document.getElementById('orbTotalLeft').textContent =
    `單穴時長 ${formatTime(effectiveSec)}`;

  // 載入本穴個人手感筆記（P1-3）
  const noteInput = document.getElementById('pointNoteInput');
  const noteStatus = document.getElementById('pointNoteStatus');
  if (noteInput) {
    noteInput.value = state.pointNotes?.[point.id] || '';
  }
  if (noteStatus) {
    noteStatus.textContent = state.pointNotes?.[point.id] ? '✓ 已存本機' : '自動儲存於本機';
  }

  // Tab 3: 功效與配穴
  const tcmList = document.getElementById('tcmFunctionsList');
  tcmList.innerHTML = point.benefits.tcmFunctions
    .map((fn) => `<span class="tcm-pill">${fn}</span>`)
    .join('');

  const symList = document.getElementById('symptomPillsList');
  symList.innerHTML = point.benefits.symptoms
    .map((sym) => `<button type="button" class="symptom-pill-btn" data-symptom="${sym}">${sym}</button>`)
    .join('');

  symList.querySelectorAll('.symptom-pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sym = btn.getAttribute('data-symptom');
      applySymptomFilter(sym);
    });
  });

  const pairingsBox = document.getElementById('pairingsContainer');
  pairingsBox.innerHTML = point.pairings
    .map((pair) => {
      const partner = ACUPOINTS.find((p) => p.id === pair.partnerId);
      const partnerName = partner ? `${partner.name} (${partner.id})` : pair.partnerId;
      return `
        <div class="pairing-card">
          <div>
            <strong style="font-family: var(--font-serif); color: var(--herb-deep); font-size: 0.92rem;">
              【${pair.comboName}】配 ${partnerName}
            </strong>
            <p style="font-size: 0.82rem; color: var(--ink-muted); margin-top: 3px;">${pair.purpose}</p>
          </div>
          <button type="button" class="pairing-Jump-btn" data-jump-id="${pair.partnerId}">
            查看${partner ? partner.name : '配穴'} →
          </button>
        </div>
      `;
    })
    .join('');

  pairingsBox.querySelectorAll('.pairing-Jump-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-jump-id');
      selectAcupoint(targetId, true);
    });
  });
}

function switchDetailTab(tabId) {
  document.querySelectorAll('.detail-tab-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach((p) => {
    p.classList.toggle('active', p.id === tabId);
  });
}

// 取得所有處方（含親友分享臨時處方、問診臨時處方、⭐ 我的收藏處方、多組自訂處方與內建 10 組處方）
function getAllPresets() {
  const list = [...SYMPTOM_PRESETS];

  const formatSub = (pts) => {
    const names = pts
      .map((id) => ACUPOINTS.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join('＋');
    return `${names}${pts.length > 3 ? ` 等 ${pts.length} 穴` : ''}`;
  };

  // 多組使用者自訂命名處方（P2-1）
  const customCards = (state.customPresets || [])
    .filter((p) => p && p.id && Array.isArray(p.points) && p.points.length > 0)
    .map((p) => ({
      id: p.id,
      title: p.title || '我的自訂處方',
      subtitle: formatSub(p.points),
      icon: p.icon || '🌿',
      points: p.points,
      isCustom: true
    }));

  if (customCards.length > 0) {
    list.unshift(...customCards);
  }

  if (state.favorites.size > 0) {
    const favPoints = [...state.favorites];
    list.unshift({
      id: 'fav_custom',
      title: '我的收藏處方',
      subtitle: formatSub(favPoints),
      icon: '⭐',
      points: favPoints,
      isFav: true
    });
  }

  if (wizardTempPreset && wizardTempPreset.points?.length) {
    list.unshift(wizardTempPreset);
  }

  if (sharedTempPreset && sharedTempPreset.points?.length) {
    list.unshift(sharedTempPreset);
  }

  return list;
}

// 啟用指定處方（統一處理選取、高亮與網址同步）
function activatePresetById(id) {
  const preset = getAllPresets().find((p) => p.id === id);
  if (!preset || !preset.points?.length) return false;

  state.playlist.isPlaying = false;
  state.playlist.completedIds.clear();
  state.activePresetId = id;
  state.activeSymptomTag = null;
  state.activePosture = null;

  const noResultEl = document.getElementById('searchNoResultBanner');
  if (noResultEl) noResultEl.style.display = 'none';
  const searchInput = document.getElementById('symptomSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (searchInput) searchInput.value = '';
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';

  renderPresetRow();
  document.querySelectorAll('.symptom-chip').forEach((c) => c.classList.remove('active'));
  state.highlightedIds = new Set(preset.points);
  selectAcupoint(preset.points[0], true);
  updatePlaylistBannerUI();
  syncUrlWithState(preset);
  return true;
}

// 🎵 處方連續自動跟練播放清單控制
function updatePlaylistBannerUI() {
  const banner = document.getElementById('playlistBanner');
  const titleEl = document.getElementById('playlistTitle');
  const stepsEl = document.getElementById('playlistSteps');
  const playBtn = document.getElementById('startPlaylistBtn');
  if (!banner || !titleEl || !stepsEl || !playBtn) return;

  const preset = getAllPresets().find((p) => p.id === state.activePresetId);
  if (!preset) {
    banner.style.display = 'none';
    return;
  }

  banner.style.display = 'flex';
  const safeQueue = state.pregnancySafeMode
    ? preset.points.filter((pid) => !ACUPOINTS.find((p) => p.id === pid)?.contraindications.pregnancyForbidden)
    : preset.points;

  titleEl.textContent = `${preset.icon} 【${preset.title}】連續跟練處方（共 ${safeQueue.length} 穴${state.pregnancySafeMode && safeQueue.length < preset.points.length ? '・已濾除孕期禁穴' : ''}）`;

  stepsEl.innerHTML = preset.points
    .map((pid, idx) => {
      const pt = ACUPOINTS.find((p) => p.id === pid);
      const isForbidden = state.pregnancySafeMode && pt?.contraindications.pregnancyForbidden;
      const isCurrent = state.selectedPointId === pid;
      const isDone = state.playlist.completedIds.has(pid);
      const cls = [
        'playlist-step-pill',
        isCurrent ? 'current' : '',
        isDone ? 'done' : ''
      ].filter(Boolean).join(' ');
      return `
        <span class="${cls}" data-step-point="${pid}" style="${isForbidden ? 'opacity:0.45;text-decoration:line-through;' : ''}">
          ${isForbidden ? '🚫 ' : isDone ? '✓ ' : `${idx + 1}. `}${pt ? pt.name : pid}
        </span>
      `;
    })
    .join('<span style="opacity:0.5;">→</span>');

  stepsEl.querySelectorAll('.playlist-step-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const pid = pill.getAttribute('data-step-point');
      selectAcupoint(pid, true);
    });
  });

  const editBtn = document.getElementById('editPlaylistBtn');
  if (editBtn) {
    const isEditable = state.activePresetId === 'fav_custom' || state.activePresetId?.startsWith('custom_');
    const isTempSavable = state.activePresetId === 'shared_link' || state.activePresetId === 'wizard_temp';
    if (isEditable) {
      editBtn.style.display = 'inline-block';
      editBtn.textContent = '✏️ 調整順序/秒數';
    } else if (isTempSavable) {
      editBtn.style.display = 'inline-block';
      editBtn.textContent = '💾 存成自訂處方';
    } else {
      editBtn.style.display = 'none';
    }
  }

  if (state.playlist.isPlaying) {
    playBtn.textContent = `⏸ 停止處方連播 (${state.playlist.currentIndex + 1}/${state.playlist.queue.length})`;
    playBtn.classList.add('playing');
  } else {
    playBtn.textContent = '▶️ 連續跟練整套處方';
    playBtn.classList.remove('playing');
  }
}

function togglePlaylistExecution() {
  const preset = getAllPresets().find((p) => p.id === state.activePresetId);
  if (!preset) return;

  if (state.playlist.isPlaying) {
    state.playlist.isPlaying = false;
    stopAndResetTimer();
    updatePlaylistBannerUI();
    return;
  }

  const queue = state.pregnancySafeMode
    ? preset.points.filter((pid) => !ACUPOINTS.find((p) => p.id === pid)?.contraindications.pregnancyForbidden)
    : [...preset.points];

  if (queue.length === 0) {
    speakGuide('目前處方中的穴位皆為孕期禁穴，已為您安全攔截');
    return;
  }

  // 啟動整套處方自動連播
  stopAndResetTimer();
  state.playlist.isPlaying = true;
  state.playlist.queue = queue;
  state.playlist.currentIndex = 0;
  state.playlist.completedIds.clear();

  const firstId = state.playlist.queue[0];
  const firstPt = ACUPOINTS.find((p) => p.id === firstId);
  selectAcupoint(firstId, true, true);
  switchDetailTab('tab-massage');
  updatePlaylistBannerUI();

  if (firstPt) {
    const skipNotice = state.pregnancySafeMode && queue.length < preset.points.length
      ? '，已自動略過孕婦禁穴'
      : '';
    speakGuide(`開始${preset.title}處方跟練${skipNotice}，第一穴：${firstPt.name}穴，請深按`);
  }
  // skipInitialVoice=true：避免「深按」把開場完整語音截斷（修復 P0-2）
  toggleTimer({ skipInitialVoice: true });
}

// 渲染處方籤列（含⭐收藏、多組自訂處方與「➕ 建立自訂處方」入口；全部經 escapeHtml 防 XSS）
function renderPresetRow() {
  const presetRow = document.getElementById('presetRow');
  if (!presetRow) return;

  const allPresets = getAllPresets();
  const cardsHtml = allPresets
    .map(
      (preset) => `
    <div class="preset-card ${state.activePresetId === preset.id ? 'active' : ''}" data-preset-id="${escapeHtml(preset.id)}">
      <span class="preset-icon">${escapeHtml(preset.icon)}</span>
      <div>
        <div class="preset-title">${escapeHtml(preset.title)}</div>
        <div class="preset-sub">${escapeHtml(preset.subtitle)}</div>
      </div>
    </div>
  `
    )
    .join('');

  const addNewCardHtml = `
    <div class="preset-card preset-card-add" id="addCustomPresetCard" title="建立多組專屬養生處方，自排順序與秒數">
      <span class="preset-icon">➕</span>
      <div>
        <div class="preset-title">建立自訂處方</div>
        <div class="preset-sub">自選穴位・排順序・調秒數</div>
      </div>
    </div>
  `;

  presetRow.innerHTML = cardsHtml + addNewCardHtml;

  presetRow.querySelector('#addCustomPresetCard')?.addEventListener('click', () => {
    renderPresetEditorModal(
      ACUPOINTS,
      (savedId) => {
        renderPresetRow();
        if (savedId) activatePresetById(savedId);
        else updatePlaylistBannerUI();
      },
      { targetPresetId: '__new__' }
    );
  });

  presetRow.querySelectorAll('.preset-card[data-preset-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-preset-id');
      state.playlist.isPlaying = false;
      state.playlist.completedIds.clear();

      if (state.activePresetId === id) {
        state.activePresetId = null;
        state.highlightedIds.clear();
        card.classList.remove('active');
        updatePlaylistBannerUI();
        renderBodyCanvas();
        syncUrlWithState();
        return;
      }

      activatePresetById(id);
    });
  });
}

// 渲染處方籤、姿勢情境入口與症狀快篩列
function initFilters() {
  renderPresetRow();

  const postureRow = document.getElementById('postureRow');
  if (postureRow) {
    postureRow.innerHTML =
      `<span class="tag-label">依當下姿勢：</span>` +
      POSTURE_SCENARIOS.map(
        (sc) => `<button type="button" class="symptom-chip posture-chip" data-posture="${sc.id}" title="${sc.desc}">${sc.label}</button>`
      ).join('');

    postureRow.querySelectorAll('.posture-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const pid = chip.getAttribute('data-posture');
        if (state.activePosture === pid) {
          clearAllFilters();
          return;
        }
        const scenario = POSTURE_SCENARIOS.find((s) => s.id === pid);
        if (!scenario) return;
        state.activePosture = pid;
        state.activePresetId = null;
        state.activeSymptomTag = null;
        state.playlist.isPlaying = false;
        updatePlaylistBannerUI();
        document.querySelectorAll('.preset-card, .symptom-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        const matched = ACUPOINTS.filter(scenario.filter);
        state.highlightedIds = new Set(matched.map((p) => p.id));
        const clearBtn = document.getElementById('clearFilterBtn');
        if (clearBtn) clearBtn.style.display = 'inline-block';

        if (scenario.preferredView) {
          state.currentView = scenario.preferredView;
          updateViewTabButtons();
        }
        if (matched.length > 0) {
          const inView = matched.find((p) => p.views[state.currentView]) || matched[0];
          selectAcupoint(inView.id, true);
        } else {
          renderBodyCanvas();
        }
        showToast(`${scenario.label}：已篩選出 ${matched.length} 個免折騰好按穴位`);
      });
    });
  }

  const allSymptoms = [
    '肩頸痠痛',
    '頭痛',
    '失眠焦慮',
    '用眼過度',
    '胃脹噁心',
    '下肢水腫',
    '經痛',
    '手腳冰冷',
    '腰痠背痛',
    '鼻塞流涕',
    '咽喉乾痛',
    '耳鳴重聽',
    '消化不良',
    '發燒',
    '夜啼'
  ];
  const tagsRow = document.getElementById('symptomTagsRow');
  tagsRow.innerHTML = `<span class="tag-label">依症狀尋穴：</span>` + allSymptoms.map((sym) => `
    <button type="button" class="symptom-chip" data-sym="${sym}">${sym}</button>
  `).join('') + `<button type="button" class="symptom-chip" id="clearFilterBtn" style="display:none;">✕ 顯示全部</button>`;

  tagsRow.querySelectorAll('.symptom-chip[data-sym]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const sym = chip.getAttribute('data-sym');
      if (state.activeSymptomTag === sym) {
        clearAllFilters();
      } else {
        applySymptomFilter(sym);
      }
    });
  });

  document.getElementById('clearFilterBtn')?.addEventListener('click', clearAllFilters);
}

// 🔍 白話症狀與穴位模糊搜尋
function applyColloquialSearch(rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  state.searchQuery = q;

  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) {
    clearSearchBtn.style.display = q ? 'inline-block' : 'none';
  }

  if (!q) {
    clearAllFilters();
    return;
  }

  state.activePresetId = null;
  state.activeSymptomTag = null;
  state.activePosture = null;
  state.playlist.isPlaying = false;
  updatePlaylistBannerUI();
  document.querySelectorAll('.preset-card, .symptom-chip').forEach((el) => el.classList.remove('active'));

  const matchedSet = new Set();

  // 1. 比對口語同義詞字典（含全身穴位、耳穴與小兒推拿轉骨同義詞）
  const combinedSynonyms = { ...COLLOQUIAL_SYNONYMS, ...EAR_SYNONYMS, ...CHILD_SYNONYMS };
  Object.entries(combinedSynonyms).forEach(([keyword, pointIds]) => {
    if (keyword.includes(q) || q.includes(keyword)) {
      pointIds.forEach((id) => matchedSet.add(id));
    }
  });

  // 2. 比對穴位名稱、代碼、拼音、經絡、中醫功效、適應症與本草食療茶飲食材
  ACUPOINTS.forEach((pt) => {
    const diet = DIETARY_THERAPY[pt.id];
    const dietText = diet ? `${diet.teaName} ${diet.ingredients} ${diet.cvsOption}` : '';
    const haystack = [
      pt.name,
      pt.id,
      pt.pinyin,
      pt.meridian,
      ...pt.benefits.symptoms,
      ...pt.benefits.tcmFunctions,
      dietText
    ].join(' ').toLowerCase();

    if (haystack.includes(q)) {
      matchedSet.add(pt.id);
    }
  });

  state.highlightedIds = matchedSet;
  const clearBtn = document.getElementById('clearFilterBtn');
  if (clearBtn) clearBtn.style.display = 'inline-block';

  const noResultEl = document.getElementById('searchNoResultBanner');
  const noResultText = document.getElementById('searchNoResultText');
  if (matchedSet.size === 0) {
    if (noResultText) {
      noResultText.textContent = `🔍 找不到「${rawQuery.trim()}」，試試換個白話說法或點選下方熱門處方：`;
    }
    if (noResultEl) noResultEl.style.display = 'flex';
    renderBodyCanvas();
  } else {
    if (noResultEl) noResultEl.style.display = 'none';
    const firstMatch = [...matchedSet][0];
    if (firstMatch) {
      selectAcupoint(firstMatch, true);
    }
  }
}

function applySymptomFilter(symptom) {
  state.activeSymptomTag = symptom;
  state.activePresetId = null;
  state.playlist.isPlaying = false;
  updatePlaylistBannerUI();

  const noResultEl = document.getElementById('searchNoResultBanner');
  if (noResultEl) noResultEl.style.display = 'none';

  document.querySelectorAll('.preset-card').forEach((c) => c.classList.remove('active'));
  document.querySelectorAll('.symptom-chip[data-sym]').forEach((c) => {
    c.classList.toggle('active', c.getAttribute('data-sym') === symptom);
  });

  const matched = ACUPOINTS.filter((pt) => pt.benefits.symptoms.includes(symptom));
  state.highlightedIds = new Set(matched.map((p) => p.id));

  const clearBtn = document.getElementById('clearFilterBtn');
  if (clearBtn) clearBtn.style.display = 'inline-block';

  if (matched.length > 0) {
    selectAcupoint(matched[0].id, true);
  } else {
    renderBodyCanvas();
  }
}

function clearAllFilters() {
  state.activePresetId = null;
  state.activeSymptomTag = null;
  state.searchQuery = '';
  state.playlist.isPlaying = false;
  state.highlightedIds.clear();
  updatePlaylistBannerUI();

  const noResultEl = document.getElementById('searchNoResultBanner');
  if (noResultEl) noResultEl.style.display = 'none';

  const searchInput = document.getElementById('symptomSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (searchInput) searchInput.value = '';
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';

  document.querySelectorAll('.preset-card, .symptom-chip').forEach((el) => el.classList.remove('active'));
  const clearBtn = document.getElementById('clearFilterBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  renderBodyCanvas();
}

// 初始化當下時辰子午流注提示
function initZiwuLiuzhu() {
  const hour = new Date().getHours();
  const currentZiwu = ZIWU_LIUZHU.find((item) => {
    if (item.startHour === 23) return hour >= 23 || hour < 1;
    return hour >= item.startHour && hour < item.endHour;
  }) || ZIWU_LIUZHU[0];

  const badge = document.getElementById('ziwuBadge');
  const text = document.getElementById('ziwuText');
  const banner = document.getElementById('ziwuBanner');

  const recNames = currentZiwu.recommendedIds
    .map((id) => ACUPOINTS.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join('、');

  const ziwuDiet = ZIWU_DIET[currentZiwu.zhi];
  const shortDrink = ziwuDiet ? `｜🍵 ${ziwuDiet.drink.split('（')[0]}` : '';

  badge.textContent = `${currentZiwu.zhi}・${currentZiwu.meridian}`;
  text.textContent = `當令養${currentZiwu.organ}｜宜按：${recNames}${shortDrink}`;

  banner.addEventListener('click', () => {
    state.activePresetId = null;
    state.activeSymptomTag = null;
    state.playlist.isPlaying = false;
    updatePlaylistBannerUI();
    document.querySelectorAll('.preset-card, .symptom-chip').forEach((el) => el.classList.remove('active'));
    state.highlightedIds = new Set(currentZiwu.recommendedIds);
    selectAcupoint(currentZiwu.recommendedIds[0], true);
  });
}

// 初始化當令二十四節氣提示與養生穴位推薦
function initSolarTerms() {
  const termData = getCurrentSolarTerm();
  if (!termData || !termData.current) return;

  const currentTerm = termData.current;
  const badge = document.getElementById('solarTermBadge');
  const text = document.getElementById('solarTermText');
  const banner = document.getElementById('solarTermBanner');

  const recNames = currentTerm.recommendedPointIds
    .map((id) => ACUPOINTS.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join('、');

  if (badge) badge.textContent = `${currentTerm.name}・${currentTerm.season}`;
  if (text) text.textContent = `${currentTerm.slogan}｜宜按：${recNames}｜🍵 ${currentTerm.tea.name.split('（')[0]}`;

  const triggerTermHighlight = () => {
    state.activePresetId = null;
    state.activeSymptomTag = null;
    state.activePosture = null;
    state.playlist.isPlaying = false;
    updatePlaylistBannerUI();
    document.querySelectorAll('.preset-card, .symptom-chip').forEach((el) => el.classList.remove('active'));
    state.highlightedIds = new Set(currentTerm.recommendedPointIds);
    selectAcupoint(currentTerm.recommendedPointIds[0], true);
    showToast(`📅 已標記當令【${currentTerm.name}】養生穴位：${recNames}`);
  };

  banner?.addEventListener('click', triggerTermHighlight);
  document.getElementById('solarTermJumpBtn')?.addEventListener('click', triggerTermHighlight);
}

// 關閉全部已開啟的彈窗（Escape 鍵 / 語音口令）
function closeAllModals() {
  if (isArModalOpen()) {
    closeArModal();
  }
  closeZenMode();
  ['settingsModal', 'presetEditorModal', 'symptomWizardModal', 'directoryModal', 'painHistoryModal', 'compareModal'].forEach((id) => {
    document.getElementById(id)?.classList.remove('open');
  });
}

// 同步還原所有已持久化的個人化設定（孕期安全鎖、頌缽音效、長輩大字體、節奏強度）
function applyPersistedSettingsUI() {
  const pregCheckbox = document.getElementById('pregnancySafeCheckbox');
  const pregLabel = document.getElementById('pregnancySafeToggle');
  const pregDot = document.getElementById('pregnancyActiveDot');
  if (pregCheckbox) pregCheckbox.checked = !!state.pregnancySafeMode;
  pregLabel?.classList.toggle('active', !!state.pregnancySafeMode);
  if (pregDot) pregDot.style.display = state.pregnancySafeMode ? 'inline' : 'none';

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.checked = state.settings?.soundEnabled !== false;
  }

  const fontScale = state.settings?.fontScale || 'normal';
  document.documentElement.setAttribute('data-font-scale', fontScale);
  document.querySelectorAll('.font-scale-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-font-scale') === fontScale);
  });

  const rhythmLevel = state.settings?.rhythmLevel || 'standard';
  document.querySelectorAll('.rhythm-level-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-rhythm-level') === rhythmLevel);
  });
}

// 📜 打卡歷史明細管理彈窗（支援單筆刪除與全部清空，P1-3）
function openPainHistoryModal() {
  let modal = document.getElementById('painHistoryModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'painHistoryModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '經絡痛感打卡歷史明細');
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  const painLabelMap = {
    smooth: '😌 微痠舒暢',
    sharp: '⚡ 劇烈痠痛',
    empty: '☁️ 空軟無力'
  };

  const paint = () => {
    const recent = [...state.painLogs].reverse().slice(0, 50);
    const total = state.painLogs.length;

    const rowsHtml =
      recent.length === 0
        ? `<p style="text-align:center; color:var(--ink-muted); padding:20px 0;">目前沒有任何打卡紀錄。</p>`
        : recent
            .map((log, revIdx) => {
              const realIdx = total - 1 - revIdx;
              const d = new Date(log.timestamp || Date.now());
              const dtStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              return `
                <div class="history-log-row">
                  <div class="history-log-info">
                    <strong>${escapeHtml(log.pointName || log.pointId)} <small>(${escapeHtml(log.pointId)})</small></strong>
                    <span class="history-log-meta">${dtStr}・${escapeHtml(log.meridian || '')}</span>
                  </div>
                  <div class="history-log-right">
                    <span class="history-pain-pill ${escapeHtml(log.painType)}">${painLabelMap[log.painType] || '已紀錄'}</span>
                    <button type="button" class="editor-del-btn" data-del-log-idx="${realIdx}" title="刪除此筆紀錄">✕</button>
                  </div>
                </div>
              `;
            })
            .join('');

    modal.innerHTML = `
      <div class="ar-modal-card settings-modal-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px;">
          <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0; font-size:1.05rem;">
            📜 按後手感打卡明細（共 ${total} 筆${total > 50 ? '，顯示最新 50 筆' : ''}）
          </h3>
          <button type="button" id="closePainHistoryBtn" class="ar-close-btn">✕ 關閉</button>
        </div>
        <div class="history-log-list">${rowsHtml}</div>
        ${
          total > 0
            ? `<div style="margin-top:12px; display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;">
                 <button type="button" id="historyExportCardBtn" class="util-pill-btn">🖼️ 匯出體質週報卡 PNG</button>
                 <button type="button" id="clearAllPainLogsBtn" class="util-pill-btn undo-pain-btn">🗑 清空全部紀錄</button>
               </div>`
            : ''
        }
      </div>
    `;

    modal.querySelector('#closePainHistoryBtn')?.addEventListener('click', () => modal.classList.remove('open'));
    modal.querySelector('#historyExportCardBtn')?.addEventListener('click', () => {
      exportConstitutionReportCard(calculateStreakDays(state.painLogs));
    });
    modal.querySelectorAll('[data-del-log-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-del-log-idx'));
        if (idx >= 0 && idx < state.painLogs.length) {
          state.painLogs.splice(idx, 1);
          savePainLogs();
          updatePainLogAndConstitutionUI();
          const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
          if (pt) renderDietaryTherapy(pt);
          paint();
        }
      });
    });
    modal.querySelector('#clearAllPainLogsBtn')?.addEventListener('click', () => {
      if (!window.confirm('確定要清空全部按後體感打卡紀錄嗎？（建議先匯出 JSON 備份）')) return;
      state.painLogs = [];
      savePainLogs();
      updatePainLogAndConstitutionUI();
      const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
      if (pt) renderDietaryTherapy(pt);
      modal.classList.remove('open');
      showToast('🗑 已清空所有打卡紀錄');
    });
  };

  paint();
  modal.classList.add('open');
}

// 免手碰語音口令與鍵盤快捷鍵調度處理中心（修復 P0-1 與 P1-5）
function handleVoiceOrKeyboardAction(action) {
  switch (action) {
    case 'toggleTimer':
      toggleTimer();
      break;

    case 'start':
      if (!state.timer.running) {
        toggleTimer();
      }
      break;

    case 'pause':
      if (state.timer.running) {
        toggleTimer();
      }
      break;

    case 'next': {
      if (state.activePresetId) {
        const preset = getAllPresets().find((p) => p.id === state.activePresetId);
        if (preset && preset.points.length > 0) {
          const curIdx = preset.points.indexOf(state.selectedPointId);
          const nextIdx = (curIdx + 1) % preset.points.length;
          selectAcupoint(preset.points[nextIdx], true);
          return;
        }
      }
      if (state.highlightedIds.size > 0) {
        const list = [...state.highlightedIds];
        const curIdx = list.indexOf(state.selectedPointId);
        const nextIdx = (curIdx + 1) % list.length;
        selectAcupoint(list[nextIdx], true);
        return;
      }
      const allIds = ACUPOINTS.map((p) => p.id);
      const curIdx = allIds.indexOf(state.selectedPointId);
      const nextIdx = (curIdx + 1) % allIds.length;
      selectAcupoint(allIds[nextIdx], true);
      break;
    }

    case 'prev': {
      if (state.activePresetId) {
        const preset = getAllPresets().find((p) => p.id === state.activePresetId);
        if (preset && preset.points.length > 0) {
          const curIdx = preset.points.indexOf(state.selectedPointId);
          const prevIdx = (curIdx - 1 + preset.points.length) % preset.points.length;
          selectAcupoint(preset.points[prevIdx], true);
          return;
        }
      }
      if (state.highlightedIds.size > 0) {
        const list = [...state.highlightedIds];
        const curIdx = list.indexOf(state.selectedPointId);
        const prevIdx = (curIdx - 1 + list.length) % list.length;
        selectAcupoint(list[prevIdx], true);
        return;
      }
      const allIds = ACUPOINTS.map((p) => p.id);
      const curIdx = allIds.indexOf(state.selectedPointId);
      const prevIdx = (curIdx - 1 + allIds.length) % allIds.length;
      selectAcupoint(allIds[prevIdx], true);
      break;
    }

    case 'switchSide':
      triggerManualSwitchSide();
      break;

    case 'flipCloseup': {
      const flipBtn = document.getElementById('flipCloseupBtn');
      if (flipBtn) flipBtn.click();
      break;
    }

    case 'capture': {
      if (!isArModalOpen()) {
        showToast('💡 請先開啟 AR 鏡頭後再說「定格」或「拍照」');
        return;
      }
      const freezeBtn = document.getElementById('freezeArBtn');
      if (freezeBtn) freezeBtn.click();
      break;
    }

    case 'openAr':
      openArModal(state.selectedPointId);
      break;

    case 'closeModal':
      closeAllModals();
      break;
  }
}

function updateViewTabButtons() {
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === state.currentView);
  });
}

// 綁定全域互動控制項
function bindEvents() {
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currentView = btn.getAttribute('data-view');
      updateViewTabButtons();
      const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
      if (!currentPt || !currentPt.views[state.currentView]) {
        const defaultPointForView = ACUPOINTS.find((p) => p.views[state.currentView]);
        if (defaultPointForView) {
          selectAcupoint(defaultPointForView.id, false);
          return;
        }
      }
      renderBodyCanvas();
      resetSvgZoom();
    });
  });

  // 🔍 白話搜尋框事件
  const searchInput = document.getElementById('symptomSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  searchInput?.addEventListener('input', (e) => {
    applyColloquialSearch(e.target.value);
  });
  clearSearchBtn?.addEventListener('click', () => {
    clearAllFilters();
  });

  // ⚙️ 個人化設定彈窗開關
  const settingsModal = document.getElementById('settingsModal');
  document.getElementById('openSettingsBtn')?.addEventListener('click', () => {
    updateReminderUI();
    settingsModal?.classList.add('open');
  });
  document.getElementById('closeSettingsBtn')?.addEventListener('click', () => {
    settingsModal?.classList.remove('open');
  });
  settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('open');
  });

  // 🩺 3 題問診式動態配穴精靈
  document.getElementById('openWizardBtn')?.addEventListener('click', () => {
    openSymptomWizardModal(ACUPOINTS, {
      onApplyTempPreset: (tempPreset) => {
        wizardTempPreset = tempPreset;
        renderPresetRow();
        activatePresetById(tempPreset.id);
        showToast(`🩺 已為您開啟【${tempPreset.title}】，點擊「▶️ 連續跟練」即可開始！`);
      },
      onSaveCustomPreset: (savedPreset) => {
        renderPresetRow();
        activatePresetById(savedPreset.id);
      }
    });
  });

  // 📋 56 穴經絡與部位目錄總表抽屜（P2-1）
  document.getElementById('openDirectoryBtn')?.addEventListener('click', () => {
    openDirectoryModal(ACUPOINTS, (pid) => {
      selectAcupoint(pid, true);
    });
  });

  // 🤰 孕期安全鎖事件（持久化至 settings + 同步 Header 小紅標，P0-2）
  const pregCheckbox = document.getElementById('pregnancySafeCheckbox');
  const pregLabel = document.getElementById('pregnancySafeToggle');
  const pregDot = document.getElementById('pregnancyActiveDot');
  pregCheckbox?.addEventListener('change', (e) => {
    state.pregnancySafeMode = e.target.checked;
    state.settings.pregnancySafeMode = state.pregnancySafeMode;
    saveSettings();
    pregLabel?.classList.toggle('active', state.pregnancySafeMode);
    if (pregDot) pregDot.style.display = state.pregnancySafeMode ? 'inline' : 'none';
    renderBodyCanvas();
    const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (currentPt) renderInspector(currentPt);
    updatePlaylistBannerUI();
    showToast(state.pregnancySafeMode ? '🤰 已開啟並記住「孕期安全鎖」' : '已關閉孕期安全鎖');
  });

  // 🔔 頌缽與語音開關持久化（P0-2）
  document.getElementById('soundToggle')?.addEventListener('change', (e) => {
    state.settings.soundEnabled = e.target.checked;
    saveSettings();
  });

  // 🔠 長輩大字體模式三段切換（P1-1）
  document.querySelectorAll('.font-scale-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const scale = btn.getAttribute('data-font-scale') || 'normal';
      state.settings.fontScale = scale;
      saveSettings();
      applyPersistedSettingsUI();
      const map = { normal: '標準字體', large: '大字護眼模式', xlarge: '特大長輩模式' };
      showToast(`🔠 已切換為：${map[scale] || scale}`);
    });
  });

  // 💪 按壓節奏強度三段切換（柔和 / 標準 / 深層，P2-3）
  document.querySelectorAll('.rhythm-level-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = btn.getAttribute('data-rhythm-level') || 'standard';
      state.settings.rhythmLevel = level;
      saveSettings();
      applyPersistedSettingsUI();
      const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
      if (currentPt) {
        if (!state.timer.running) stopAndResetTimer();
        renderInspector(currentPt);
      }
      const map = { gentle: '柔和節奏 (0.75x)', standard: '標準節奏 (1.0x)', deep: '深層指壓節奏 (1.4x)' };
      showToast(`⏱️ 已切換為：${map[level] || level}`);
    });
  });

  // 📜 打卡歷史明細 & 🖼️ 體質週報卡 PNG（P1-3 / P2-2）
  document.getElementById('openPainHistoryBtn')?.addEventListener('click', openPainHistoryModal);
  document.getElementById('exportReportCardBtn')?.addEventListener('click', () => {
    exportConstitutionReportCard(calculateStreakDays(state.painLogs));
  });

  // 📝 單穴個人手感筆記自動儲存（350ms debounce，P1-3）
  let noteDebounceTimer = null;
  const pointNoteInput = document.getElementById('pointNoteInput');
  const pointNoteStatus = document.getElementById('pointNoteStatus');
  pointNoteInput?.addEventListener('input', (e) => {
    const pid = state.selectedPointId;
    const val = e.target.value;
    if (pointNoteStatus) pointNoteStatus.textContent = '儲存中…';
    if (noteDebounceTimer) clearTimeout(noteDebounceTimer);
    noteDebounceTimer = setTimeout(() => {
      if (!state.pointNotes) state.pointNotes = {};
      if (val.trim()) {
        state.pointNotes[pid] = val;
      } else {
        delete state.pointNotes[pid];
      }
      savePointNotes();
      if (pointNoteStatus) pointNoteStatus.textContent = val.trim() ? '✓ 已存本機' : '自動儲存於本機';
    }, 350);
  });

  // ⭐ 收藏穴位按鈕事件
  document.getElementById('favPointBtn')?.addEventListener('click', () => {
    const pid = state.selectedPointId;
    if (state.favorites.has(pid)) {
      state.favorites.delete(pid);
      if (state.activePresetId === 'fav_custom' && state.favorites.size === 0) {
        state.activePresetId = null;
      }
    } else {
      state.favorites.add(pid);
    }
    saveFavorites();
    updateFavButtonUI(pid);
    renderPresetRow();
    updatePlaylistBannerUI();
  });

  // 🩺 按後痛感體質自我檢測紀錄事件
  document.querySelectorAll('.pain-log-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const painType = btn.getAttribute('data-pain');
      if (painType) recordPainSensation(painType);
    });
  });

  const zoomToggleBtn = document.getElementById('zoomToggleBtn');
  zoomToggleBtn?.addEventListener('click', () => {
    state.autoZoomEnabled = !state.autoZoomEnabled;
    zoomToggleBtn.textContent = state.autoZoomEnabled
      ? '🔍 局部放大聚焦：開'
      : '🔍 局部放大聚焦：關';
    zoomToggleBtn.classList.toggle('active', state.autoZoomEnabled);

    const point = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (state.autoZoomEnabled && point) {
      applySvgZoomForPoint(point);
    } else {
      resetSvgZoom();
    }
  });

  document.getElementById('resetZoomFloatingBtn')?.addEventListener('click', resetSvgZoom);

  const xraySlider = document.getElementById('xraySlider');
  xraySlider?.addEventListener('input', (e) => {
    state.xrayOpacity = Number(e.target.value) / 100;
    const layer = document.querySelector('.skeleton-layer');
    if (layer) layer.style.opacity = state.xrayOpacity;
  });

  document.querySelectorAll('.detail-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchDetailTab(targetTab);
    });
  });

  document.getElementById('startTimerBtn')?.addEventListener('click', () => toggleTimer());
  document.getElementById('resetTimerBtn')?.addEventListener('click', () => {
    state.playlist.isPlaying = false;
    stopAndResetTimer();
    updatePlaylistBannerUI();
  });

  document.getElementById('startPlaylistBtn')?.addEventListener('click', togglePlaylistExecution);

  document.getElementById('editPlaylistBtn')?.addEventListener('click', () => {
    // 若是親友分享連結或問診臨時處方，直接一鍵存成永久自訂處方
    if (state.activePresetId === 'shared_link' || state.activePresetId === 'wizard_temp') {
      const tempObj = getAllPresets().find((p) => p.id === state.activePresetId);
      if (tempObj && tempObj.points?.length) {
        const saved = {
          id: `custom_${Date.now()}`,
          title: tempObj.title.replace(/^問診配穴：/, ''),
          icon: tempObj.icon || '🌿',
          points: [...tempObj.points]
        };
        state.customPresets.unshift(saved);
        saveCustomPresets();
        renderPresetRow();
        activatePresetById(saved.id);
        showToast(`💾 已永久存成我的自訂處方【${saved.title}】！`);
      }
      return;
    }

    renderPresetEditorModal(
      ACUPOINTS,
      (savedId) => {
        renderPresetRow();
        if (savedId && savedId !== state.activePresetId) {
          activatePresetById(savedId);
        } else {
          updatePlaylistBannerUI();
          const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
          if (currentPt) renderInspector(currentPt);
        }
      },
      { targetPresetId: state.activePresetId || 'fav_custom' }
    );
  });

  // 🔗 分享穴位連結
  document.getElementById('sharePointBtn')?.addEventListener('click', () => {
    const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (pt) shareAcupointLink(pt);
  });

  // 🔗 分享處方箋連結（支援內建處方與自訂／收藏處方完整編碼）
  document.getElementById('sharePlaylistBtn')?.addEventListener('click', () => {
    const preset = getAllPresets().find((p) => p.id === state.activePresetId);
    if (preset) {
      sharePresetLink(preset, ACUPOINTS);
    } else {
      showToast('請先由上方處方籤列選擇一組處方再分享');
    }
  });

  // 🎙️ 免手碰語音口令控制開關
  document.getElementById('voiceControlBtn')?.addEventListener('click', toggleVoiceControl);
  document.getElementById('timerVoiceBtn')?.addEventListener('click', toggleVoiceControl);

  // 🔄 1:1 微距特寫圖左右換側鏡像翻轉
  const flipBtn = document.getElementById('flipCloseupBtn');
  const closeupWrap = document.getElementById('closeupSvgContainer');
  if (flipBtn && closeupWrap) {
    flipBtn.addEventListener('click', () => {
      const isMirrored = closeupWrap.classList.toggle('mirrored');
      flipBtn.classList.toggle('active', isMirrored);
      flipBtn.textContent = isMirrored ? '🔄 已鏡像翻轉（再按復原）' : '🔄 換側對照';
    });
  }

  // ↩ 撤銷上一筆痛感紀錄
  document.getElementById('undoPainLogBtn')?.addEventListener('click', () => {
    if (state.painLogs.length === 0) return;
    const removed = state.painLogs.pop();
    savePainLogs();
    updatePainLogAndConstitutionUI();
    const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (pt) renderDietaryTherapy(pt);
    showToast(`↩ 已撤銷「${removed.pointName || removed.pointId}」上一筆手感紀錄`);
  });

  // 🔍 搜尋無結果時的推薦處方快捷按鈕
  document.querySelectorAll('#searchNoResultBanner [data-quick-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-quick-preset');
      activatePresetById(pid);
    });
  });

  // 🌙 夜間護眼模式切換
  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const nextMode = cycleThemeMode();
    const labelMap = { auto: '跟隨系統自動切換', dark: '夜間護眼深色模式', light: '日間宣紙淺色模式' };
    showToast(`🎨 已切換為：${labelMap[nextMode]}`);
  });

  // ⏰ 每日按穴提醒（支援自選時間、快速預設與 .ics 行事曆鬧鐘）
  const reminderTimeInput = document.getElementById('reminderTimeInput');
  reminderTimeInput?.addEventListener('change', (e) => {
    setReminderTime(e.target.value);
  });
  document.querySelectorAll('.reminder-quick-time').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-time');
      if (t) setReminderTime(t);
    });
  });
  document.getElementById('reminderToggleBtn')?.addEventListener('click', () => {
    const t = reminderTimeInput?.value || state.settings.reminderTime || '21:30';
    toggleDailyReminder(t);
  });
  document.getElementById('downloadIcsBtn')?.addEventListener('click', () => {
    const t = reminderTimeInput?.value || state.settings.reminderTime || '21:30';
    downloadCalendarReminderIcs(t);
    showToast(`📅 已下載每日 ${t} 行事曆循環提醒 (.ics)`);
  });

  // 📤 備份匯出 / 📥 備份還原
  document.getElementById('backupExportBtn')?.addEventListener('click', async () => {
    const res = await exportBackup();
    if (res === 'downloaded') showToast('📤 已下載本機收藏、自訂處方與體質紀錄備份檔 (.json)');
    else if (res === 'shared') showToast('📤 已匯出備份檔');
  });

  const backupInput = document.getElementById('backupFileInput');
  document.getElementById('backupImportBtn')?.addEventListener('click', () => {
    backupInput?.click();
  });
  backupInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const summary = await importBackup(file, 'merge');
      initThemeListener();
      applyPersistedSettingsUI();
      updateReminderUI();
      updatePainLogAndConstitutionUI();
      renderPresetRow();
      updatePlaylistBannerUI();
      const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
      if (pt) renderInspector(pt);
      showToast(`📥 還原成功！${summary.favorites} 收藏、${summary.presets} 自訂方、${summary.logs} 紀錄、${summary.notes} 筆記`);
    } catch (err) {
      showToast(`⚠️ 匯入失敗：${err.message || '檔案格式不符'}`);
    } finally {
      backupInput.value = '';
    }
  });

  // 📦 AR 離線模型包預載按鈕
  const arPackBtn = document.getElementById('preloadArPackBtn');
  const refreshArPackBtnLabel = async () => {
    if (!arPackBtn) return;
    const status = await getArPackStatus();
    if (status.supported && status.cached === status.total && status.total > 0) {
      arPackBtn.textContent = '✓ AR離線已就緒';
    }
  };
  arPackBtn?.addEventListener('click', async () => {
    if (!arPackBtn) return;
    arPackBtn.disabled = true;
    try {
      await preloadArPack(({ done, total, label }) => {
        arPackBtn.textContent = `⏳ ${done}/${total} ${label}`;
      });
      arPackBtn.textContent = '✓ AR離線已就緒';
      showToast('📦 AR 手部、臉部與姿態 AI 模型已存入離線快取，無網路也能開 AR！');
    } catch (err) {
      arPackBtn.textContent = '📦 重試離線包';
      showToast(`⚠️ 離線包下載失敗：${err.message || '請確認網路連線'}`);
    } finally {
      arPackBtn.disabled = false;
    }
  });

  document.getElementById('headerArBtn')?.addEventListener('click', () => {
    refreshArPackBtnLabel();
    openArModal(state.selectedPointId);
  });
  document.getElementById('inspectorArBtn')?.addEventListener('click', () => {
    refreshArPackBtnLabel();
    openArModal(state.selectedPointId);
  });

  // 🆚 易混淆鄰近穴位並排 PK 對照（P2-2）
  document.getElementById('comparePointBtn')?.addEventListener('click', () => {
    openPointCompareModal(state.selectedPointId, ACUPOINTS, (pid) => {
      selectAcupoint(pid, true);
    });
  });

  // 🧘 全螢幕沉浸跟練模式（Zen Mode，P2-1）
  document.getElementById('openZenModeBtn')?.addEventListener('click', () => {
    openZenMode({
      getAllPoints: () => ACUPOINTS,
      onToggleTimer: () => toggleTimer(),
      onSwitchSide: triggerManualSwitchSide,
      onNext: () => handleVoiceOrKeyboardAction('next'),
      onPrev: () => handleVoiceOrKeyboardAction('prev'),
      onRecordPain: recordPainSensation
    });
  });

  // 📱 手機版雙向智慧懸浮導引膠囊（畫布看詳情 ↔ 詳情回人體圖，P1-1）
  const mobileFab = document.getElementById('mobileJumpFab');
  const inspectorCard = document.getElementById('inspectorCard');
  if (mobileFab && inspectorCard) {
    mobileFab.addEventListener('click', () => {
      if (isMobileViewingInspector) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        inspectorCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isMobileViewingInspector = !!entry?.isIntersecting && entry.boundingClientRect.top < window.innerHeight * 0.65;
          updateMobileJumpFabUI();
        },
        { threshold: [0, 0.15, 0.35] }
      );
      obs.observe(inspectorCard);
    }
  }

  // ⏪ 瀏覽器上一頁／下一頁歷史同步（P1-2）
  window.addEventListener('popstate', () => {
    const deep = readDeepLinkFromUrl(ACUPOINTS);
    if (deep.view) {
      state.currentView = deep.view;
      updateViewTabButtons();
    }
    if (deep.sharedPreset) {
      sharedTempPreset = deep.sharedPreset;
      renderPresetRow();
      state.activePresetId = deep.sharedPreset.id;
      state.highlightedIds = new Set(deep.sharedPreset.points);
    } else if (deep.presetId) {
      const preset = getAllPresets().find((p) => p.id === deep.presetId);
      if (preset) {
        state.activePresetId = preset.id;
        state.highlightedIds = new Set(preset.points);
        renderPresetRow();
      }
    } else {
      state.activePresetId = null;
      state.highlightedIds.clear();
      renderPresetRow();
    }
    selectAcupoint(deep.pointId || 'LI4', !deep.view, false, { pushHistory: false });
  });

  initArControls((newPointId) => {
    selectAcupoint(newPointId, true);
  });
}

// 啟動應用
window.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  applyPersistedSettingsUI();
  initTimerDeps({
    getAllPoints: () => ACUPOINTS,
    selectAcupoint,
    updatePlaylistBannerUI,
    onPointChanged: refreshZenModePoint
  });
  initThemeListener();
  startReminderScheduler();
  initZiwuLiuzhu();
  initSolarTerms();
  initFilters();
  initCanvasGestures();
  bindEvents();
  initVoiceAndKeyboardControls({ onAction: handleVoiceOrKeyboardAction });

  const deep = readDeepLinkFromUrl(ACUPOINTS);
  if (deep.view) {
    state.currentView = deep.view;
    updateViewTabButtons();
  }

  let handledPreset = false;
  if (deep.sharedPreset) {
    sharedTempPreset = deep.sharedPreset;
    renderPresetRow();
    handledPreset = activatePresetById(deep.sharedPreset.id);
    if (handledPreset) {
      showToast(`💌 已載入親友分享的處方【${deep.sharedPreset.title}】，可立即開始跟練！`, 4000);
    }
  } else if (deep.presetId) {
    handledPreset = activatePresetById(deep.presetId);
  }

  // 安全回退：若分享處方 ID 在本機不存在，仍正常顯示穴位而不留空白殼（修復 P0-6）
  if (!handledPreset) {
    selectAcupoint(deep.pointId || 'LI4', !deep.view, false, { pushHistory: false });
  }

  registerServiceWorkerWithUpdates(() => {
    showToast('✨ 本草尋穴已於背景更新至最新版本，重新整理即可生效', 4500);
  });
});
