// 🖼️ 一鍵生成「經絡體質週報卡（PNG 分享圖）」— 供自存紀錄或提供親友／中醫師參考
import { state } from './state.js';
import { getCurrentSolarTerm } from '../data/index.js';
import { showToast } from './ui.js';

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function wrapLines(ctx, text, maxWidth) {
  const chars = [...String(text || '')];
  const lines = [];
  let current = '';
  for (const ch of chars) {
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = ch;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function exportConstitutionReportCard(streakDays = 0) {
  const logs = state.painLogs || [];
  if (logs.length === 0) {
    showToast('🩺 請先紀錄至少 1 筆按後手感，即可生成專屬經絡體質週報卡！');
    return;
  }

  const W = 750;
  const H = 1040;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. 新中式宣紙底與墨綠邊框
  ctx.fillStyle = '#F6F2E9';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#D8CEBC';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, 24, 24, W - 48, H - 48, 22);
  ctx.stroke();

  // 2. 頂部硃砂印章與標題
  ctx.fillStyle = '#B83D2E';
  drawRoundRect(ctx, 54, 54, 72, 72, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(250, 247, 240, 0.7)';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, 60, 60, 60, 60, 10);
  ctx.stroke();

  ctx.fillStyle = '#FAF7F0';
  ctx.font = 'bold 22px "Noto Serif TC", "Microsoft JhengHei", serif';
  ctx.textAlign = 'center';
  ctx.fillText('本草', 90, 86);
  ctx.fillText('尋穴', 90, 114);

  const today = new Date();
  const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const termData = getCurrentSolarTerm(today);
  const term = termData?.current;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#1F3A2D';
  ctx.font = 'bold 34px "Noto Serif TC", "Microsoft JhengHei", serif';
  ctx.fillText('經絡體質養生週報卡', 146, 92);

  ctx.fillStyle = '#6E685D';
  ctx.font = '18px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`產出日期：${dateStr}${term ? `  ｜  當令節氣：${term.name}（${term.season}）` : ''}`, 146, 122);

  // 3. 統計卡片（連續天數 / 累計按導 / 近 30 天）
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = logs.filter((l) => !l.timestamp || l.timestamp >= cutoff);
  const source = recent.length > 0 ? recent : logs;

  const statsCards = [
    { label: '連續養生打卡', val: `${streakDays} 天`, color: '#B83D2E' },
    { label: '累計按導紀錄', val: `${logs.length} 次`, color: '#2E4F3E' },
    { label: '近 30 天體感樣本', val: `${source.length} 筆`, color: '#A86D26' }
  ];

  statsCards.forEach((card, i) => {
    const cx = 54 + i * 220;
    const cy = 158;
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, cx, cy, 202, 102, 14);
    ctx.fill();
    ctx.strokeStyle = '#E4DDD0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#756E63';
    ctx.font = '16px "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx.fillText(card.label, cx + 18, cy + 36);

    ctx.fillStyle = card.color;
    ctx.font = 'bold 34px "Noto Serif TC", "Microsoft JhengHei", serif';
    ctx.fillText(card.val, cx + 18, cy + 82);
  });

  // 4. 近 30 天各經絡痛感熱力條
  const statsMap = {};
  const sharpMap = {};
  const emptyMap = {};
  source.forEach((l) => {
    const m = (l.meridian || '其他經絡').replace(/（.*?）/g, '');
    if (!statsMap[m]) statsMap[m] = { sharp: 0, empty: 0, smooth: 0, total: 0 };
    if (l.painType === 'sharp') {
      statsMap[m].sharp += 1;
      sharpMap[m] = (sharpMap[m] || 0) + 1;
    } else if (l.painType === 'empty') {
      statsMap[m].empty += 1;
      emptyMap[m] = (emptyMap[m] || 0) + 1;
    } else {
      statsMap[m].smooth += 1;
    }
    statsMap[m].total += 1;
  });

  const topRows = Object.entries(statsMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const boxY = 286;
  ctx.fillStyle = '#FFFFFF';
  drawRoundRect(ctx, 54, boxY, W - 108, 336, 16);
  ctx.fill();
  ctx.strokeStyle = '#E4DDD0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#1F3A2D';
  ctx.font = 'bold 22px "Noto Serif TC", "Microsoft JhengHei", serif';
  ctx.fillText('📊 近 30 天經絡體感熱力分佈（前 5 經絡）', 80, boxY + 42);

  // 圖例
  const legends = [
    { label: '氣滯劇痛', color: '#C84B31', x: 400 },
    { label: '氣虛空軟', color: '#D49B42', x: 505 },
    { label: '微痠通暢', color: '#3E7A5D', x: 610 }
  ];
  legends.forEach((lg) => {
    ctx.fillStyle = lg.color;
    ctx.beginPath();
    ctx.arc(lg.x, boxY + 72, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5F594F';
    ctx.font = '14px "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx.fillText(lg.label, lg.x + 12, boxY + 77);
  });

  topRows.forEach(([mName, st], idx) => {
    const ry = boxY + 114 + idx * 44;
    ctx.fillStyle = '#2B2824';
    ctx.font = 'bold 17px "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx.fillText(mName.slice(0, 9), 80, ry);

    ctx.fillStyle = '#756E63';
    ctx.font = '15px "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${st.total}次`, 668, ry);
    ctx.textAlign = 'left';

    const barX = 248;
    const barW = 368;
    const barH = 16;
    const barY = ry - 14;
    ctx.fillStyle = '#EFE9DD';
    drawRoundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fill();

    let curX = barX;
    const segs = [
      { n: st.sharp, color: '#C84B31' },
      { n: st.empty, color: '#D49B42' },
      { n: st.smooth, color: '#3E7A5D' }
    ];
    segs.forEach((sg) => {
      if (sg.n <= 0) return;
      const w = (sg.n / st.total) * barW;
      ctx.fillStyle = sg.color;
      ctx.fillRect(curX, barY, w, barH);
      curX += w;
    });
  });

  // 5. 中醫體質總結與當令茶飲建議
  const topSharp = Object.entries(sharpMap).sort((a, b) => b[1] - a[1])[0];
  const topEmpty = Object.entries(emptyMap).sort((a, b) => b[1] - a[1])[0];

  const sumY = 648;
  ctx.fillStyle = '#FAF5E8';
  drawRoundRect(ctx, 54, sumY, W - 108, 280, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(196, 137, 59, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#1F3A2D';
  ctx.font = 'bold 22px "Noto Serif TC", "Microsoft JhengHei", serif';
  ctx.fillText('🌿 個人經絡調理與當令茶飲建議', 80, sumY + 42);

  const summaryItems = [];
  if (topSharp) {
    summaryItems.push(`🔥 近期最易淤堵：【${topSharp[0]}】（劇痛 ${topSharp[1]} 次）— 中醫「不通則痛」，按前宜溫熱敷並放輕力道疏通。`);
  }
  if (topEmpty) {
    summaryItems.push(`☁️ 近期需溫養補氣：【${topEmpty[0]}】（空軟 ${topEmpty[1]} 次）— 中醫「不榮則痛」，宜指腹輕揉並配合早睡泡腳。`);
  }
  if (!topSharp && !topEmpty) {
    summaryItems.push('✨ 近期打卡皆為「微痠舒暢」，整體周身氣血運行相當平順，請繼續保持！');
  }
  if (term) {
    summaryItems.push(`🍵 當令【${term.name}】節氣茶飲：${term.tea.name}（${term.tea.effect}）。`);
  }

  let ty = sumY + 80;
  ctx.font = '17px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillStyle = '#332E28';
  summaryItems.forEach((line) => {
    const wrapped = wrapLines(ctx, line, W - 160);
    wrapped.forEach((wl) => {
      ctx.fillText(wl, 80, ty);
      ty += 27;
    });
    ty += 10;
  });

  // 6. 底部免責聲明與簽名
  ctx.fillStyle = '#857D71';
  ctx.font = '14px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('※ 本圖卡僅供日常經絡保健自我紀錄與諮詢參考，非醫療診斷或治療處方。', W / 2, H - 56);

  const filename = `本草尋穴-體質週報-${dateStr.replace(/\//g, '')}.png`;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;

  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: '本草尋穴・經絡體質週報卡' });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
  showToast(`🖼️ 已下載經絡體質週報卡（${filename}）`);
}
