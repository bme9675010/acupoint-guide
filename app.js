import {
  ACUPOINTS,
  SYMPTOM_PRESETS,
  ZIWU_LIUZHU,
  DIETARY_THERAPY,
  ZIWU_DIET,
  EAR_SYNONYMS,
  CHILD_SYNONYMS,
  getCloseupSvgMarkup
} from './data/index.js';
import { AR_SUPPORTED_POINTS, openArModal, initArControls } from './arFinder.js';
import { state, COLLOQUIAL_SYNONYMS } from './modules/state.js';
import { requestWakeLock, releaseWakeLock, playSingingBowl, speakGuide, vibrate } from './modules/audio.js';
import { getBaseBodySvgMarkup } from './modules/bodySvg.js';
import { loadPersistedData, saveFavorites, savePainLogs, exportBackup, importBackup } from './modules/storage.js';
import { showToast } from './modules/ui.js';
import { readDeepLinkFromUrl, syncUrlWithState, shareAcupointLink, sharePresetLink } from './modules/deeplink.js';
import {
  initCanvasGestures,
  setCurrentViewBox,
  resetViewBoxTransform,
  wasDraggingCanvas,
  bindNodeKeyboardEvents
} from './modules/gestures.js';
import { initThemeListener, cycleThemeMode } from './modules/theme.js';
import { toggleDailyReminder, startReminderScheduler } from './modules/reminder.js';
import { buildMeridianHeatmapHtml } from './modules/heatmap.js';
import { renderPresetEditorModal } from './modules/presetEditor.js';
import { POSTURE_SCENARIOS } from './modules/posture.js';
import { getArPackStatus, preloadArPack, registerServiceWorkerWithUpdates } from './modules/offline.js';

// 渲染人體 SVG 與穴位點
function renderBodyCanvas() {
  const svg = document.getElementById('bodySvg');
  if (!svg) return;

  const baseMarkup = getBaseBodySvgMarkup(state.currentView, state.xrayOpacity);
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

  svg.innerHTML = baseMarkup + `<g class="acupoints-layer">${nodesMarkup.join('')}</g>`;

  svg.querySelectorAll('.acupoint-node, .reflex-zone-poly').forEach((node) => {
    node.addEventListener('click', () => {
      if (wasDraggingCanvas()) return;
      const pointId = node.getAttribute('data-point-id');
      if (pointId) selectAcupoint(pointId, true);
    });
  });

  bindNodeKeyboardEvents(svg, (pointId) => selectAcupoint(pointId, true));
}

// 選取穴位並更新右側教學面板
function selectAcupoint(pointId, autoSwitchViewIfNeeded = false, keepTimerIfPlaylist = false) {
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
    stopAndResetTimer();
  }
  renderBodyCanvas();
  applySvgZoomForPoint(point);
  renderInspector(point);
  updatePlaylistBannerUI();
  syncUrlWithState();
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

  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    const streak = calculateStreakDays(state.painLogs);
    streakBadge.textContent = streak > 0 ? `🔥 連續 ${streak} 天` : '🌱 今日尚未打卡';
    streakBadge.title = `已連續打卡 ${streak} 天・累計 ${state.painLogs.length} 次手感紀錄`;
  }

  const undoBtn = document.getElementById('undoPainLogBtn');
  if (undoBtn) {
    undoBtn.style.display = state.painLogs.length > 0 ? 'inline-block' : 'none';
  }

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

  // Tab 2: 如何按揉
  document.getElementById('guideTechnique').textContent = `【手法】${point.massageGuide.technique}`;
  document.getElementById('guideFinger').textContent = point.massageGuide.fingerToUse;
  document.getElementById('guideSensation').textContent = point.massageGuide.sensation;

  const { pressSeconds, releaseSeconds, totalDurationSec, bilateral } = point.massageGuide.rhythm;
  document.getElementById('timerRhythmMeta').textContent =
    `深按 ${pressSeconds} 秒・放鬆 ${releaseSeconds} 秒（${bilateral ? '左右交替' : '單點按揉'}）`;
  document.getElementById('orbTotalLeft').textContent =
    `單穴時長 ${formatTime(totalDurationSec)}`;

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

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function switchDetailTab(tabId) {
  document.querySelectorAll('.detail-tab-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach((p) => {
    p.classList.toggle('active', p.id === tabId);
  });
}

// 取得所有處方（含動態「⭐ 我的收藏處方」）
function getAllPresets() {
  const list = [...SYMPTOM_PRESETS];
  if (state.favorites.size > 0) {
    const favPoints = [...state.favorites];
    const favNames = favPoints
      .map((id) => ACUPOINTS.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join('＋');
    list.unshift({
      id: 'fav_custom',
      title: '我的收藏處方',
      subtitle: `${favNames}${favPoints.length > 3 ? ` 等 ${favPoints.length} 穴` : ''}`,
      icon: '⭐',
      points: favPoints
    });
  }
  return list;
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
    editBtn.style.display = state.activePresetId === 'fav_custom' ? 'inline-block' : 'none';
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
  state.playlist.isPlaying = true;
  state.playlist.queue = queue;
  state.playlist.currentIndex = 0;
  state.playlist.completedIds.clear();

  const firstId = state.playlist.queue[0];
  const firstPt = ACUPOINTS.find((p) => p.id === firstId);
  selectAcupoint(firstId, true, false);
  switchDetailTab('tab-massage');
  updatePlaylistBannerUI();

  if (firstPt) {
    const skipNotice = state.pregnancySafeMode && queue.length < preset.points.length
      ? '，已自動略過孕婦禁穴'
      : '';
    speakGuide(`開始${preset.title}處方跟練${skipNotice}，第一穴：${firstPt.name}穴，請深按`);
  }
  toggleTimer();
}

// 啟動或暫停呼吸跟練計時器（支援單穴跟練與處方自動跳下一穴 + iPhone 螢幕防休眠）
function toggleTimer() {
  const point = ACUPOINTS.find((p) => p.id === state.selectedPointId);
  if (!point) return;

  const btn = document.getElementById('startTimerBtn');
  const ring = document.getElementById('breathingRing');
  const phaseEl = document.getElementById('orbPhase');
  const secEl = document.getElementById('orbSeconds');
  const totalEl = document.getElementById('orbTotalLeft');

  if (state.timer.running) {
    clearInterval(state.timer.intervalId);
    state.timer.running = false;
    btn.textContent = '繼續跟練';
    phaseEl.textContent = '已暫停';
    ring.className = 'breathing-orb-ring';
    releaseWakeLock();
    return;
  }

  const { pressSeconds, releaseSeconds, totalDurationSec } = point.massageGuide.rhythm;
  const effectiveDurationSec = state.playlist.durations?.[point.id] || totalDurationSec;
  if (state.timer.phase === 'idle') {
    state.timer.phase = 'press';
    state.timer.phaseTimeLeft = pressSeconds;
    state.timer.totalTimeLeft = effectiveDurationSec;
  }

  state.timer.running = true;
  btn.textContent = '暫停跟練';
  requestWakeLock();

  const updateTimerUI = (triggerSound = false) => {
    const prefix = state.playlist.isPlaying
      ? `[處方 ${state.playlist.currentIndex + 1}/${state.playlist.queue.length} ${point.name}] `
      : '';
    const isChildPoint = point.id.startsWith('PED-');
    if (state.timer.phase === 'press') {
      phaseEl.textContent = isChildPoint ? '輕快推撫・柔和' : '吐氣・深按';
      ring.className = 'breathing-orb-ring pressing';
      if (triggerSound) {
        playSingingBowl('press');
        vibrate('press');
        speakGuide(isChildPoint ? '輕撫' : '深按');
      }
    } else {
      phaseEl.textContent = isChildPoint ? '順時慢撫・放鬆' : '吸氣・緩放';
      ring.className = 'breathing-orb-ring releasing';
      if (triggerSound) {
        playSingingBowl('release');
        vibrate('release');
        speakGuide('放鬆');
      }
    }
    secEl.textContent = `${state.timer.phaseTimeLeft}s`;
    totalEl.textContent = `${prefix}剩餘 ${formatTime(state.timer.totalTimeLeft)}`;
  };

  updateTimerUI(true);

  state.timer.intervalId = setInterval(() => {
    state.timer.phaseTimeLeft -= 1;
    state.timer.totalTimeLeft -= 1;

    if (state.timer.totalTimeLeft <= 0) {
      stopAndResetTimer();

      // 若處於「處方連續跟練模式」，自動推進到下一顆穴位！
      if (state.playlist.isPlaying) {
        state.playlist.completedIds.add(point.id);
        state.playlist.currentIndex += 1;

        if (state.playlist.currentIndex < state.playlist.queue.length) {
          const nextId = state.playlist.queue[state.playlist.currentIndex];
          const nextPt = ACUPOINTS.find((p) => p.id === nextId);
          selectAcupoint(nextId, true, false);
          updatePlaylistBannerUI();
          playSingingBowl('press');
          vibrate('switchSide');
          if (nextPt) {
            speakGuide(`完成${point.name}穴，現在換下一穴：${nextPt.name}穴，請深按`);
          }
          toggleTimer();
          return;
        } else {
          // 整套處方全部按完
          state.playlist.isPlaying = false;
          updatePlaylistBannerUI();
          phaseEl.textContent = '處方圓滿完成';
          secEl.textContent = '🎉';
          playSingingBowl('press');
          vibrate('done');
          speakGuide('恭喜您完成整套養生處方按揉，請紀錄下方按後手感並喝溫水休息');
          return;
        }
      }

      phaseEl.textContent = '功德圓滿';
      secEl.textContent = '✓';
      playSingingBowl('press');
      vibrate('done');
      speakGuide('按揉完成，請於下方點擊紀錄您的按後痛感');
      return;
    }

    // 若為左右雙穴，在計時過半（剩餘一半秒數）時自動提示「換另一側按揉」
    const halfSec = Math.floor(effectiveDurationSec / 2);
    if (point.massageGuide.rhythm.bilateral && state.timer.totalTimeLeft === halfSec) {
      playSingingBowl('press');
      vibrate('switchSide');
      speakGuide('時間過半，若單手按揉請換另一側');
      state.timer.phase = 'press';
      state.timer.phaseTimeLeft = pressSeconds;
      phaseEl.textContent = '🔄 請換另一側・深按';
      updateTimerUI(true);
      return;
    }

    if (state.timer.phaseTimeLeft <= 0) {
      if (state.timer.phase === 'press') {
        state.timer.phase = 'release';
        state.timer.phaseTimeLeft = releaseSeconds;
      } else {
        state.timer.phase = 'press';
        state.timer.phaseTimeLeft = pressSeconds;
      }
      updateTimerUI(true);
    } else {
      updateTimerUI(false);
    }
  }, 1000);
}

function stopAndResetTimer() {
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
  }
  releaseWakeLock();

  const point = ACUPOINTS.find((p) => p.id === state.selectedPointId);
  const totalSec = point ? point.massageGuide.rhythm.totalDurationSec : 60;

  state.timer = {
    running: false,
    phase: 'idle',
    phaseTimeLeft: 0,
    totalTimeLeft: totalSec,
    intervalId: null
  };

  const btn = document.getElementById('startTimerBtn');
  const ring = document.getElementById('breathingRing');
  const phaseEl = document.getElementById('orbPhase');
  const secEl = document.getElementById('orbSeconds');
  const totalEl = document.getElementById('orbTotalLeft');

  if (btn) btn.textContent = '開始跟練按揉';
  if (ring) ring.className = 'breathing-orb-ring';
  if (phaseEl) phaseEl.textContent = '準備開始';
  if (secEl) secEl.textContent = '--';
  if (totalEl) totalEl.textContent = `單穴時長 ${formatTime(totalSec)}`;
}

// 渲染處方籤列（含⭐我的收藏處方）
function renderPresetRow() {
  const presetRow = document.getElementById('presetRow');
  if (!presetRow) return;

  const allPresets = getAllPresets();
  presetRow.innerHTML = allPresets.map((preset) => `
    <div class="preset-card ${state.activePresetId === preset.id ? 'active' : ''}" data-preset-id="${preset.id}">
      <span class="preset-icon">${preset.icon}</span>
      <div>
        <div class="preset-title">${preset.title}</div>
        <div class="preset-sub">${preset.subtitle}</div>
      </div>
    </div>
  `).join('');

  presetRow.querySelectorAll('.preset-card').forEach((card) => {
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

      state.activePresetId = id;
      state.activeSymptomTag = null;
      presetRow.querySelectorAll('.preset-card').forEach((c) => c.classList.remove('active'));
      document.querySelectorAll('.symptom-chip').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      const preset = getAllPresets().find((p) => p.id === id);
      if (preset && preset.points.length > 0) {
        state.highlightedIds = new Set(preset.points);
        selectAcupoint(preset.points[0], true);
        updatePlaylistBannerUI();
        syncUrlWithState();
      }
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
  if (matchedSet.size === 0) {
    if (noResultEl) noResultEl.style.display = 'block';
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

  // 🤰 孕期安全鎖事件
  const pregCheckbox = document.getElementById('pregnancySafeCheckbox');
  const pregLabel = document.getElementById('pregnancySafeToggle');
  pregCheckbox?.addEventListener('change', (e) => {
    state.pregnancySafeMode = e.target.checked;
    pregLabel?.classList.toggle('active', state.pregnancySafeMode);
    renderBodyCanvas();
    const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (currentPt) renderInspector(currentPt);
    updatePlaylistBannerUI();
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

  document.getElementById('startTimerBtn')?.addEventListener('click', toggleTimer);
  document.getElementById('resetTimerBtn')?.addEventListener('click', () => {
    state.playlist.isPlaying = false;
    stopAndResetTimer();
    updatePlaylistBannerUI();
  });

  document.getElementById('startPlaylistBtn')?.addEventListener('click', togglePlaylistExecution);

  document.getElementById('editPlaylistBtn')?.addEventListener('click', () => {
    renderPresetEditorModal(ACUPOINTS, () => {
      renderPresetRow();
      updatePlaylistBannerUI();
      const currentPt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
      if (currentPt) renderInspector(currentPt);
    });
  });

  // 🔗 分享穴位連結
  document.getElementById('sharePointBtn')?.addEventListener('click', () => {
    const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
    if (pt) shareAcupointLink(pt);
  });

  // 🔗 分享處方箋連結
  document.getElementById('sharePlaylistBtn')?.addEventListener('click', () => {
    const preset = getAllPresets().find((p) => p.id === state.activePresetId);
    if (preset) {
      sharePresetLink(preset);
    } else {
      showToast('請先由上方處方籤列選擇一組處方再分享');
    }
  });

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
      const card = document.querySelector(`.preset-card[data-preset-id="${pid}"]`);
      if (card) {
        card.click();
      }
    });
  });

  // 🌙 夜間護眼模式切換
  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const nextMode = cycleThemeMode();
    const labelMap = { auto: '跟隨系統自動切換', dark: '夜間護眼深色模式', light: '日間宣紙淺色模式' };
    showToast(`🎨 已切換為：${labelMap[nextMode]}`);
  });

  // ⏰ 每日按穴提醒
  document.getElementById('reminderToggleBtn')?.addEventListener('click', () => {
    toggleDailyReminder('21:30');
  });

  // 📤 備份匯出 / 📥 備份還原
  document.getElementById('backupExportBtn')?.addEventListener('click', async () => {
    const res = await exportBackup();
    if (res === 'downloaded') showToast('📤 已下載本機收藏與體質紀錄備份檔 (.json)');
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
      renderPresetRow();
      updatePlaylistBannerUI();
      const pt = ACUPOINTS.find((p) => p.id === state.selectedPointId);
      if (pt) renderInspector(pt);
      showToast(`📥 還原成功！共 ${summary.favorites} 顆收藏穴位、${summary.logs} 筆體感紀錄`);
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
      showToast('📦 AR 手部與臉部 AI 模型已存入離線快取，無網路也能開 AR！');
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

  initArControls((newPointId) => {
    selectAcupoint(newPointId, true);
  });
}

// 啟動應用
window.addEventListener('DOMContentLoaded', () => {
  loadPersistedData();
  initThemeListener();
  startReminderScheduler();
  initZiwuLiuzhu();
  initFilters();
  initCanvasGestures();
  bindEvents();

  const deep = readDeepLinkFromUrl(ACUPOINTS, getAllPresets());
  if (deep.view) {
    state.currentView = deep.view;
    updateViewTabButtons();
  }
  if (deep.presetId) {
    const card = document.querySelector(`.preset-card[data-preset-id="${deep.presetId}"]`);
    if (card) {
      card.click();
    }
  } else {
    selectAcupoint(deep.pointId || 'LI4', !deep.view);
  }

  registerServiceWorkerWithUpdates(() => {
    showToast('✨ 本草尋穴已於背景更新至最新版本，重新整理即可生效', 4500);
  });
});
