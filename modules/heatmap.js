// 📊 近 30 天經絡痛感體質熱力分佈條（視覺化呈現各經絡「劇痛氣滯 / 空軟氣虛 / 微痠通暢」比例）
export function buildMeridianHeatmapHtml(painLogs) {
  if (!Array.isArray(painLogs) || painLogs.length === 0) return '';

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = painLogs.filter((l) => !l.timestamp || l.timestamp >= cutoff);
  const source = recent.length > 0 ? recent : painLogs;

  const statsMap = {};
  source.forEach((log) => {
    const rawMeridian = log.meridian || '其他經絡';
    // 取簡短經絡名稱方便視覺化對齊
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
