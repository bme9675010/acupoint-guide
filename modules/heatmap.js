// 📊 近 30 天經絡痛感體質熱力分佈條 + 近 28 天養生打卡日曆熱力格（P2-3）

function formatLocalDayKey(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function build28DayCalendarHtml(painLogs) {
  const logs = Array.isArray(painLogs) ? painLogs : [];
  const byDay = new Map();

  logs.forEach((l) => {
    if (!l?.timestamp) return;
    const key = formatLocalDayKey(l.timestamp);
    if (!byDay.has(key)) byDay.set(key, { count: 0, sharp: 0, empty: 0, smooth: 0 });
    const b = byDay.get(key);
    b.count += 1;
    if (l.painType === 'sharp') b.sharp += 1;
    else if (l.painType === 'empty') b.empty += 1;
    else b.smooth += 1;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatLocalDayKey(today.getTime());

  const cells = [];
  let activeDays = 0;
  for (let offset = 27; offset >= 0; offset--) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = formatLocalDayKey(d.getTime());
    const info = byDay.get(key);
    const isToday = key === todayKey;
    const labelDate = `${d.getMonth() + 1}/${d.getDate()}`;

    let cls = 'cal-cell';
    let tip = `${labelDate}：尚未打卡`;
    if (info && info.count > 0) {
      activeDays += 1;
      const dominant =
        info.sharp >= info.empty && info.sharp >= info.smooth
          ? 'sharp'
          : info.empty >= info.smooth
            ? 'empty'
            : 'smooth';
      const domLabel = dominant === 'sharp' ? '偏氣滯痠痛' : dominant === 'empty' ? '偏氣虛空軟' : '微痠通暢';
      cls += ` active ${dominant}`;
      if (info.count >= 3) cls += ' high';
      tip = `${labelDate}：按導 ${info.count} 次（主手感：${domLabel}）`;
    }
    if (isToday) cls += ' today';

    cells.push(
      `<span class="${cls}" title="${tip}" aria-label="${tip}">${info && info.count > 0 ? info.count : ''}</span>`
    );
  }

  return `
    <div class="checkin-calendar-box">
      <div class="heatmap-header">
        <strong>📅 近 28 天養生打卡日曆</strong>
        <span class="heatmap-count">出勤 ${activeDays} / 28 天</span>
      </div>
      <div class="checkin-calendar-grid">${cells.join('')}</div>
    </div>
  `;
}

export function buildMeridianHeatmapHtml(painLogs) {
  if (!Array.isArray(painLogs) || painLogs.length === 0) return '';

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = painLogs.filter((l) => !l.timestamp || l.timestamp >= cutoff);
  const source = recent.length > 0 ? recent : painLogs;

  const statsMap = {};
  source.forEach((log) => {
    const rawMeridian = log.meridian || '其他經絡';
    const shortName = rawMeridian.replace(/（.*?）/g, '').slice(0, 7);
    if (!statsMap[shortName]) {
      statsMap[shortName] = { sharp: 0, empty: 0, smooth: 0, total: 0 };
    }
    const bucket = statsMap[shortName];
    if (log.painType === 'sharp') bucket.sharp += 1;
    else if (log.painType === 'empty') bucket.empty += 1;
    else bucket.smooth += 1;
    bucket.total += 1;
  });

  const rows = Object.entries(statsMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
    .map(([meridianName, st]) => {
      const pSharp = Math.round((st.sharp / st.total) * 100);
      const pEmpty = Math.round((st.empty / st.total) * 100);
      const pSmooth = Math.max(0, 100 - pSharp - pEmpty);

      return `
        <div class="heatmap-row">
          <div class="heatmap-label">
            <span>${meridianName}</span>
            <span class="heatmap-count">${st.total}次</span>
          </div>
          <div class="heatmap-bar" title="劇痛氣滯 ${st.sharp} 次｜空軟氣虛 ${st.empty} 次｜微痠通暢 ${st.smooth} 次">
            ${pSharp > 0 ? `<span class="hm-seg sharp" style="width:${pSharp}%"></span>` : ''}
            ${pEmpty > 0 ? `<span class="hm-seg empty" style="width:${pEmpty}%"></span>` : ''}
            ${pSmooth > 0 ? `<span class="hm-seg smooth" style="width:${pSmooth}%"></span>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    ${build28DayCalendarHtml(painLogs)}
    <div class="meridian-heatmap-box">
      <div class="heatmap-header">
        <strong>📊 近 30 天經絡體感熱力圖</strong>
        <span class="heatmap-legend">
          <i class="hm-dot sharp"></i>氣滯劇痛
          <i class="hm-dot empty"></i>氣虛空軟
          <i class="hm-dot smooth"></i>通暢
        </span>
      </div>
      ${rows}
    </div>
  `;
}
