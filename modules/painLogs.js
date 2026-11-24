// 🩺 按後痛感體質打卡、連續天數 (Streak) 計算與歷史明細管理（從 app.js 拆分）
import { state } from './state.js';
import { savePainLogs } from './storage.js';
import { buildMeridianHeatmapHtml } from './heatmap.js';
import { showToast, escapeHtml } from './ui.js';

let deps = {
  getAllPoints: () => [],
  getDietaryTherapy: () => ({}),
  switchDetailTab: () => {},
  renderDietaryTherapy: () => {}
};

export function initPainLogDeps(injected) {
  deps = { ...deps, ...injected };
}

// 計算真實連續打卡天數（以使用者當地時區之日曆天為準）
export function calculateStreakDays(logs) {
  if (!logs || logs.length === 0) return 0;
  const formatD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${date}`;
  };

  const daySet = new Set(logs.map((log) => formatD(new Date(log.timestamp))));
  const now = new Date();
  const todayStr = formatD(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatD(yesterday);

  let currentCheck = new Date(now);
  if (!daySet.has(todayStr)) {
    if (daySet.has(yesterdayStr)) {
      currentCheck = yesterday;
    } else {
      return 0;
    }
  }

  let streak = 0;
  while (daySet.has(formatD(currentCheck))) {
    streak += 1;
    currentCheck.setDate(currentCheck.getDate() - 1);
  }
  return streak;
}

export function updatePainLogAndConstitutionUI() {
  const countEl = document.getElementById('totalLogsCount');
  if (countEl) countEl.textContent = String(state.painLogs.length);

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
    btn.classList.toggle('active', !!(latestForPoint && btn.getAttribute('data-pain') === latestForPoint.painType));
  });

  const insightEl = document.getElementById('constitutionInsight');
  if (!insightEl) return;

  if (state.painLogs.length === 0) {
    insightEl.style.display = 'none';
    return;
  }

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

    const diet = deps.getDietaryTherapy()[state.selectedPointId];
    if (diet && diet.byPainType?.[latestForPoint.painType]) {
      lines.push(`🍵 <strong>專屬對證食療：</strong>${escapeHtml(diet.byPainType[latestForPoint.painType])}`);
    }
  }

  if (topSharp) {
    lines.push(
      `🔥 <strong>近期易堵經絡：</strong>【${escapeHtml(topSharp[0])}】（累計 ${topSharp[1]} 次痠脹刺痛，中醫所謂「不通則痛」，日常可多推揉該經絡疏通氣機）`
    );
  }
  if (topEmpty) {
    lines.push(
      `🌿 <strong>需溫養經絡：</strong>【${escapeHtml(topEmpty[0])}】（累計 ${topEmpty[1]} 次按之空軟，中醫所謂「不榮則痛」，宜早睡並配合溫水泡腳養血）`
    );
  }
  if (!topSharp && !topEmpty && smoothCount > 0) {
    lines.push(`✨ <strong>整體經絡狀態：</strong>近期打卡 ${smoothCount} 次皆為「微痠舒暢」，代表周身氣血運行相當平順！`);
  }

  lines.push(
    `<button type="button" id="jumpToDietTabBtn" class="pairing-Jump-btn" style="margin-top:6px;">🍵 查看本穴 3 分鐘茶飲＆超商外食清單 →</button>`
  );

  const heatmapHtml = buildMeridianHeatmapHtml(state.painLogs);
  insightEl.innerHTML = lines.join('<br/>') + heatmapHtml;
  insightEl.style.display = 'block';

  document.getElementById('jumpToDietTabBtn')?.addEventListener('click', () => {
    deps.switchDetailTab('tab-diet');
  });
}

export function recordPainSensation(painType) {
  const point = deps.getAllPoints().find((p) => p.id === state.selectedPointId);
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
  deps.renderDietaryTherapy(point);
}

// 📜 打卡歷史明細管理彈窗（單筆刪除 / 清空全部 / 按需載入週報卡 PNG）
export function openPainHistoryModal() {
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
    modal.querySelector('#historyExportCardBtn')?.addEventListener('click', async () => {
      const { exportConstitutionReportCard } = await import('./reportCard.js');
      exportConstitutionReportCard(calculateStreakDays(state.painLogs));
    });
    modal.querySelectorAll('[data-del-log-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-del-log-idx'));
        if (idx >= 0 && idx < state.painLogs.length) {
          state.painLogs.splice(idx, 1);
          savePainLogs();
          updatePainLogAndConstitutionUI();
          const pt = deps.getAllPoints().find((p) => p.id === state.selectedPointId);
          if (pt) deps.renderDietaryTherapy(pt);
          paint();
        }
      });
    });
    modal.querySelector('#clearAllPainLogsBtn')?.addEventListener('click', () => {
      if (!window.confirm('確定要清空全部按後體感打卡紀錄嗎？（建議先匯出 JSON 備份）')) return;
      state.painLogs = [];
      savePainLogs();
      updatePainLogAndConstitutionUI();
      const pt = deps.getAllPoints().find((p) => p.id === state.selectedPointId);
      if (pt) deps.renderDietaryTherapy(pt);
      modal.classList.remove('open');
      showToast('🗑 已清空所有打卡紀錄');
    });
  };

  paint();
  modal.classList.add('open');
}
