import { getEarBaseSvgMarkup } from '../data/earPoints.js';

// 取得 7 大視圖（正面、背面、頭面特寫、手部特寫、足腿特寫、足底反射區、耳穴全息）的新中式人體與骨骼透視 SVG
export function getBaseBodySvgMarkup(view, xrayOpacity) {
  if (view === 'ear') {
    return getEarBaseSvgMarkup(xrayOpacity);
  }
  if (view === 'front') {
    return `
      <defs>
        <linearGradient id="bodyFillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F6F0E4" />
          <stop offset="100%" stop-color="#E9DEC8" />
        </linearGradient>
      </defs>

      <!-- 人體外輪廓（正面升級版：含道家養生髮髻、雙耳、胸腹肌理線、肚臍神闕與手指細節） -->
      <g class="skin-layer" stroke="#5A5246" stroke-width="1.8" fill="url(#bodyFillFront)">
        <!-- 髮髻 -->
        <ellipse cx="200" cy="24" rx="14" ry="10" fill="#433D36" stroke="#2D2924" stroke-width="1.5"/>
        <line x1="182" y1="24" x2="218" y2="24" stroke="#C4893B" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 雙耳 -->
        <ellipse cx="167" cy="69" rx="4.5" ry="9" fill="#EFE5D4"/>
        <ellipse cx="233" cy="69" rx="4.5" ry="9" fill="#EFE5D4"/>

        <path d="
          M200,32
          C181,32 169,46 169,66
          C169,82 177,95 186,101
          L186,113
          C168,118 144,124 134,138
          C123,155 117,205 111,248
          C106,278 100,298 92,315
          C87,325 95,333 105,326
          C114,319 124,308 131,294
          C139,265 147,218 154,178
          L158,255
          C156,302 153,355 157,418
          C160,468 164,525 169,578
          C168,598 160,618 166,626
          C174,633 191,628 193,612
          C194,565 194,505 196,435
          L200,345
          L204,435
          C206,505 206,565 207,612
          C209,628 226,633 234,626
          C240,618 232,598 231,578
          C236,525 240,468 243,418
          C247,355 244,302 242,255
          L246,178
          C253,218 261,265 269,294
          C276,308 286,319 295,326
          C305,333 313,325 308,315
          C300,298 294,278 289,248
          C283,205 277,155 266,138
          C256,124 232,118 214,113
          L214,101
          C223,95 231,82 231,66
          C231,46 219,32 200,32 Z
        " />
        <!-- 前額髮際弧線與五官工筆線條 -->
        <path d="M172,54 Q200,45 228,54" fill="none" stroke="#433D36" stroke-width="2"/>
        <path d="M181,62 Q190,59 195,62 M205,62 Q210,59 219,62" fill="none" stroke="#5A5246" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M184,68 Q190,70 194,68 M206,68 Q210,70 216,68" fill="none" stroke="#5A5246" stroke-width="1.3"/>
        <path d="M200,63 L200,76 M195,77 Q200,80 205,77" fill="none" stroke="#5A5246" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M193,86 Q200,89 207,86" fill="none" stroke="#5A5246" stroke-width="1.2" stroke-linecap="round"/>
        <!-- 胸肌、肚臍（神闕）與膝蓋肌理線 -->
        <path d="M164,172 Q182,182 197,174 M236,172 Q218,182 203,174" fill="none" stroke="#8E8577" stroke-width="1.2"/>
        <circle cx="200" cy="262" r="2.5" fill="none" stroke="#8E8577" stroke-width="1.2"/>
        <path d="M169,424 Q177,418 186,424 M214,424 Q223,418 231,424" fill="none" stroke="#8E8577" stroke-width="1.2"/>
      </g>

      <!-- 🦴 骨骼地標透視層（正面） -->
      <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="1.5" fill="none">
        <circle cx="189" cy="68" r="7" stroke-dasharray="2 2"/>
        <circle cx="211" cy="68" r="7" stroke-dasharray="2 2"/>
        <path d="M152,126 Q178,132 196,128 M248,126 Q222,132 204,128" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="200" y1="128" x2="200" y2="195" stroke-width="3" stroke-linecap="round"/>
        <path d="M198,142 Q172,145 166,162 M202,142 Q228,145 234,162"/>
        <path d="M198,158 Q168,162 162,182 M202,158 Q232,162 238,182"/>
        <path d="M198,175 Q170,182 165,202 M202,175 Q230,182 235,202"/>
        <line x1="142" y1="215" x2="116" y2="295" />
        <line x1="148" y1="220" x2="132" y2="300" />
        <line x1="258" y1="215" x2="284" y2="295" />
        <line x1="252" y1="220" x2="268" y2="300" />
        <ellipse cx="177" cy="430" rx="10" ry="12" fill="rgba(196,137,59,0.14)"/>
        <ellipse cx="223" cy="430" rx="10" ry="12" fill="rgba(196,137,59,0.14)"/>
        <path d="M179,444 L184,575 M172,446 L176,575" stroke-width="2"/>
        <path d="M221,444 L216,575 M228,446 L224,575" stroke-width="2"/>
        <circle cx="190" cy="580" r="4" fill="#8C6D46"/>
        <circle cx="210" cy="580" r="4" fill="#8C6D46"/>
        <path d="M184,592 L176,618 M179,592 L170,618" stroke-width="1.6"/>
        <path d="M216,592 L224,618 M221,592 L230,618" stroke-width="1.6"/>
      </g>

      <g class="meridian-layer">
        <line class="meridian-line" x1="200" y1="36" x2="200" y2="330" />
        <path class="meridian-line" d="M193,76 Q172,110 150,140 L125,288 L108,315" />
        <path class="meridian-line" d="M184,392 L174,465 L168,505 L188,545 L178,612" />
      </g>
    `;
  }

  if (view === 'back') {
    return `
      <defs>
        <linearGradient id="bodyFillBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F2EBDC" />
          <stop offset="100%" stop-color="#E6DBC6" />
        </linearGradient>
      </defs>

      <g class="skin-layer" stroke="#5A5246" stroke-width="1.8" fill="url(#bodyFillBack)">
        <ellipse cx="200" cy="24" rx="14" ry="10" fill="#433D36" stroke="#2D2924" stroke-width="1.5"/>
        <ellipse cx="167" cy="69" rx="4.5" ry="9" fill="#EAE0CE"/>
        <ellipse cx="233" cy="69" rx="4.5" ry="9" fill="#EAE0CE"/>
        <path d="
          M200,32
          C181,32 169,46 169,66
          C169,82 177,95 186,101
          L186,113
          C168,118 144,124 134,138
          C123,155 117,205 111,248
          C106,278 100,298 92,315
          C87,325 95,333 105,326
          C114,319 124,308 131,294
          C139,265 147,218 154,178
          L158,255
          C156,302 153,355 157,418
          C160,468 164,525 169,578
          C168,602 163,626 172,633
          C182,638 192,632 193,612
          C194,565 194,505 196,435
          L200,345
          L204,435
          C206,505 206,565 207,612
          C208,632 218,638 228,633
          C237,626 232,602 231,578
          C236,525 240,468 243,418
          C247,355 244,302 242,255
          L246,178
          C253,218 261,265 269,294
          C276,308 286,319 295,326
          C305,333 313,325 308,315
          C300,298 294,278 289,248
          C283,205 277,155 266,138
          C256,124 232,118 214,113
          L214,101
          C223,95 231,82 231,66
          C231,46 219,32 200,32 Z
        " />
        <path d="M177,76 Q200,84 223,76" fill="none" stroke="#6E6558" stroke-width="1.4" stroke-dasharray="3 2"/>
        <path d="M163,432 Q176,435 190,432 M210,432 Q224,435 237,432" fill="none" stroke="#6E6558" stroke-width="1.5"/>
      </g>

      <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="1.6" fill="none">
        <path d="M175,74 Q200,82 225,74" stroke-width="2.2"/>
        <line x1="200" y1="82" x2="200" y2="335" stroke-width="3.5" stroke-dasharray="5 3"/>
        <circle cx="200" cy="116" r="4.5" fill="#B83D2E" />
        <path d="M152,132 L182,136 L176,188 Z" fill="rgba(196,137,59,0.1)"/>
        <path d="M248,132 L218,136 L224,188 Z" fill="rgba(196,137,59,0.1)"/>
        <line x1="178" y1="530" x2="178" y2="598" stroke-width="2.5"/>
        <line x1="222" y1="530" x2="222" y2="598" stroke-width="2.5"/>
      </g>

      <g class="meridian-layer">
        <line class="meridian-line" x1="200" y1="38" x2="200" y2="340" />
        <path class="meridian-line" d="M184,80 L162,122 L175,330 L175,432 L188,582 L176,625" />
      </g>
    `;
  }

  // 新增：頭面部特寫視圖 (head)
  if (view === 'head') {
    return `
      <defs>
        <linearGradient id="headFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F7F1E5" />
          <stop offset="100%" stop-color="#E9DEC8" />
        </linearGradient>
      </defs>

      <text x="200" y="34" text-anchor="middle" fill="#655E53" font-family="Noto Serif TC, serif" font-size="13">
        頭面部七大要穴特寫（含眉骨眶上切迹、鼻翼法令紋、耳後與枕骨地標）
      </text>

      <!-- 頭頸放大輪廓 -->
      <g class="skin-layer" stroke="#5A5246" stroke-width="2" fill="url(#headFill)">
        <!-- 肩頸底座 -->
        <path d="M85,435 C105,385 135,365 142,315 L258,315 C265,365 295,385 315,435 Z" fill="#E6DAC3"/>
        <!-- 雙耳與耳垂（翳風定位基準） -->
        <path d="M108,195 C88,192 85,245 96,268 C102,280 114,282 118,268" fill="#EFE4D2"/>
        <path d="M292,195 C312,192 315,245 304,268 C298,280 286,282 282,268" fill="#EFE4D2"/>
        <!-- 臉部輪廓 -->
        <path d="M200,56 C135,56 108,112 108,195 C108,268 146,332 200,336 C254,332 292,268 292,195 C292,112 265,56 200,56 Z"/>
        <!-- 髮際線與道家髮髻 -->
        <path d="M112,165 C125,112 162,96 200,98 C238,96 275,112 288,165" fill="none" stroke="#433D36" stroke-width="2.5"/>
        <!-- 雙眉（攢竹、印堂、太陽基準） -->
        <path d="M132,188 Q154,174 174,185" fill="none" stroke="#3A352F" stroke-width="5" stroke-linecap="round"/>
        <path d="M268,188 Q246,174 226,185" fill="none" stroke="#3A352F" stroke-width="5" stroke-linecap="round"/>
        <!-- 雙眼 -->
        <path d="M138,210 Q156,198 174,210 Q156,218 138,210 Z" fill="#FFF" stroke="#3A352F" stroke-width="1.8"/>
        <circle cx="156" cy="209" r="5" fill="#3A352F"/>
        <path d="M262,210 Q244,198 226,210 Q244,218 262,210 Z" fill="#FFF" stroke="#3A352F" stroke-width="1.8"/>
        <circle cx="244" cy="209" r="5" fill="#3A352F"/>
        <!-- 鼻樑、鼻翼與法令紋（迎香基準） -->
        <path d="M200,188 L200,252 C192,265 178,264 178,255 M200,252 C208,265 222,264 222,255" fill="none" stroke="#5A5246" stroke-width="2" stroke-linecap="round"/>
        <path d="M175,248 Q162,272 158,295 M225,248 Q238,272 242,295" fill="none" stroke="#8C584C" stroke-width="1.6" stroke-dasharray="3 2"/>
        <!-- 唇線 -->
        <path d="M178,292 Q200,300 222,292 Q200,306 178,292 Z" fill="#D99B8C" stroke="#5A5246" stroke-width="1.4"/>
      </g>

      <!-- 🦴 頭面骨骼透視層（眼眶骨、眶上切迹、顳骨太陽凹窩、枕骨下緣風池） -->
      <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="1.8" fill="none">
        <!-- 督脈頭頂正中十字線 -->
        <line x1="200" y1="45" x2="200" y2="335" stroke-dasharray="4 3"/>
        <line x1="92" y1="195" x2="308" y2="195" stroke-dasharray="3 3" opacity="0.6"/>
        <!-- 左右眼眶骨與攢竹眶上切迹 -->
        <ellipse cx="156" cy="209" rx="24" ry="18" stroke-dasharray="3 2"/>
        <ellipse cx="244" cy="209" rx="24" ry="18" stroke-dasharray="3 2"/>
        <!-- 太陽穴顳骨凹窩 -->
        <circle cx="112" cy="205" r="10" fill="rgba(196,137,59,0.15)" stroke-dasharray="2 2"/>
        <circle cx="288" cy="205" r="10" fill="rgba(196,137,59,0.15)" stroke-dasharray="2 2"/>
        <!-- 後腦枕骨下緣延伸標示（風池、翳風） -->
        <path d="M105,278 Q132,322 200,328 Q268,322 295,278" stroke="#2A483A" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="200" y="362" text-anchor="middle" fill="#2A483A" font-size="11">↑ 虛線為耳垂後「翳風」與後腦顱底「風池」對應高度</text>
      </g>
    `;
  }

  // 手掌與手背特寫視圖 (hand)
  if (view === 'hand') {
    return `
      <defs>
        <linearGradient id="handFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F6F0E4" />
          <stop offset="100%" stop-color="#E9DEC9" />
        </linearGradient>
      </defs>

      <text x="200" y="38" text-anchor="middle" fill="#655E53" font-family="Noto Serif TC, serif" font-size="13">
        手部七大黃金穴位特寫（合谷・魚際・勞宮・列缺・後谿・神門・內關）
      </text>

      <g class="skin-layer" stroke="#5A5246" stroke-width="2" fill="url(#handFill)">
        <path d="
          M105,430
          L105,305
          C92,285 82,258 80,228
          C78,195 76,142 84,132
          C92,124 102,132 103,155
          L106,198
          C109,145 112,98 122,92
          C132,88 139,98 139,145
          L141,192
          C145,135 150,82 162,80
          C174,78 179,90 177,145
          L176,196
          C182,148 190,104 202,104
          C213,104 216,118 209,165
          L202,216
          C222,198 248,176 264,182
          C276,188 274,205 254,225
          C234,246 216,268 195,305
          L192,430 Z
        " />
        <path d="M104,312 Q148,318 194,312" fill="none" stroke="#8C584C" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="248" y="316" fill="#8C584C" font-size="11" font-family="Noto Serif TC, serif">← 手腕橫紋</text>
        <path d="M178,225 Q196,242 204,265" fill="none" stroke="#6E6558" stroke-width="1.5"/>
      </g>

      <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="2.2" fill="none">
        <line x1="184" y1="292" x2="245" y2="205" stroke-width="5" stroke-linecap="round" opacity="0.65"/>
        <line x1="168" y1="292" x2="196" y2="165" stroke-width="6" stroke-linecap="round" stroke="#B83D2E" opacity="0.55"/>
        <line x1="152" y1="292" x2="164" y2="160" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
        <line x1="134" y1="292" x2="132" y2="165" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
        <line x1="115" y1="295" x2="96" y2="185" stroke-width="5" stroke-linecap="round" opacity="0.65"/>
        <circle cx="110" cy="314" r="6" fill="rgba(184,61,46,0.25)" stroke="#B83D2E"/>
        <line x1="140" y1="312" x2="140" y2="425" stroke="#2A483A" stroke-width="2.5" stroke-dasharray="3 2"/>
        <line x1="152" y1="312" x2="152" y2="425" stroke="#2A483A" stroke-width="2.5" stroke-dasharray="3 2"/>
      </g>

      <g class="meridian-layer">
        <path class="meridian-line" d="M145,420 L145,360 L162,235 L205,215" />
      </g>
    `;
  }

  // 新增：🦶 足底全息反射區與奇穴視圖 (sole)
  if (view === 'sole') {
    return `
      <defs>
        <linearGradient id="soleFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F7F0E2" />
          <stop offset="100%" stop-color="#E6D9C2" />
        </linearGradient>
        <marker id="detoxArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#2A483A" />
        </marker>
      </defs>

      <text x="200" y="26" text-anchor="middle" fill="#2A483A" font-family="Noto Serif TC, serif" font-weight="bold" font-size="13.5">
        🦶 足底全息反射區＆經外奇穴圖（可直接點擊色塊或紅點）
      </text>
      <rect x="66" y="38" width="128" height="22" rx="6" fill="rgba(42,115,82,0.12)" stroke="#2A483A" stroke-width="1"/>
      <text x="130" y="53" text-anchor="middle" fill="#1D4734" font-size="11" font-weight="bold">
        🦶【右腳底】外側主肝膽
      </text>
      <rect x="206" y="38" width="128" height="22" rx="6" fill="rgba(184,61,46,0.12)" stroke="#B83D2E" stroke-width="1"/>
      <text x="270" y="53" text-anchor="middle" fill="#8A2519" font-size="11" font-weight="bold">
        🦶【左腳底】外側主心脾
      </text>
      <text x="200" y="75" text-anchor="middle" fill="#8C6D46" font-size="10.5" font-weight="bold">
        ← 兩腳大拇趾相對（內側）→
      </text>
      <text x="54" y="130" text-anchor="middle" fill="#8C6D46" font-size="9.5">右小趾(外)</text>
      <text x="346" y="130" text-anchor="middle" fill="#8C6D46" font-size="9.5">左小趾(外)</text>

      <!-- 左右雙足底輪廓 -->
      <g class="skin-layer" stroke="#5A5246" stroke-width="2" fill="url(#soleFill)">
        <!-- 右足底 (左側畫布，大拇趾在內側 x=162) -->
        <ellipse cx="162" cy="108" rx="18" ry="25" />
        <ellipse cx="132" cy="104" rx="10" ry="18" />
        <ellipse cx="110" cy="112" rx="9.5" ry="16" />
        <ellipse cx="90" cy="124" rx="8.5" ry="14" />
        <ellipse cx="73" cy="142" rx="8" ry="12" />
        <path d="
          M68,160
          C56,215 68,295 85,375
          C92,435 90,515 110,545
          C128,568 158,565 168,535
          C176,502 166,435 162,368
          C156,305 178,242 182,188
          C184,155 174,136 154,135
          L82,148 Z
        " />

        <!-- 左足底 (右側畫布鏡像，大拇趾在內側 x=238) -->
        <ellipse cx="238" cy="108" rx="18" ry="25" />
        <ellipse cx="268" cy="104" rx="10" ry="18" />
        <ellipse cx="290" cy="112" rx="9.5" ry="16" />
        <ellipse cx="310" cy="124" rx="8.5" ry="14" />
        <ellipse cx="327" cy="142" rx="8" ry="12" />
        <path d="
          M332,160
          C344,215 332,295 315,375
          C308,435 310,515 290,545
          C272,568 242,565 232,535
          C224,502 234,435 238,368
          C244,305 222,242 218,188
          C216,155 226,136 246,135
          L318,148 Z
        " />
      </g>

      <!-- 🎨 足底互動反射區色塊（點擊色塊也可直接選取該區） -->
      <g class="reflex-zones-layer">
        <!-- ① 大腦頭頸區 (大拇趾腹) -->
        <ellipse class="reflex-zone-poly" data-point-id="REFLEX-BRAIN" cx="162" cy="108" rx="15" ry="21" fill="rgba(196,137,59,0.28)" stroke="#C4893B" stroke-width="1.5" style="cursor:pointer;"/>
        <ellipse class="reflex-zone-poly" data-point-id="REFLEX-BRAIN" cx="238" cy="108" rx="15" ry="21" fill="rgba(196,137,59,0.28)" stroke="#C4893B" stroke-width="1.5" style="cursor:pointer;"/>

        <!-- ② 眼耳與斜方肌橫帶 (前掌肉墊) -->
        <path class="reflex-zone-poly" data-point-id="REFLEX-EYE-TRAP" d="M72,158 Q125,138 176,162 L174,198 Q122,186 70,198 Z" fill="rgba(42,72,58,0.18)" stroke="#2A483A" stroke-width="1.4" stroke-dasharray="3 2" style="cursor:pointer;"/>
        <path class="reflex-zone-poly" data-point-id="REFLEX-EYE-TRAP" d="M328,158 Q275,138 224,162 L226,198 Q278,186 330,198 Z" fill="rgba(42,72,58,0.18)" stroke="#2A483A" stroke-width="1.4" stroke-dasharray="3 2" style="cursor:pointer;"/>

        <!-- ③ 【右腳專屬】肝膽區 (x=96) 與 【左腳專屬】心脾區 (x=304) 獨立分開 -->
        <ellipse class="reflex-zone-poly" data-point-id="REFLEX-LIVER" cx="96" cy="252" rx="22" ry="32" fill="rgba(42,115,82,0.24)" stroke="#2A483A" stroke-width="1.6" style="cursor:pointer;"/>
        <ellipse class="reflex-zone-poly" data-point-id="REFLEX-HEART" cx="304" cy="252" rx="22" ry="32" fill="rgba(184,61,46,0.22)" stroke="#B83D2E" stroke-width="1.6" style="cursor:pointer;"/>
        <text x="96" y="272" text-anchor="middle" fill="#1D4734" font-size="9.5" font-weight="bold" pointer-events="none">右腳肝膽</text>
        <text x="304" y="272" text-anchor="middle" fill="#8A2519" font-size="9.5" font-weight="bold" pointer-events="none">左腳心脾</text>

        <!-- ④ 胃・脾・十二指腸區 (內側足弓帶) -->
        <path class="reflex-zone-poly" data-point-id="REFLEX-STOMACH" d="M148,220 C172,225 176,315 152,338 C138,325 138,245 148,220 Z" fill="rgba(212,150,69,0.28)" stroke="#B5792A" stroke-width="1.5" style="cursor:pointer;"/>
        <path class="reflex-zone-poly" data-point-id="REFLEX-STOMACH" d="M252,220 C228,225 224,315 248,338 C262,325 262,245 252,220 Z" fill="rgba(212,150,69,0.28)" stroke="#B5792A" stroke-width="1.5" style="cursor:pointer;"/>

        <!-- ⑤ 腎 → 輸尿管 → 膀胱排毒鏈 (足心斜向內側踝前緣) -->
        <path class="reflex-zone-poly" data-point-id="REFLEX-KIDNEY" d="M126,285 Q145,342 162,395" fill="none" stroke="#2A483A" stroke-width="7" stroke-linecap="round" opacity="0.55" marker-end="url(#detoxArrow)" style="cursor:pointer;"/>
        <path class="reflex-zone-poly" data-point-id="REFLEX-KIDNEY" d="M274,285 Q255,342 238,395" fill="none" stroke="#2A483A" stroke-width="7" stroke-linecap="round" opacity="0.55" marker-end="url(#detoxArrow)" style="cursor:pointer;"/>

        <!-- ⑥ 骨盆腔與生殖腺反射區 (整個腳後跟圓墊) -->
        <circle class="reflex-zone-poly" data-point-id="REFLEX-PELVIS" cx="132" cy="485" r="36" fill="rgba(184,61,46,0.16)" stroke="#B83D2E" stroke-width="1.5" stroke-dasharray="4 2" style="cursor:pointer;"/>
        <circle class="reflex-zone-poly" data-point-id="REFLEX-PELVIS" cx="268" cy="485" r="36" fill="rgba(184,61,46,0.16)" stroke="#B83D2E" stroke-width="1.5" stroke-dasharray="4 2" style="cursor:pointer;"/>

        <!-- 湧泉穴人字紋 -->
        <path d="M98,228 Q132,196 164,228" fill="none" stroke="#5A5246" stroke-width="2.2" stroke-linecap="round" pointer-events="none"/>
        <path d="M236,228 Q268,196 302,228" fill="none" stroke="#5A5246" stroke-width="2.2" stroke-linecap="round" pointer-events="none"/>
      </g>

      <!-- 🦴 足底骨骼與足底筋膜透視層 -->
      <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="2" fill="none" pointer-events="none">
        <!-- 第 1~5 跖骨與跟骨結節 -->
        <line x1="158" y1="145" x2="148" y2="295" stroke-width="4" opacity="0.45"/>
        <line x1="132" y1="145" x2="132" y2="305" stroke-width="3" opacity="0.45"/>
        <line x1="108" y1="155" x2="115" y2="310" stroke-width="3" opacity="0.45"/>
        <circle cx="132" cy="485" r="22" stroke-dasharray="3 2" opacity="0.5"/>
        <circle cx="268" cy="485" r="22" stroke-dasharray="3 2" opacity="0.5"/>
      </g>

      <rect x="24" y="586" width="352" height="70" rx="10" fill="rgba(42,72,58,0.08)" stroke="rgba(42,72,58,0.25)"/>
      <text x="200" y="607" text-anchor="middle" fill="#2A483A" font-size="11.2" font-weight="bold">
        💡 居家省力秘訣：不必用手死命摳！將「高爾夫球/網球」踩在腳底滾動，
      </text>
      <text x="200" y="626" text-anchor="middle" fill="#B83D2E" font-size="11.2" font-weight="bold">
        並於按完後 15 分鐘內喝下 300～500cc 溫開水，排毒消腫效果翻倍！
      </text>
      <text x="200" y="645" text-anchor="middle" fill="#655E53" font-size="9.8">
        ※ 足底全息反射區屬傳統養生保健參考，非醫療診斷依據。
      </text>
    `;
  }

  // 足腿與足底特寫視圖 (foot)
  return `
    <defs>
      <linearGradient id="footFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F6F0E4" />
        <stop offset="100%" stop-color="#E7DBC5" />
      </linearGradient>
    </defs>

    <text x="200" y="34" text-anchor="middle" fill="#655E53" font-family="Noto Serif TC, serif" font-size="13">
      足腿與足底七大要穴特寫（足三里・豐隆・三陰交・太谿・崑崙・太衝・湧泉）
    </text>

    <!-- 左半：小腿與足背特寫；右半：內踝與足底湧泉特寫 -->
    <g class="skin-layer" stroke="#5A5246" stroke-width="2" fill="url(#footFill)">
      <!-- 小腿至足背輪廓 -->
      <path d="
        M110,65
        C102,155 104,265 114,358
        C108,382 95,412 108,432
        L165,505
        C182,522 218,515 215,492
        L188,415
        C186,315 192,175 186,65 Z
      " />
      <!-- 右側：內側踝與足底湧泉對照圖 -->
      <path d="
        M238,185
        L242,355
        C232,378 235,402 252,412
        L298,412
        C302,365 296,265 292,185 Z
      " />
      <!-- 足底板（湧泉穴特寫） -->
      <path d="
        M248,622
        C234,622 228,588 232,552
        C235,515 225,478 245,462
        C265,450 296,452 308,468
        C322,488 312,532 305,568
        C298,598 292,622 272,622 Z
      " />
      <!-- 湧泉人字紋 -->
      <path d="M245,552 Q270,526 296,552" fill="none" stroke="#2A483A" stroke-width="2.5" stroke-linecap="round"/>
      <text x="272" y="642" text-anchor="middle" fill="#655E53" font-size="11">足底板（捲趾人字窩＝湧泉）</text>
    </g>

    <!-- 🦴 小腿脛骨、內外踝尖與第 1、2 跖骨地標 -->
    <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="2" fill="none">
      <!-- 膝蓋髕骨與外膝眼 -->
      <ellipse cx="152" cy="82" rx="22" ry="15" fill="rgba(196,137,59,0.15)"/>
      <!-- 脛骨前緣與內側脛骨後緣 -->
      <line x1="158" y1="98" x2="158" y2="365" stroke-width="6" opacity="0.45"/>
      <line x1="252" y1="195" x2="252" y2="362" stroke-width="6" opacity="0.45"/>
      <!-- 外踝尖(崑崙) 與 內踝尖(太谿、三陰交基準) -->
      <circle cx="126" cy="368" r="8" fill="rgba(184,61,46,0.2)"/>
      <circle cx="254" cy="368" r="8" fill="rgba(42,72,58,0.2)"/>
      <text x="275" y="345" fill="#2A483A" font-size="10.5">← 內踝尖與脛骨後緣</text>
      <!-- 足背第一、二跖骨 V 字骨縫（太衝） -->
      <path d="M175,425 L192,465 L204,495 M175,425 L182,495" stroke-width="2.5"/>
    </g>

    <g class="meridian-layer">
      <path class="meridian-line" d="M142,125 L122,215 L112,368 L192,465" />
      <path class="meridian-line" d="M252,275 L268,368 L268,542" />
    </g>
  `;
}
