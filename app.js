// 🌿 本草尋穴主控入口（輕量組裝層：非首屏功能皆按需懶載入以極致瘦身首屏體積）
import {
  ACUPOINTS,
  SYMPTOM_PRESETS,
  ZIWU_LIUZHU,
  DIETARY_THERAPY,
  ZIWU_DIET,
  EAR_SYNONYMS,
  CHILD_SYNONYMS,
  getCurrentSolarTerm
} from './data/index.js';
import { state, COLLOQUIAL_SYNONYMS } from './modules/state.js';
import { speakGuide } from './modules/audio.js';
import { getBaseBodySvgMarkup } from './modules/bodySvg.js';
import {
  loadPersistedData,
  saveFavorites,
  savePainLogs,
  savePointNotes,
  saveCustomPresets,
  saveSettings,
  exportBackup,
  importBackup
} from './modules/storage.js';
import { showToast, escapeHtml, initModalScrollLock } from './modules/ui.js';
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
import { POSTURE_SCENARIOS } from './modules/posture.js';
import { getArPackStatus, preloadArPack, registerServiceWorkerWithUpdates } from './modules/offline.js';
import { initVoiceAndKeyboardControls, toggleVoiceControl } from './modules/voiceControl.js';
import {
  initTimerDeps,
  toggleTimer,
  stopAndResetTimer,
  triggerManualSwitchSide
} from './modules/timer.js';
import { normalizeSearchText, matchesNormalizedQuery } from './modules/searchNorm.js';
import {
  initPainLogDeps,
  calculateStreakDays,
  updatePainLogAndConstitutionUI,
  recordPainSensation,
  openPainHistoryModal
} from './modules/painLogs.js';
import {
  initInspectorDeps,
  updateFavButtonUI,
  renderDietaryTherapy,
  renderInspector
} from './modules/inspector.js';

// 暫存由親友分享連結或 3 題問診精靈產生的即時處方
let sharedTempPreset = null;
let wizardTempPreset = null;
let isMobileViewingInspector = false;

// 按需懶載入模組快取（首屏不載入 75KB arFinder.js 與各彈窗模組，P1-1）
let arModulePromise = null;
let arModuleInstance = null;
let arControlsInitialized = false;
let zenModuleInstance = null;

async function getArModule() {
  if (!arModulePromise) {
    arModulePromise = import('./arFinder.js').then((mod) => {
      arModuleInstance = mod;
      if (!arControlsInitialized) {
        arControlsInitialized = true;
        mod.initArControls((newPointId) => {
          selectAcupoint(newPointId, true);
        });
      }
      return mod;
    });
  }
  return arModulePromise;
}

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

// 繪製當前選中穴位的「同經絡流光連線」（含正面大腸經折點修正）
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

  const buildPath = (coords) => coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  let mainCoords = sameMeridianPts.map((pt) => ({ ...pt.views[currentView], id: pt.id }));

  // 正面「手陽明大腸經」補上頸側與肩髃折點，避免直線斜穿過臉頰
  if (currentView === 'front' && selectedPt.meridian === '手陽明大腸經') {
    const li20Idx = mainCoords.findIndex((c) => c.id === 'LI20');
    const li11Idx = mainCoords.findIndex((c) => c.id === 'LI11');
    if (li20Idx !== -1 && li11Idx === li20Idx + 1) {
      mainCoords.splice(li11Idx, 0, { x: 178, y: 114 }, { x: 142, y: 152 });
    }
  }

  let paths = `<path class="meridian-flow-line" d="${buildPath(mainCoords)}" />`;
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

// 選取穴位並更新右側教學面板
function selectAcupoint(pointId, autoSwitchViewIfNeeded = false, keepTimerIfPlaylist = false, { pushHistory = true } = {}) {
  const point = ACUPOINTS.find((p) => p.id === pointId);
  if (!point) return;

  state.selectedPointId = point.id;

  if (autoSwitchViewIfNeeded && !point.views[state.currentView]) {
    const preferredOrder = ['child', 'ear', 'sole', 'head', 'hand', 'foot', 'front', 'back'];
    const availableView = preferredOrder.find((v) => v in point.views) || Object.keys(point.views)[0];
    if (availableView) {
      state.currentView = availableView;
      updateViewTabButtons();
    }
  }

  if (!keepTimerIfPlaylist) {
    if (state.playlist.isPlaying) state.playlist.isPlaying = false;
    stopAndResetTimer();
  }
  renderBodyCanvas();
  applySvgZoomForPoint(point);
  renderInspector(point);
  updatePlaylistBannerUI();
  updateMobileJumpFabUI();
  zenModuleInstance?.refreshZenModePoint();
  const activePresetObj = getAllPresets().find((p) => p.id === state.activePresetId) || null;
  syncUrlWithState(activePresetObj, { push: pushHistory });
}

function applySvgZoomForPoint(point) {
  const svg = document.getElementById('bodySvg');
  if (!svg) return;

  const coord = point?.views[state.currentView];
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

function switchDetailTab(tabId) {
  document.querySelectorAll('.detail-tab-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach((p) => {
    p.classList.toggle('active', p.id === tabId);
  });
}

// 取得所有處方（含親友分享、問診臨時、⭐收藏、多組自訂處方與內建 15 組處方）
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

  if (customCards.length > 0) list.unshift(...customCards);

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

  if (wizardTempPreset && wizardTempPreset.points?.length) list.unshift(wizardTempPreset);
  if (sharedTempPreset && sharedTempPreset.points?.length) list.unshift(sharedTempPreset);
  return list;
}

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
      const cls = ['playlist-step-pill', isCurrent ? 'current' : '', isDone ? 'done' : ''].filter(Boolean).join(' ');
      return `
        <span class="${cls}" data-step-point="${escapeHtml(pid)}" style="${isForbidden ? 'opacity:0.45;text-decoration:line-through;' : ''}">
          ${isForbidden ? '🚫 ' : isDone ? '✓ ' : `${idx + 1}. `}${escapeHtml(pt ? pt.name : pid)}
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
    const skipNotice = state.pregnancySafeMode && queue.length < preset.points.length ? '，已自動略過孕婦禁穴' : '';
    speakGuide(`開始${preset.title}處方跟練${skipNotice}，第一穴：${firstPt.name}穴，請深按`);
  }
  toggleTimer({ skipInitialVoice: true });
}

// 渲染處方籤列
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

  presetRow.querySelector('#addCustomPresetCard')?.addEventListener('click', async () => {
    const { renderPresetEditorModal } = await import('./modules/presetEditor.js');
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
    '肩頸痠痛', '頭痛', '失眠焦慮', '用眼過度', '胃脹噁心', '下肢水腫',
    '經痛', '手腳冰冷', '腰痠背痛', '鼻塞流涕', '咽喉乾痛', '耳鳴重聽',
    '消化不良', '發燒', '夜啼'
  ];
  const tagsRow = document.getElementById('symptomTagsRow');
  tagsRow.innerHTML =
    `<span class="tag-label">依症狀尋穴：</span>` +
    allSymptoms.map((sym) => `<button type="button" class="symptom-chip" data-sym="${sym}">${sym}</button>`).join('') +
    `<button type="button" class="symptom-chip" id="clearFilterBtn" style="display:none;">✕ 顯示全部</button>`;

  tagsRow.querySelectorAll('.symptom-chip[data-sym]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const sym = chip.getAttribute('data-sym');
      if (state.activeSymptomTag === sym) clearAllFilters();
      else applySymptomFilter(sym);
    });
  });

  document.getElementById('clearFilterBtn')?.addEventListener('click', clearAllFilters);
}

// 🔍 白話症狀、繁簡兼容與無聲調拼音模糊搜尋（P0-3）
function applyColloquialSearch(rawQuery) {
  const qNorm = normalizeSearchText(rawQuery);
  state.searchQuery = qNorm;

  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) clearSearchBtn.style.display = qNorm ? 'inline-block' : 'none';

  if (!qNorm) {
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

  // 1. 比對口語同義詞字典（標準化後簡繁互通）
  const combinedSynonyms = { ...COLLOQUIAL_SYNONYMS, ...EAR_SYNONYMS, ...CHILD_SYNONYMS };
  Object.entries(combinedSynonyms).forEach(([keyword, pointIds]) => {
    const kwNorm = normalizeSearchText(keyword);
    if (kwNorm.includes(qNorm) || qNorm.includes(kwNorm)) {
      pointIds.forEach((id) => matchedSet.add(id));
    }
  });

  // 2. 比對穴位名、代碼、去聲調拼音（支援 "hegu" / "zusanli"）、經絡、功效、適應症與本草食療
  ACUPOINTS.forEach((pt) => {
    const diet = DIETARY_THERAPY[pt.id];
    const dietText = diet ? `${diet.teaName} ${diet.ingredients} ${diet.cvsOption}` : '';
    const parts = [
      pt.name,
      pt.id,
      pt.pinyin,
      pt.meridian,
      ...pt.benefits.symptoms,
      ...pt.benefits.tcmFunctions,
      dietText
    ];
    if (matchesNormalizedQuery(parts, rawQuery)) {
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
    if (firstMatch) selectAcupoint(firstMatch, true);
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

  if (matched.length > 0) selectAcupoint(matched[0].id, true);
  else renderBodyCanvas();
}

function clearAllFilters() {
  state.activePresetId = null;
  state.activeSymptomTag = null;
  state.activePosture = null;
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
  const currentZiwu =
    ZIWU_LIUZHU.find((item) => {
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

  if (badge) badge.textContent = `${currentZiwu.zhi}・${currentZiwu.meridian}`;
  if (text) text.textContent = `當令養${currentZiwu.organ}｜宜按：${recNames}${shortDrink}`;

  banner?.addEventListener('click', () => {
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

// 關閉全部已開啟的彈窗
function closeAllModals() {
  if (arModuleInstance?.isArModalOpen()) {
    arModuleInstance.closeArModal();
  }
  zenModuleInstance?.closeZenMode();
  ['settingsModal', 'presetEditorModal', 'symptomWizardModal', 'directoryModal', 'painHistoryModal', 'compareModal'].forEach((id) => {
    document.getElementById(id)?.classList.remove('open');
  });
}

// 同步還原所有已持久化的個人化設定
function applyPersistedSettingsUI() {
  const pregCheckbox = document.getElementById('pregnancySafeCheckbox');
  const pregLabel = document.getElementById('pregnancySafeToggle');
  const pregDot = document.getElementById('pregnancyActiveDot');
  if (pregCheckbox) pregCheckbox.checked = !!state.pregnancySafeMode;
  pregLabel?.classList.toggle('active', !!state.pregnancySafeMode);
  if (pregDot) pregDot.style.display = state.pregnancySafeMode ? 'inline' : 'none';

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) soundToggle.checked = state.settings?.soundEnabled !== false;

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

// 免手碰語音口令與鍵盤快捷鍵調度中心
function handleVoiceOrKeyboardAction(action) {
  switch (action) {
    case 'toggleTimer':
      toggleTimer();
      break;
    case 'start':
      if (!state.timer.running) toggleTimer();
      break;
    case 'pause':
      if (state.timer.running) toggleTimer();
      break;
    case 'next': {
      const list = state.activePresetId
        ? getAllPresets().find((p) => p.id === state.activePresetId)?.points || []
        : state.highlightedIds.size > 0
          ? [...state.highlightedIds]
          : ACUPOINTS.map((p) => p.id);
      if (list.length > 0) {
        const curIdx = list.indexOf(state.selectedPointId);
        selectAcupoint(list[(curIdx + 1) % list.length], true);
      }
      break;
    }
    case 'prev': {
      const list = state.activePresetId
        ? getAllPresets().find((p) => p.id === state.activePresetId)?.points || []
        : state.highlightedIds.size > 0
          ? [...state.highlightedIds]
          : ACUPOINTS.map((p) => p.id);
      if (list.length > 0) {
        const curIdx = list.indexOf(state.selectedPointId);
        selectAcupoint(list[(curIdx - 1 + list.length) % list.length], true);
      }
      break;
    }
    case 'switchSide':
      triggerManualSwitchSide();
      break;
    case 'flipCloseup':
      document.getElementById('flipCloseupBtn')?.click();
      break;
    case 'capture':
      if (!arModuleInstance?.isArModalOpen()) {
        showToast('💡 請先開啟 AR 鏡頭後再說「定格」或「拍照」');
        return;
      }
      document.getElementById('freezeArBtn')?.click();
      break;
    case 'openAr':
      openLazyArModal();
      break;
    case 'closeModal':
      closeAllModals();
      break;
  }
}

async function openLazyArModal() {
  const arPackBtn = document.getElementById('preloadArPackBtn');
  if (arPackBtn) {
    getArPackStatus().then((status) => {
      if (status.supported && status.cached === status.total && status.total > 0) {
        arPackBtn.textContent = '✓ AR離線已就緒';
      }
    });
  }
  const mod = await getArModule();
  mod.openArModal(state.selectedPointId);
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
  document.getElementById('symptomSearchInput')?.addEventListener('input', (e) => applyColloquialSearch(e.target.value));
  document.getElementById('clearSearchBtn')?.addEventListener('click', clearAllFilters);

  // ⚙️ 個人化設定彈窗
  const settingsModal = document.getElementById('settingsModal');
  document.getElementById('openSettingsBtn')?.addEventListener('click', () => {
    updateReminderUI();
    settingsModal?.classList.add('open');
  });
  document.getElementById('closeSettingsBtn')?.addEventListener('click', () => settingsModal?.classList.remove('open'));
  settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('open');
  });

  // 🩺 3 題問診精靈（懶載入）
  document.getElementById('openWizardBtn')?.addEventListener('click', async () => {
    const { openSymptomWizardModal } = await import('./modules/wizard.js');
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

  // 📋 56 穴經絡與部位目錄總表抽屜（懶載入）
  document.getElementById('openDirectoryBtn')?.addEventListener('click', async () => {
    const { openDirectoryModal } = await import('./modules/directory.js');
    openDirectoryModal(ACUPOINTS, (pid) => selectAcupoint(pid, true));
  });

  // 🤰 孕期安全鎖（持久化）
  document.getElementById('pregnancySafeCheckbox')?.addEventListener('change', (e) => {
    state.pregnancySafeMode = e.target.checked;
    state.settings.pregnancySafeMode = state.pregnancySafeMode;
    saveSettings();
    applyPersistedSettingsUI();
    renderBodyCanvas();
    const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (currentPt) renderInspector(currentPt);
    updatePlaylistBannerUI();
    showToast(state.pregnancySafeMode ? '🤰 已開啟並記住「孕期安全鎖」' : '已關閉孕期安全鎖');
  });

  // 🔔 頌缽與語音開關持久化
  document.getElementById('soundToggle')?.addEventListener('change', (e) => {
    state.settings.soundEnabled = e.target.checked;
    saveSettings();
  });

  // 🔠 長輩大字體模式
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

  // 💪 按壓節奏強度
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

  // 📜 打卡歷史明細 & 🖼️ 體質週報卡 PNG（懶載入）
  document.getElementById('openPainHistoryBtn')?.addEventListener('click', openPainHistoryModal);
  document.getElementById('exportReportCardBtn')?.addEventListener('click', async () => {
    const { exportConstitutionReportCard } = await import('./modules/reportCard.js');
    exportConstitutionReportCard(calculateStreakDays(state.painLogs));
  });

  // 📝 單穴個人手感筆記自動儲存
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
      if (val.trim()) state.pointNotes[pid] = val;
      else delete state.pointNotes[pid];
      savePointNotes();
      if (pointNoteStatus) pointNoteStatus.textContent = val.trim() ? '✓ 已存本機' : '自動儲存於本機';
    }, 350);
  });

  // ⭐ 收藏穴位
  document.getElementById('favPointBtn')?.addEventListener('click', () => {
    const pid = state.selectedPointId;
    if (state.favorites.has(pid)) {
      state.favorites.delete(pid);
      if (state.activePresetId === 'fav_custom' && state.favorites.size === 0) state.activePresetId = null;
    } else {
      state.favorites.add(pid);
    }
    saveFavorites();
    updateFavButtonUI(pid);
    renderPresetRow();
    updatePlaylistBannerUI();
  });

  // 🖨️ 列印／存 PDF 穴位養生圖解單（P2-1）
  document.getElementById('printPointBtn')?.addEventListener('click', () => {
    window.print();
  });

  // 🩺 按後痛感打卡
  document.querySelectorAll('.pain-log-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const painType = btn.getAttribute('data-pain');
      if (painType) recordPainSensation(painType);
    });
  });

  // 🔍 局部放大聚焦開關 & 骨骼透視滑桿
  const zoomToggleBtn = document.getElementById('zoomToggleBtn');
  zoomToggleBtn?.addEventListener('click', () => {
    state.autoZoomEnabled = !state.autoZoomEnabled;
    zoomToggleBtn.textContent = state.autoZoomEnabled ? '🔍 局部放大聚焦：開' : '🔍 局部放大聚焦：關';
    zoomToggleBtn.classList.toggle('active', state.autoZoomEnabled);
    const point = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (state.autoZoomEnabled && point) applySvgZoomForPoint(point);
    else resetSvgZoom();
  });

  document.getElementById('resetZoomFloatingBtn')?.addEventListener('click', resetSvgZoom);
  document.getElementById('xraySlider')?.addEventListener('input', (e) => {
    state.xrayOpacity = Number(e.target.value) / 100;
    const layer = document.querySelector('.skeleton-layer');
    if (layer) layer.style.opacity = state.xrayOpacity;
  });

  document.querySelectorAll('.detail-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchDetailTab(btn.getAttribute('data-tab')));
  });

  // ⏱️ 計時器 & 處方連播
  document.getElementById('startTimerBtn')?.addEventListener('click', () => toggleTimer());
  document.getElementById('resetTimerBtn')?.addEventListener('click', () => {
    state.playlist.isPlaying = false;
    stopAndResetTimer();
    updatePlaylistBannerUI();
  });
  document.getElementById('startPlaylistBtn')?.addEventListener('click', togglePlaylistExecution);

  document.getElementById('editPlaylistBtn')?.addEventListener('click', async () => {
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

    const { renderPresetEditorModal } = await import('./modules/presetEditor.js');
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

  // 🔗 分享穴位與分享處方
  document.getElementById('sharePointBtn')?.addEventListener('click', () => {
    const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (pt) shareAcupointLink(pt);
  });
  document.getElementById('sharePlaylistBtn')?.addEventListener('click', () => {
    const preset = getAllPresets().find((p) => p.id === state.activePresetId);
    if (preset) sharePresetLink(preset, ACUPOINTS);
    else showToast('請先由上方處方籤列選擇一組處方再分享');
  });

  // 🎙️ 語音控制 & 🔄 微距翻轉 & ↩ 撤銷打卡
  document.getElementById('voiceControlBtn')?.addEventListener('click', toggleVoiceControl);
  document.getElementById('timerVoiceBtn')?.addEventListener('click', toggleVoiceControl);

  const flipBtn = document.getElementById('flipCloseupBtn');
  const closeupWrap = document.getElementById('closeupSvgContainer');
  if (flipBtn && closeupWrap) {
    flipBtn.addEventListener('click', () => {
      const isMirrored = closeupWrap.classList.toggle('mirrored');
      flipBtn.classList.toggle('active', isMirrored);
      flipBtn.textContent = isMirrored ? '🔄 已鏡像翻轉（再按復原）' : '🔄 換側對照';
    });
  }

  document.getElementById('undoPainLogBtn')?.addEventListener('click', () => {
    if (state.painLogs.length === 0) return;
    const removed = state.painLogs.pop();
    savePainLogs();
    updatePainLogAndConstitutionUI();
    const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (pt) renderDietaryTherapy(pt);
    showToast(`↩ 已撤銷「${removed.pointName || removed.pointId}」上一筆手感紀錄`);
  });

  document.querySelectorAll('#searchNoResultBanner [data-quick-preset]').forEach((btn) => {
    btn.addEventListener('click', () => activatePresetById(btn.getAttribute('data-quick-preset')));
  });

  // 🌙 主題 & ⏰ 每日提醒 & 📤 備份還原
  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const nextMode = cycleThemeMode();
    const labelMap = { auto: '跟隨系統自動切換', dark: '夜間護眼深色模式', light: '日間宣紙淺色模式' };
    showToast(`🎨 已切換為：${labelMap[nextMode]}`);
  });

  const reminderTimeInput = document.getElementById('reminderTimeInput');
  reminderTimeInput?.addEventListener('change', (e) => setReminderTime(e.target.value));
  document.querySelectorAll('.reminder-quick-time').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-time');
      if (t) setReminderTime(t);
    });
  });
  document.getElementById('reminderToggleBtn')?.addEventListener('click', () => {
    toggleDailyReminder(reminderTimeInput?.value || state.settings.reminderTime || '21:30');
  });
  document.getElementById('downloadIcsBtn')?.addEventListener('click', () => {
    const t = reminderTimeInput?.value || state.settings.reminderTime || '21:30';
    downloadCalendarReminderIcs(t);
    showToast(`📅 已下載每日 ${t} 行事曆循環提醒 (.ics)`);
  });

  document.getElementById('backupExportBtn')?.addEventListener('click', async () => {
    const res = await exportBackup();
    if (res === 'downloaded') showToast('📤 已下載本機收藏、自訂處方與體質紀錄備份檔 (.json)');
    else if (res === 'shared') showToast('📤 已匯出備份檔');
  });

  const backupInput = document.getElementById('backupFileInput');
  document.getElementById('backupImportBtn')?.addEventListener('click', () => backupInput?.click());
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

  // 📦 AR 離線模型包 & 📷 AR 開啟（懶載入 arFinder.js）
  const arPackBtn = document.getElementById('preloadArPackBtn');
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

  document.getElementById('headerArBtn')?.addEventListener('click', openLazyArModal);
  document.getElementById('inspectorArBtn')?.addEventListener('click', openLazyArModal);

  // 🆚 易混淆鄰穴對比（懶載入）
  document.getElementById('comparePointBtn')?.addEventListener('click', async () => {
    const { openPointCompareModal } = await import('./modules/compare.js');
    openPointCompareModal(state.selectedPointId, ACUPOINTS, (pid) => selectAcupoint(pid, true));
  });

  // 🧘 全螢幕沉浸跟練模式（懶載入）
  document.getElementById('openZenModeBtn')?.addEventListener('click', async () => {
    const mod = await import('./modules/zenMode.js');
    zenModuleInstance = mod;
    mod.openZenMode({
      getAllPoints: () => ACUPOINTS,
      onToggleTimer: () => toggleTimer(),
      onSwitchSide: triggerManualSwitchSide,
      onNext: () => handleVoiceOrKeyboardAction('next'),
      onPrev: () => handleVoiceOrKeyboardAction('prev'),
      onRecordPain: recordPainSensation
    });
  });

  // 📱 手機版雙向智慧懸浮導引膠囊
  const mobileFab = document.getElementById('mobileJumpFab');
  const inspectorCard = document.getElementById('inspectorCard');
  if (mobileFab && inspectorCard) {
    mobileFab.addEventListener('click', () => {
      if (isMobileViewingInspector) window.scrollTo({ top: 0, behavior: 'smooth' });
      else inspectorCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // ⏪ 瀏覽器上一頁／下一頁歷史同步
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
}

// 啟動應用
window.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  initModalScrollLock();
  applyPersistedSettingsUI();

  initPainLogDeps({
    getAllPoints: () => ACUPOINTS,
    getDietaryTherapy: () => DIETARY_THERAPY,
    switchDetailTab,
    renderDietaryTherapy
  });

  initInspectorDeps({
    selectAcupoint,
    applySymptomFilter
  });

  initTimerDeps({
    getAllPoints: () => ACUPOINTS,
    selectAcupoint,
    updatePlaylistBannerUI,
    onPointChanged: () => zenModuleInstance?.refreshZenModePoint()
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

  if (!handledPreset) {
    selectAcupoint(deep.pointId || 'LI4', !deep.view, false, { pushHistory: false });
  }

  registerServiceWorkerWithUpdates(() => {
    showToast('✨ 本草尋穴已於背景更新至最新版本，重新整理即可生效', 4500);
  });
});
