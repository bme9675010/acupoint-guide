// 📋 右側穴位詳情面板、食療專區與收藏按鈕渲染（從 app.js 拆分，徹底移除硬編碼暗黑不可讀色）
import { state } from './state.js';
import {
  ACUPOINTS,
  ZIWU_LIUZHU,
  DIETARY_THERAPY,
  ZIWU_DIET,
  getCurrentSolarTerm,
  getCloseupSvgMarkup
} from '../data/index.js';
import { formatTime, getEffectiveRhythm } from './timer.js';
import { updatePainLogAndConstitutionUI } from './painLogs.js';
import { getConfusionGroupForPoint } from './compare.js';
import { escapeHtml } from './ui.js';

let deps = {
  selectAcupoint: () => {},
  applySymptomFilter: () => {}
};

export function initInspectorDeps(injected) {
  deps = { ...deps, ...injected };
}

export function updateFavButtonUI(pointId) {
  const favBtn = document.getElementById('favPointBtn');
  if (!favBtn) return;
  const isFav = state.favorites.has(pointId);
  favBtn.textContent = isFav ? '⭐ 已收藏' : '☆ 收藏';
  favBtn.classList.toggle('active', isFav);
}

// 渲染分頁 4：🍵 本草食療專區
export function renderDietaryTherapy(point) {
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
            ${escapeHtml(diet.byPainType[type])}
          </div>
        `;
      })
      .join('');
  }

  // 更新當下時辰子午流注當令飲品
  const hour = new Date().getHours();
  const currentZiwu =
    ZIWU_LIUZHU.find((item) => {
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

// 更新右側詳情面板內容
export function renderInspector(point) {
  document.getElementById('pointName').textContent = point.name;
  document.getElementById('pointCode').textContent = point.id;
  document.getElementById('pointPinyin').textContent = point.pinyin;
  document.getElementById('pointMeridian').textContent = point.meridian;
  document.getElementById('pointAttr').textContent = point.attribute;

  // 語意 CSS Class 取代硬編碼淺色 inline style（確保夜間深色模式高對比，P0-1）
  const sideBadge = document.getElementById('pointSideBadge');
  if (sideBadge) {
    const midlineIds = new Set(['GV20', 'EX-HN3', 'CV17', 'CV12', 'CV6', 'GV14']);
    sideBadge.removeAttribute('style');
    let badgeTone = 'side-badge-green';
    if (point.id.startsWith('PED-')) {
      sideBadge.textContent = '👶 小兒推拿特定穴（手法宜輕快柔和・塗乳液防破皮）';
      badgeTone = 'side-badge-green';
    } else if (point.id === 'GB39') {
      sideBadge.textContent = '🌱 青少年轉骨長高要穴（八會穴之髓會・雙側皆可按）';
      badgeTone = 'side-badge-amber';
    } else if (point.id === 'ST2') {
      sideBadge.textContent = '👀 學生護眼操核心穴（雙側眼眶眶下孔・輕柔按揉）';
      badgeTone = 'side-badge-amber';
    } else if (point.id === 'REFLEX-LIVER') {
      sideBadge.textContent = '🟢 僅按【右腳底】外側（左腳無此區）';
      badgeTone = 'side-badge-green';
    } else if (point.id === 'REFLEX-HEART') {
      sideBadge.textContent = '🔴 僅按【左腳底】外側（右腳無此區）';
      badgeTone = 'side-badge-red';
    } else if ('child' in point.views) {
      sideBadge.textContent = '👶 小兒經絡與青少年生長穴（輕揉撫按）';
      badgeTone = 'side-badge-green';
    } else if ('ear' in point.views) {
      sideBadge.textContent = '👂 左右雙耳對稱（雙耳皆可對捏或貼耳豆）';
      badgeTone = 'side-badge-amber';
    } else if ('sole' in point.views) {
      sideBadge.textContent = '🦶 左右雙腳對稱（雙腳皆有・建議先左腳後右腳）';
      badgeTone = 'side-badge-amber';
    } else if (midlineIds.has(point.id)) {
      sideBadge.textContent = '🎯 正中線單穴（居中按壓）';
      badgeTone = 'side-badge-amber';
    } else {
      sideBadge.textContent = '👐 左右對稱雙穴（雙側皆可按）';
      badgeTone = 'side-badge-green';
    }
    sideBadge.className = `meridian-pill side-badge ${badgeTone}`;
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
    cautionEl.className = point.contraindications.pregnancyForbidden ? 'caution-banner' : 'caution-banner safe';
  }

  // 全庫 56 穴 100% 支援 AR，不需首屏載入 arFinder.js
  const inspectorArBtn = document.getElementById('inspectorArBtn');
  if (inspectorArBtn) {
    inspectorArBtn.textContent = `📷 AR 鏡頭照「${point.name}」`;
  }

  // 🔬 渲染 1:1 微距解剖與手指同身寸特寫 SVG
  const closeupContainer = document.getElementById('closeupSvgContainer');
  if (closeupContainer) {
    closeupContainer.innerHTML = getCloseupSvgMarkup(point.id);
  }

  // Tab 1: 精準找穴
  const stepsListEl = document.getElementById('locStepsList');
  if (stepsListEl && point.location.steps) {
    stepsListEl.innerHTML = point.location.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('');
  }

  const hitCorrectEl = document.getElementById('hitCorrectText');
  const hitWrongEl = document.getElementById('hitWrongText');
  if (hitCorrectEl && point.location.hitCheck) hitCorrectEl.textContent = point.location.hitCheck.correct;
  if (hitWrongEl && point.location.hitCheck) hitWrongEl.textContent = point.location.hitCheck.wrong;

  document.getElementById('locBoneTip').textContent = `📍 關鍵骨縫地標：${point.location.boneTip}`;
  document.getElementById('locCunRef').textContent = `📏 比例尺基準：${point.location.cunReference}`;
  document.getElementById('locAnatomical').textContent = `標準解剖定位：${point.location.anatomical}`;

  // 🆚 若本穴屬於易混淆鄰近穴位群組，顯示一鍵並排 PK 對比按鈕
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

  const clinicalEl = document.getElementById('clinicalCautionBox');
  if (clinicalEl) {
    if (['CV12', 'ST25', 'CV6'].includes(point.id)) {
      clinicalEl.textContent = '⚠️ 腹部安全守則：飯後 30–60 分鐘內或極度空腹時忌強力深壓腹部；有腹主動脈瘤、近期腹部手術或孕期請避開。';
    } else if (point.id.startsWith('PED-')) {
      clinicalEl.textContent = '👶 小兒推拿守則：主要適用於 0–6 歲嬰幼兒，務必先塗抹乳液潤滑皮膚、手法輕快柔和；高燒不退或精神萎靡請立刻就醫。';
    } else if (point.id.startsWith('REFLEX-') || point.id === 'KI1') {
      clinicalEl.textContent = '🦶 足底保健守則：飯後 1 小時內勿強壓足底；糖尿病足、足部外傷或服抗凝血劑者切忌重按，按後請飲溫水。';
    } else {
      clinicalEl.textContent = '⚠️ 安全守則：皮膚有傷口、發炎紅腫、嚴重靜脈曲張、高血壓急性期或正服用抗凝血劑者，切勿於局部強力深壓。';
    }
  }

  const { pressSeconds, releaseSeconds, totalDurationSec: effectiveSec, bilateral } = getEffectiveRhythm(point);
  document.getElementById('timerRhythmMeta').textContent =
    `深按 ${pressSeconds} 秒・放鬆 ${releaseSeconds} 秒（${bilateral ? '左右交替' : '單點按揉'}）`;
  document.getElementById('orbTotalLeft').textContent = `單穴時長 ${formatTime(effectiveSec)}`;

  const noteInput = document.getElementById('pointNoteInput');
  const noteStatus = document.getElementById('pointNoteStatus');
  if (noteInput) noteInput.value = state.pointNotes?.[point.id] || '';
  if (noteStatus) noteStatus.textContent = state.pointNotes?.[point.id] ? '✓ 已存本機' : '自動儲存於本機';

  // Tab 3: 功效與配穴
  const tcmList = document.getElementById('tcmFunctionsList');
  tcmList.innerHTML = point.benefits.tcmFunctions.map((fn) => `<span class="tcm-pill">${escapeHtml(fn)}</span>`).join('');

  const symList = document.getElementById('symptomPillsList');
  symList.innerHTML = point.benefits.symptoms
    .map((sym) => `<button type="button" class="symptom-pill-btn" data-symptom="${escapeHtml(sym)}">${escapeHtml(sym)}</button>`)
    .join('');

  symList.querySelectorAll('.symptom-pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sym = btn.getAttribute('data-symptom');
      deps.applySymptomFilter(sym);
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
              【${escapeHtml(pair.comboName)}】配 ${escapeHtml(partnerName)}
            </strong>
            <p style="font-size: 0.82rem; color: var(--ink-muted); margin-top: 3px;">${escapeHtml(pair.purpose)}</p>
          </div>
          <button type="button" class="pairing-Jump-btn" data-jump-id="${escapeHtml(pair.partnerId)}">
            查看${escapeHtml(partner ? partner.name : '配穴')} →
          </button>
        </div>
      `;
    })
    .join('');

  pairingsBox.querySelectorAll('.pairing-Jump-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-jump-id');
      deps.selectAcupoint(targetId, true);
    });
  });
}
