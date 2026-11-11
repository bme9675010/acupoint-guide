// 👂 7 大耳穴 1:1 微距特寫圖解（標示耳廓解剖分區 + 紅點定位 + 對捏/棉棒施力方向）
export function getEarCloseupSvgMarkup(pointId) {
  const cfgMap = {
    'EAR-SHENMEN': {
      cx: 168,
      cy: 68,
      rx: 15,
      ry: 11,
      step1: '① 摸耳朵上半部內側「三角窩」',
      step2: '② 往三角窩後上方分叉角探壓',
      note: '③ 耳神門：拇食指前後對捏，或貼王不留行籽安神助眠'
    },
    'EAR-APEX': {
      cx: 174,
      cy: 26,
      rx: 13,
      ry: 10,
      step1: '① 將耳朵由後往前輕折',
      step2: '② 找到耳輪最頂端尖角處',
      note: '③ 耳尖穴：雙指捏住耳尖向上提拉 36 下，清熱退紅明目'
    },
    'EAR-ZERO': {
      cx: 148,
      cy: 114,
      rx: 12,
      ry: 10,
      step1: '① 摸耳朵正中央橫向軟骨樑(耳輪腳)',
      step2: '② 找到橫軟骨樑正中央小凹窩',
      note: '③ 耳中(零點)：配深呼吸點壓，放鬆橫膈膜、止打嗝胸悶'
    },
    'EAR-STOMACH': {
      cx: 192,
      cy: 110,
      rx: 14,
      ry: 12,
      step1: '① 順中央橫軟骨(耳輪腳)往內滑到底',
      step2: '② 停在橫軟骨剛好消失的耳窩處',
      note: '③ 耳胃區：餐前按壓控嘴饞、餐後 30 分鐘輕揉消胃脹'
    },
    'EAR-LIVER': {
      cx: 204,
      cy: 95,
      rx: 12,
      ry: 15,
      step1: '① 從耳胃區往後上方移半指寬',
      step2: '② 貼住上半耳窩(耳甲艇)後下壁',
      note: '③ 耳肝區：盯螢幕乾眼或熬夜爆肝時，用棉棒圓頭輕推'
    },
    'EAR-KIDNEY': {
      cx: 186,
      cy: 84,
      rx: 15,
      ry: 10,
      step1: '① 食指伸入上半部耳窩(耳甲艇)',
      step2: '② 由下往上頂住上方軟骨屋簷下緣',
      note: '③ 耳腎區：頂揉軟骨下溝＋搓熱全耳，改善耳鳴與腰痠'
    },
    'EAR-ADRENAL': {
      cx: 132,
      cy: 138,
      rx: 11,
      ry: 11,
      step1: '① 找到耳洞正前方小軟骨片(耳屏)',
      step2: '② 夾住耳屏下半部突出的小尖端',
      note: '③ 耳腎上腺：拇食指一緊一鬆點捏 30 下，換季過敏通鼻'
    }
  };

  const cfg = cfgMap[pointId] || cfgMap['EAR-SHENMEN'];

  return `
    <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="earArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#B83D2E" />
        </marker>
      </defs>
      <rect width="360" height="220" rx="12" fill="#F8F4EC" />

      <!-- 耳廓微距輪廓 -->
      <g stroke="#5A5246" stroke-width="1.8">
        <path d="M126,82 C118,44 138,18 176,18 C218,18 244,52 240,104 C236,146 218,184 188,194 C162,200 142,186 142,162 C134,150 130,136 134,124 C126,112 126,96 126,82 Z" fill="#EFE6D5"/>
        <!-- 三角窩 -->
        <path d="M148,62 C158,46 182,46 196,60 C182,74 162,76 148,62 Z" fill="#DFCFB4" stroke="#6E6354" stroke-width="1.4"/>
        <!-- 耳甲艇與耳甲腔 -->
        <path d="M146,102 C160,76 196,76 210,94 C220,112 214,142 192,158 C172,168 150,162 142,142 Z" fill="#DFCFB4" stroke="#6E6354" stroke-width="1.4"/>
        <!-- 耳輪腳橫樑 -->
        <path d="M128,112 C148,106 172,108 194,112" fill="none" stroke="#5A5246" stroke-width="2.4" stroke-linecap="round"/>
        <!-- 耳屏 -->
        <path d="M124,122 C136,124 140,132 134,144 L124,140 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="1.8"/>
      </g>

      <!-- 目標耳穴高亮區 -->
      <ellipse cx="${cfg.cx}" cy="${cfg.cy}" rx="${cfg.rx}" ry="${cfg.ry}" fill="rgba(184,61,46,0.3)" stroke="#B83D2E" stroke-width="2"/>
      <circle cx="${cfg.cx}" cy="${cfg.cy}" r="5.5" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

      <!-- 指引步驟文字 -->
      <text x="14" y="42" fill="#2A483A" font-size="10.5" font-weight="bold">${cfg.step1}</text>
      <text x="14" y="62" fill="#2A483A" font-size="10.5" font-weight="bold">${cfg.step2}</text>
      <line x1="108" y1="66" x2="${cfg.cx - 10}" y2="${cfg.cy}" stroke="#B83D2E" stroke-width="1.8" stroke-dasharray="3 2" marker-end="url(#earArrow)"/>

      <text x="252" y="96" fill="#8C6D46" font-size="10" font-weight="bold">👐 雙耳對稱皆有</text>
      <text x="252" y="114" fill="#655E53" font-size="9.5">可用拇食指對捏</text>
      <text x="252" y="130" fill="#655E53" font-size="9.5">或圓頭棉棒點揉</text>

      <text x="180" y="212" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">${cfg.note}</text>
    </svg>
  `;
}
