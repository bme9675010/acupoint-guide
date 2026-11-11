// 針對每一顆穴位繪製「1:1 局部微距解剖 + 手指同身寸量尺 + 下指施力角度箭頭 + 按錯避坑標記」SVG
export function getCloseupSvgMarkup(pointId) {
  const commonDefs = `
    <defs>
      <marker id="forceArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#B83D2E" />
      </marker>
      <pattern id="boneHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#8C6D46" stroke-width="1" opacity="0.35" />
      </pattern>
    </defs>
  `;

  switch (pointId) {
    case 'LI4': // 合谷：第二掌骨中點 + 朝小指方向斜壓 vs 虎口軟肉錯誤點
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 手背虎口局部輪廓 -->
          <path d="M40,205 L55,140 C65,90 95,45 125,25 C140,18 152,28 145,52 L132,98 C158,78 195,58 220,62 C238,65 236,88 212,108 C182,130 155,165 140,205 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 第二掌骨（食指骨頭） -->
          <path d="M92,188 L134,42" stroke="#8C6D46" stroke-width="16" stroke-linecap="round" opacity="0.35"/>
          <path d="M92,188 L134,42" stroke="#8C6D46" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="58" y="82" fill="#2A483A" font-size="11" font-weight="bold">① 食指長骨(第二掌骨)</text>

          <!-- 第一掌骨（拇指骨頭） -->
          <path d="M118,192 L208,82" stroke="#8C6D46" stroke-width="14" stroke-linecap="round" opacity="0.3"/>

          <!-- 骨頭全長 1/2 標尺 -->
          <line x1="112" y1="42" x2="72" y2="188" stroke="#2A483A" stroke-width="1.2" stroke-dasharray="2 2"/>
          <circle cx="113" cy="115" r="4" fill="#2A483A"/>
          <text x="18" y="120" fill="#2A483A" font-size="11" font-weight="bold">② 骨頭 1/2 中點</text>

          <!-- 錯誤示範點（虎口軟肉中央） -->
          <g transform="translate(154, 118)">
            <circle cx="0" cy="0" r="8" fill="rgba(100,100,100,0.15)" stroke="#666" stroke-width="1.5" stroke-dasharray="2 2"/>
            <path d="M-4,-4 L4,4 M4,-4 L-4,4" stroke="#666" stroke-width="2"/>
            <text x="12" y="4" fill="#666" font-size="10.5">勿按虎口軟肉中央(只痛不痠)</text>
          </g>

          <!-- 正確合谷靶心與斜向施力箭頭 -->
          <circle cx="118" cy="115" r="14" fill="rgba(184,61,46,0.22)" />
          <circle cx="118" cy="115" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <line x1="158" y1="138" x2="126" y2="119" stroke="#B83D2E" stroke-width="3" marker-end="url(#forceArrow)"/>
          <rect x="135" y="148" width="212" height="44" rx="8" fill="#FFF9F5" stroke="#B83D2E" stroke-width="1.2"/>
          <text x="143" y="166" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 朝食指骨頭底緣「斜向摳進去」</text>
          <text x="143" y="183" fill="#655E53" font-size="10.5">（施力朝小指側，食指會立刻發痠麻）</text>
        </svg>
      `;

    case 'PC6': // 內關：腕橫紋 + 三指同身寸(2寸) + 兩筋之間
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 前臂內側輪廓 -->
          <path d="M115,15 L105,205 L235,205 L225,15 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- ① 手腕第一條橫紋 -->
          <path d="M113,52 Q170,58 227,52" fill="none" stroke="#B83D2E" stroke-width="2.5"/>
          <text x="20" y="56" fill="#B83D2E" font-size="11" font-weight="bold">① 手腕橫紋 →</text>

          <!-- 兩條明顯肌腱（握拳浮出） -->
          <line x1="158" y1="20" x2="158" y2="200" stroke="#2A483A" stroke-width="5" opacity="0.45"/>
          <line x1="182" y1="20" x2="182" y2="200" stroke="#2A483A" stroke-width="5" opacity="0.45"/>
          <text x="236" y="182" fill="#2A483A" font-size="10.5">握拳浮出的兩條硬筋</text>
          <line x1="184" y1="178" x2="232" y2="178" stroke="#2A483A" stroke-width="1" stroke-dasharray="2 2"/>

          <!-- ② 三指併攏同身寸疊圖 (2寸) -->
          <g opacity="0.88">
            <rect x="112" y="55" width="116" height="24" rx="10" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.5"/>
            <rect x="112" y="79" width="116" height="24" rx="10" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.5"/>
            <rect x="112" y="103" width="116" height="24" rx="10" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.5"/>
            <text x="170" y="95" text-anchor="middle" fill="#8C5A16" font-size="11" font-weight="bold">② 食、中、無名指三指寬 (2寸)</text>
          </g>

          <!-- ③ 內關精準靶心（第三指下緣、兩筋正中央） -->
          <circle cx="170" cy="132" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="170" cy="132" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="236" y="130" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 內關穴（兩筋正中央）</text>
          <text x="236" y="146" fill="#655E53" font-size="10.5">垂直插入兩筋縫隙深按</text>
        </svg>
      `;

    case 'HT7': // 神門：小指無名指縫直線 × 腕橫紋 × 豌豆骨內側凹窩
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 手掌與手腕尺側（小指側）輪廓 -->
          <path d="M105,205 L112,130 C102,95 96,55 102,25 L235,25 L228,130 L225,205 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- ① 小指與無名指縫延伸基準線 -->
          <line x1="138" y1="22" x2="138" y2="165" stroke="#2A483A" stroke-width="1.8" stroke-dasharray="4 3"/>
          <text x="144" y="45" fill="#2A483A" font-size="11" font-weight="bold">① 順「小指與無名指縫」往下畫線</text>

          <!-- 手腕橫紋 -->
          <path d="M110,132 Q170,138 228,132" fill="none" stroke="#8C584C" stroke-width="2.2"/>
          <text x="236" y="136" fill="#8C584C" font-size="11">← 手腕橫紋</text>

          <!-- ② 豌豆骨與尺側腕屈肌腱 -->
          <circle cx="121" cy="130" r="10" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="2"/>
          <line x1="121" y1="140" x2="121" y2="202" stroke="#8C6D46" stroke-width="7" opacity="0.45"/>
          <text x="16" y="125" fill="#8C6D46" font-size="10.5" font-weight="bold">② 小指側硬骨</text>
          <text x="16" y="140" fill="#8C6D46" font-size="10.5">（豌豆骨與硬筋）</text>

          <!-- ③ 神門穴靶心（硬筋內側凹窩） -->
          <circle cx="138" cy="133" r="13" fill="rgba(184,61,46,0.22)"/>
          <circle cx="138" cy="133" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <line x1="175" y1="165" x2="144" y2="138" stroke="#B83D2E" stroke-width="2.5" marker-end="url(#forceArrow)"/>
          <text x="150" y="184" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 神門：貼著硬筋「內側凹窩」輕摳</text>
        </svg>
      `;

    case 'SI3': // 後谿：微握拳感情線橫紋盡頭 + 第五掌骨頭後方
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 微握拳手刀側視放大圖 -->
          <path d="M75,195 L82,135 C72,112 72,82 84,62 C95,45 128,42 185,45 C225,48 242,75 236,125 L228,195 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 第五掌骨與小指掌指關節頭 -->
          <line x1="104" y1="190" x2="102" y2="95" stroke="#8C6D46" stroke-width="14" stroke-linecap="round" opacity="0.35"/>
          <circle cx="102" cy="92" r="12" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="1.8"/>
          <text x="122" y="88" fill="#8C6D46" font-size="11" font-weight="bold">① 小指根部關節硬骨頭</text>

          <!-- 感情線延伸摺紋 -->
          <path d="M80,118 Q135,112 195,122" fill="none" stroke="#2A483A" stroke-width="2.2"/>
          <text x="140" y="138" fill="#2A483A" font-size="11" font-weight="bold">② 握拳時「感情線」折出的橫紋盡頭</text>

          <!-- 後谿靶心（骨頭後方凹窩） -->
          <circle cx="84" cy="118" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="84" cy="118" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <line x1="35" y1="145" x2="76" y2="122" stroke="#B83D2E" stroke-width="3" marker-end="url(#forceArrow)"/>
          <text x="20" y="172" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 後谿：往關節骨頭「正下方凹窩」頂進去（可壓桌緣滾動）</text>
        </svg>
      `;

    case 'ST36': // 足三里：外膝眼 + 下四橫指(3寸) + 脛骨往外一橫指
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 膝蓋與小腿前外側輪廓 -->
          <path d="M105,12 C95,65 92,135 102,208 L228,208 C236,135 232,65 222,12 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 膝蓋骨（髕骨）與外膝眼 -->
          <ellipse cx="165" cy="36" rx="28" ry="20" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="2"/>
          <circle cx="136" cy="54" r="5.5" fill="#2A483A"/>
          <text x="15" y="58" fill="#2A483A" font-size="11" font-weight="bold">① 外膝眼凹窩 →</text>

          <!-- 小腿正前方脛骨前嵴 -->
          <line x1="168" y1="58" x2="168" y2="205" stroke="#8C6D46" stroke-width="12" opacity="0.38"/>
          <line x1="168" y1="58" x2="168" y2="205" stroke="#8C6D46" stroke-width="2" stroke-dasharray="4 2"/>
          <text x="180" y="192" fill="#8C6D46" font-size="10.5" font-weight="bold">← 小腿正中間迎面硬骨(脛骨)</text>

          <!-- ② 四指併攏同身寸疊圖 (3寸) -->
          <g opacity="0.88">
            <rect x="100" y="56" width="125" height="20" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <rect x="100" y="76" width="125" height="20" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <rect x="100" y="96" width="125" height="20" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <rect x="100" y="116" width="125" height="20" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <text x="234" y="100" fill="#8C5A16" font-size="11" font-weight="bold">② 往下四指寬 (3寸)</text>
          </g>

          <!-- ③ 脛骨往外一橫指 + 足三里靶心 -->
          <line x1="168" y1="144" x2="140" y2="144" stroke="#B83D2E" stroke-width="2.5"/>
          <circle cx="140" cy="144" r="14" fill="rgba(184,61,46,0.24)"/>
          <circle cx="140" cy="144" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="14" y="148" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 外移 1 指寬 →</text>
          <text x="14" y="166" fill="#655E53" font-size="10.5">（勾腳背時肌肉會頂起處）</text>
        </svg>
      `;

    case 'SP6': // 三陰交：內踝尖 + 上四橫指(3寸) + 緊貼脛骨後緣骨縫（勿按小腿肚）
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 小腿內側與腳踝輪廓 -->
          <path d="M115,12 L122,175 C115,188 112,202 125,208 L225,208 C228,180 238,110 228,12 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 小腿脛骨（前側硬骨） -->
          <path d="M126,14 L132,172 L162,172 L158,14 Z" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="2"/>
          <text x="18" y="42" fill="#8C6D46" font-size="11" font-weight="bold">小腿內側大硬骨 →</text>
          <text x="38" y="56" fill="#8C6D46" font-size="10.5">（脛骨）</text>

          <!-- ① 內踝尖最高點 -->
          <circle cx="148" cy="176" r="11" fill="#F6ECD9" stroke="#2A483A" stroke-width="2"/>
          <circle cx="148" cy="176" r="4" fill="#2A483A"/>
          <text x="18" y="180" fill="#2A483A" font-size="11" font-weight="bold">① 內踝尖最高點 →</text>

          <!-- ② 往上四指併攏 (3寸) -->
          <g opacity="0.88">
            <rect x="118" y="96" width="108" height="19" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <rect x="118" y="115" width="108" height="19" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <rect x="118" y="134" width="108" height="19" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <rect x="118" y="153" width="108" height="19" rx="8" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
            <text x="234" y="140" fill="#8C5A16" font-size="11" font-weight="bold">② 往上四指寬 (3寸)</text>
          </g>

          <!-- 錯誤示範：小腿肚軟肉 -->
          <g transform="translate(202, 92)">
            <circle cx="0" cy="0" r="7" fill="rgba(100,100,100,0.15)" stroke="#666" stroke-dasharray="2 2"/>
            <path d="M-3,-3 L3,3 M3,-3 L-3,3" stroke="#666" stroke-width="1.8"/>
            <text x="12" y="4" fill="#666" font-size="10">勿按後方小腿肚軟肉</text>
          </g>

          <!-- ③ 三陰交靶心（緊貼脛骨後緣骨縫！） -->
          <circle cx="160" cy="92" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="160" cy="92" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <line x1="192" y1="68" x2="166" y2="87" stroke="#B83D2E" stroke-width="2.8" marker-end="url(#forceArrow)"/>
          <text x="172" y="55" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 緊貼「脛骨後緣骨縫」往裡摳！</text>
        </svg>
      `;

    case 'LR3': // 太衝：大腳趾與二腳趾縫往上推到 V 字骨縫卡住處
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 足背放大輪廓 -->
          <path d="M105,205 L108,75 C108,42 126,25 142,42 L145,75 C148,38 164,28 175,45 L178,75 C182,45 196,38 205,52 L225,85 L222,205 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 第一、二跖骨 V 字交會 -->
          <path d="M126,55 L154,155 L168,55" fill="none" stroke="#8C6D46" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
          <path d="M126,55 L154,155 L168,55" fill="none" stroke="#8C6D46" stroke-width="2" stroke-dasharray="3 2"/>

          <!-- ① 從趾縫往上推軌跡 -->
          <line x1="145" y1="65" x2="152" y2="124" stroke="#2A483A" stroke-width="3" stroke-dasharray="4 3" marker-end="url(#forceArrow)"/>
          <text x="200" y="75" fill="#2A483A" font-size="11" font-weight="bold">① 從第 1、2 腳趾縫順骨溝往上推</text>

          <!-- ③ V 字骨縫卡死處靶心 -->
          <circle cx="153" cy="134" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="153" cy="134" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="185" y="135" fill="#B83D2E" font-size="11.5" font-weight="bold">② 推到「V 字骨頭交會卡死處」</text>
          <text x="185" y="153" fill="#655E53" font-size="10.5">③ 即是太衝穴（往下朝趾縫推按瀉肝火）</text>
        </svg>
      `;

    case 'GB20': // 風池：後腦枕骨下緣 + 斜方肌外側凹窩 + 斜向上朝對側眼睛頂
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 後腦勺與後頸輪廓 -->
          <path d="M95,20 C75,55 82,105 112,128 L115,205 L245,205 L248,128 C278,105 285,55 265,20 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- ① 枕骨下緣基準弧線 -->
          <path d="M108,118 Q180,132 252,118" fill="none" stroke="#8C6D46" stroke-width="4" opacity="0.6"/>
          <text x="180" y="95" text-anchor="middle" fill="#8C6D46" font-size="11" font-weight="bold">① 順後腦勺硬骨頭往下滑到底部邊緣</text>

          <!-- ② 頸後正中兩條大筋（斜方肌） -->
          <line x1="162" y1="122" x2="158" y2="205" stroke="#2A483A" stroke-width="12" opacity="0.35"/>
          <line x1="198" y1="122" x2="202" y2="205" stroke="#2A483A" stroke-width="12" opacity="0.35"/>
          <text x="180" y="192" text-anchor="middle" fill="#2A483A" font-size="10.5">② 跨過中間兩條粗筋的外側凹窩</text>

          <!-- ③ 左右風池靶心與「斜向上朝對側眼睛」箭頭 -->
          <circle cx="136" cy="128" r="13" fill="rgba(184,61,46,0.24)"/>
          <circle cx="136" cy="128" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <circle cx="224" cy="128" r="13" fill="rgba(184,61,46,0.24)"/>
          <circle cx="224" cy="128" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>

          <line x1="112" y1="158" x2="152" y2="112" stroke="#B83D2E" stroke-width="2.8" marker-end="url(#forceArrow)"/>
          <line x1="248" y1="158" x2="208" y2="112" stroke="#B83D2E" stroke-width="2.8" marker-end="url(#forceArrow)"/>
          <text x="180" y="48" text-anchor="middle" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 施力方向：斜向上朝「對側眼睛」頂進去！</text>
        </svg>
      `;

    case 'GB21': // 肩井：第七頸椎大椎穴 與 肩峰外端 連線 1/2 中點
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 頸肩背面輪廓 -->
          <path d="M148,25 L148,88 C105,94 55,108 38,145 L38,202 L322,202 L322,145 C305,108 255,94 212,88 L212,25 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- ① 大椎穴（低頭頸後最高骨） -->
          <circle cx="180" cy="95" r="7" fill="#2A483A"/>
          <text x="180" y="76" text-anchor="middle" fill="#2A483A" font-size="11" font-weight="bold">① 低頭摸頸後最凸骨(大椎)</text>

          <!-- ② 肩峰外端 -->
          <circle cx="62" cy="122" r="7" fill="#2A483A"/>
          <text x="72" y="152" fill="#2A483A" font-size="11" font-weight="bold">② 肩膀最外側骨尖(肩峰)</text>

          <!-- 連線與 1/2 中點肩井穴 -->
          <line x1="180" y1="95" x2="62" y2="122" stroke="#C4893B" stroke-width="2.5" stroke-dasharray="4 3"/>
          <circle cx="121" cy="108" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="121" cy="108" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="180" y="182" text-anchor="middle" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 肩井：兩點連線「正中間 1/2 處」垂直深按或提捏</text>
        </svg>
      `;

    case 'GV20': // 百會：兩耳尖連線 × 鼻樑正中線 十字交會點
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 頭頂俯視圖 -->
          <ellipse cx="180" cy="115" rx="72" ry="82" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 鼻尖朝上標記 -->
          <path d="M172,33 L180,18 L188,33" fill="#EFE6D5" stroke="#5A5246" stroke-width="1.8"/>
          <text x="202" y="28" fill="#655E53" font-size="10.5">← 鼻樑正中線延伸</text>
          <!-- 左右耳尖 -->
          <ellipse cx="104" cy="115" rx="6" ry="18" fill="#E5D9C3" stroke="#5A5246" stroke-width="1.8"/>
          <ellipse cx="256" cy="115" rx="6" ry="18" fill="#E5D9C3" stroke="#5A5246" stroke-width="1.8"/>
          <text x="48" y="119" fill="#2A483A" font-size="11" font-weight="bold">① 左耳尖</text>
          <text x="268" y="119" fill="#2A483A" font-size="11" font-weight="bold">① 右耳尖</text>

          <!-- 十字定位線 -->
          <line x1="104" y1="115" x2="256" y2="115" stroke="#2A483A" stroke-width="2" stroke-dasharray="4 3"/>
          <line x1="180" y1="22" x2="180" y2="195" stroke="#2A483A" stroke-width="2" stroke-dasharray="4 3"/>

          <!-- 百會靶心 -->
          <circle cx="180" cy="115" r="15" fill="rgba(184,61,46,0.25)"/>
          <circle cx="180" cy="115" r="7" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="180" y="212" text-anchor="middle" fill="#B83D2E" font-size="11.5" font-weight="bold">② 十字交會正中央頭骨微凹窩＝百會（勿以偏後的髮旋為準）</text>
        </svg>
      `;

    case 'EX-HN5': // 太陽：眉梢與外眼角連線中點，向後一橫指凹窩
    case 'BL2':    // 攢竹：眉頭下方眼眶骨眶上切迹凹槽（往上頂眉骨）
    case 'LI20':   // 迎香：鼻翼外緣中點旁、法令紋溝內
    case 'EX-HN3': // 印堂：兩眉頭連線正中點
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 眼眉鼻局部特寫 -->
          <ellipse cx="125" cy="92" rx="42" ry="26" fill="none" stroke="#8C6D46" stroke-width="2" stroke-dasharray="3 2"/>
          <path d="M82,72 Q125,54 162,68" fill="none" stroke="#3A352F" stroke-width="6" stroke-linecap="round"/>
          <path d="M94,94 Q125,80 154,94 Q125,104 94,94 Z" fill="#FFF" stroke="#3A352F" stroke-width="1.8"/>
          <circle cx="125" cy="92" r="7" fill="#3A352F"/>
          <path d="M180,68 L180,148 C180,162 152,168 152,152 C152,142 165,138 172,142" fill="none" stroke="#5A5246" stroke-width="2"/>
          <path d="M148,132 Q135,155 130,185" fill="none" stroke="#8C6D46" stroke-width="1.8" stroke-dasharray="3 2"/>

          ${pointId === 'EX-HN3' ? `
            <!-- 印堂定位：兩眉頭連線正中央 -->
            <line x1="160" y1="68" x2="196" y2="68" stroke="#2A483A" stroke-width="2" stroke-dasharray="3 2"/>
            <circle cx="180" cy="68" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="180" cy="68" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <line x1="180" y1="68" x2="180" y2="28" stroke="#B83D2E" stroke-width="3" marker-end="url(#forceArrow)"/>
            <text x="195" y="75" fill="#2A483A" font-size="11" font-weight="bold">① 左右兩眉頭連線正中央</text>
            <text x="195" y="98" fill="#B83D2E" font-size="11.5" font-weight="bold">② 由印堂往上慢推至額頭（開天門）</text>
          ` : ''}

          ${pointId === 'EX-HN5' ? `
            <!-- 太陽穴定位：眉梢與外眼角中點往外一指 -->
            <line x1="82" y1="72" x2="94" y2="94" stroke="#2A483A" stroke-width="1.8" stroke-dasharray="2 2"/>
            <circle cx="88" cy="83" r="3.5" fill="#2A483A"/>
            <line x1="88" y1="83" x2="58" y2="83" stroke="#B83D2E" stroke-width="2.5" marker-end="url(#forceArrow)"/>
            <circle cx="52" cy="83" r="13" fill="rgba(184,61,46,0.25)"/>
            <circle cx="52" cy="83" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="195" y="78" fill="#2A483A" font-size="11" font-weight="bold">① 眉梢與外眼角連線中點</text>
            <text x="195" y="102" fill="#B83D2E" font-size="11.5" font-weight="bold">② 往耳朵方向移 1 指寬凹窩</text>
            <text x="195" y="122" fill="#655E53" font-size="10.5">（咬牙時有肌肉鼓起處＝太陽穴）</text>
          ` : ''}

          ${pointId === 'BL2' ? `
            <!-- 攢竹定位：眉頭正下方眼眶骨凹槽往上頂 -->
            <circle cx="160" cy="70" r="13" fill="rgba(184,61,46,0.25)"/>
            <circle cx="160" cy="70" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <line x1="160" y1="108" x2="160" y2="78" stroke="#B83D2E" stroke-width="3" marker-end="url(#forceArrow)"/>
            <text x="195" y="75" fill="#B83D2E" font-size="11.5" font-weight="bold">① 眉頭下方摸到眼眶骨小凹槽</text>
            <text x="195" y="98" fill="#B83D2E" font-size="11.5" font-weight="bold">② 拇指「由下往上頂眉骨」！</text>
            <text x="195" y="118" fill="#655E53" font-size="10.5">（切勿往裡壓眼球）</text>
          ` : ''}

          ${pointId === 'LI20' ? `
            <!-- 迎香定位：鼻翼外緣中點 × 法令紋溝 -->
            <circle cx="143" cy="148" r="13" fill="rgba(184,61,46,0.25)"/>
            <circle cx="143" cy="148" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <line x1="112" y1="168" x2="138" y2="151" stroke="#B83D2E" stroke-width="2.8" marker-end="url(#forceArrow)"/>
            <text x="192" y="145" fill="#2A483A" font-size="11" font-weight="bold">① 鼻翼最寬處外側中點</text>
            <text x="192" y="166" fill="#B83D2E" font-size="11.5" font-weight="bold">② 卡進法令紋溝，朝鼻樑內上方頂</text>
          ` : ''}
        </svg>
      `;

    case 'TE17': // 翳風：耳垂正後方，乳突骨與下頷骨之間凹窩
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 耳朵與下顎側視圖 -->
          <path d="M125,35 C95,35 88,85 102,125 C108,142 125,148 134,132" fill="#EFE6D5" stroke="#5A5246" stroke-width="2.2"/>
          <!-- 耳後方乳突骨與下頷角 -->
          <circle cx="92" cy="128" r="16" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="1.8"/>
          <path d="M136,132 L132,185 L188,195" fill="none" stroke="#8C6D46" stroke-width="3" stroke-dasharray="4 2"/>
          <text x="16" y="102" fill="#8C6D46" font-size="10.5" font-weight="bold">① 耳後凸骨(乳突)</text>
          <text x="145" y="185" fill="#8C6D46" font-size="10.5" font-weight="bold">← ② 下巴骨後緣</text>
          <!-- 翳風靶心 -->
          <circle cx="114" cy="142" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="114" cy="142" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <line x1="85" y1="175" x2="108" y2="148" stroke="#B83D2E" stroke-width="2.8" marker-end="url(#forceArrow)"/>
          <text x="155" y="82" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 翳風：耳垂正後方深凹窩</text>
          <text x="155" y="102" fill="#655E53" font-size="10.5">（微張嘴時凹洞會變大，朝斜上方揉按）</text>
        </svg>
      `;

    case 'LU10': // 魚際：第一掌骨中點赤白肉際
    case 'PC8':  // 勞宮：握拳中指尖點到掌心第2、3掌骨間
    case 'LU7':  // 列缺：虎口交叉食指尖到達之橈骨莖突上方骨縫
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 手掌與手腕局部輪廓 -->
          <path d="M88,205 L92,145 C78,110 76,55 92,32 C105,22 135,18 168,28 C192,38 228,85 215,112 C202,126 184,132 172,150 L168,205 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 第一掌骨（大拇指骨）與第二、三掌骨 -->
          <line x1="164" y1="145" x2="208" y2="95" stroke="#8C6D46" stroke-width="11" stroke-linecap="round" opacity="0.38"/>
          <line x1="138" y1="142" x2="145" y2="42" stroke="#8C6D46" stroke-width="8" stroke-linecap="round" opacity="0.3"/>
          <line x1="118" y1="142" x2="118" y2="38" stroke="#8C6D46" stroke-width="8" stroke-linecap="round" opacity="0.3"/>

          ${pointId === 'LU10' ? `
            <circle cx="186" cy="118" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="186" cy="118" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="220" y="92" fill="#2A483A" font-size="11" font-weight="bold">① 大拇指長骨(第一掌骨)</text>
            <text x="220" y="114" fill="#B83D2E" font-size="11.5" font-weight="bold">② 骨頭 1/2 中點邊緣＝魚際</text>
            <text x="220" y="132" fill="#655E53" font-size="10.5">（往大拇指骨頭底下推揉）</text>
          ` : ''}

          ${pointId === 'PC8' ? `
            <circle cx="132" cy="95" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="132" cy="95" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <path d="M122,38 Q128,68 132,92" fill="none" stroke="#2A483A" stroke-width="2" stroke-dasharray="3 2" marker-end="url(#forceArrow)"/>
            <text x="195" y="78" fill="#2A483A" font-size="11" font-weight="bold">① 自然握拳彎曲手指</text>
            <text x="195" y="102" fill="#B83D2E" font-size="11.5" font-weight="bold">② 「中指指尖」點到的掌心凹窩</text>
            <text x="195" y="122" fill="#655E53" font-size="10.5">③ 張開手掌垂直深按＝勞宮穴</text>
          ` : ''}

          ${pointId === 'LU7' ? `
            <circle cx="166" cy="176" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="166" cy="176" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="195" y="155" fill="#2A483A" font-size="11" font-weight="bold">① 兩手虎口交叉互扣</text>
            <text x="195" y="176" fill="#B83D2E" font-size="11.5" font-weight="bold">② 食指尖摸到手腕側面凸骨裂縫</text>
            <text x="195" y="194" fill="#655E53" font-size="10.5">（腕橫紋上 1.5 寸骨縫凹槽＝列缺）</text>
          ` : ''}
        </svg>
      `;

    case 'SP10': // 血海：膝蓋骨內側上緣往上三指寬(2寸)
    case 'ST40': // 豐隆：小腿外膝眼與外踝尖連線正中點，脛骨外移兩橫指
    case 'BL60': // 崑崙：外踝尖與跟腱水平連線正中央凹窩
      if (pointId === 'SP10') {
        return `
          <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
            ${commonDefs}
            <rect width="360" height="220" rx="12" fill="#F8F4EC" />
            <path d="M105,15 L112,205 L228,205 L235,15 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
            <!-- 膝蓋骨（髕骨） -->
            <ellipse cx="168" cy="165" rx="30" ry="22" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="2"/>
            <text x="18" y="168" fill="#8C6D46" font-size="11" font-weight="bold">① 膝蓋骨內上緣 →</text>
            <!-- 往上三指寬 (2寸) -->
            <g opacity="0.88">
              <rect x="112" y="88" width="112" height="18" rx="7" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
              <rect x="112" y="106" width="112" height="18" rx="7" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
              <rect x="112" y="124" width="112" height="18" rx="7" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.4"/>
              <text x="234" y="118" fill="#8C5A16" font-size="11" font-weight="bold">② 往上三指寬 (2寸)</text>
            </g>
            <!-- 血海靶心 -->
            <circle cx="195" cy="82" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="195" cy="82" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="145" y="52" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 大腿內側肌肉鼓起處＝血海穴</text>
          </svg>
        `;
      }
      if (pointId === 'ST40') {
        return `
          <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
            ${commonDefs}
            <rect width="360" height="220" rx="12" fill="#F8F4EC" />
            <path d="M112,12 C102,75 104,145 115,205 L218,205 C228,145 225,75 215,12 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
            <!-- 脛骨前緣 -->
            <line x1="175" y1="18" x2="175" y2="200" stroke="#8C6D46" stroke-width="10" opacity="0.38"/>
            <text x="188" y="65" fill="#8C6D46" font-size="10.5" font-weight="bold">← 迎面硬骨(脛骨)</text>
            <!-- 小腿 1/2 中點線 -->
            <line x1="95" y1="110" x2="235" y2="110" stroke="#2A483A" stroke-width="1.8" stroke-dasharray="4 3"/>
            <text x="15" y="105" fill="#2A483A" font-size="10.5" font-weight="bold">① 膝至外踝 1/2 中點</text>
            <!-- 外移兩橫指 -->
            <rect x="132" y="102" width="42" height="16" rx="4" fill="#F6ECD9" stroke="#C4893B" stroke-width="1.5"/>
            <circle cx="132" cy="110" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="132" cy="110" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="145" y="158" fill="#B83D2E" font-size="11.5" font-weight="bold">② 從脛骨往外側移「2 指寬」＝豐隆穴</text>
          </svg>
        `;
      }
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <path d="M105,20 L110,135 C95,155 75,172 75,192 L245,192 C252,175 242,145 232,125 L228,20 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <circle cx="148" cy="118" r="14" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="2"/>
          <text x="22" y="122" fill="#2A483A" font-size="11" font-weight="bold">① 外踝尖凸骨 →</text>
          <line x1="224" y1="25" x2="232" y2="185" stroke="#8C6D46" stroke-width="10" opacity="0.45"/>
          <text x="245" y="122" fill="#2A483A" font-size="11" font-weight="bold">← ② 後腳跟大筋</text>
          <line x1="148" y1="118" x2="228" y2="118" stroke="#C4893B" stroke-width="2" stroke-dasharray="3 2"/>
          <circle cx="188" cy="118" r="13" fill="rgba(184,61,46,0.25)"/>
          <circle cx="188" cy="118" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 崑崙：腳踝外側「外踝尖與後跟大筋正中央凹窩」</text>
        </svg>
      `;

    case 'KI3':  // 太谿：內踝尖與後跟腱水平連線正中點
    case 'BL40': // 委中：膝後膕橫紋正中央（屈膝兩筋間）
    case 'KI1':  // 湧泉：捲趾時足底前 1/3 人字紋頂點凹窩
    default:
      if (pointId === 'KI3') {
        return `
          <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
            ${commonDefs}
            <rect width="360" height="220" rx="12" fill="#F8F4EC" />
            <!-- 腳踝內側特寫 -->
            <path d="M105,20 L110,135 C95,155 75,172 75,192 L245,192 C252,175 242,145 232,125 L228,20 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
            <!-- ① 內踝尖 -->
            <circle cx="148" cy="118" r="14" fill="url(#boneHatch)" stroke="#8C6D46" stroke-width="2"/>
            <text x="22" y="122" fill="#2A483A" font-size="11" font-weight="bold">① 內踝尖凸骨 →</text>
            <!-- ② 阿基里斯腱（跟腱） -->
            <line x1="224" y1="25" x2="232" y2="185" stroke="#8C6D46" stroke-width="10" opacity="0.45"/>
            <text x="245" y="122" fill="#2A483A" font-size="11" font-weight="bold">← ② 後腳跟大筋</text>
            <!-- 水平連線與 1/2 中點太谿 -->
            <line x1="148" y1="118" x2="228" y2="118" stroke="#C4893B" stroke-width="2" stroke-dasharray="3 2"/>
            <circle cx="188" cy="118" r="13" fill="rgba(184,61,46,0.25)"/>
            <circle cx="188" cy="118" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="11.5" font-weight="bold">③ 太谿：內踝尖與後跟大筋「水平連線正中央凹窩」</text>
          </svg>
        `;
      }
      if (pointId === 'BL40') {
        return `
          <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
            ${commonDefs}
            <rect width="360" height="220" rx="12" fill="#F8F4EC" />
            <!-- 膝後膕窩特寫 -->
            <path d="M112,15 C118,85 118,135 112,205 L248,205 C242,135 242,85 248,15 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
            <!-- 左右兩條粗肌腱 -->
            <line x1="126" y1="20" x2="126" y2="200" stroke="#8C6D46" stroke-width="9" opacity="0.4"/>
            <line x1="234" y1="20" x2="234" y2="200" stroke="#8C6D46" stroke-width="9" opacity="0.4"/>
            <!-- ① 膝後橫紋 -->
            <path d="M116,110 Q180,116 244,110" fill="none" stroke="#2A483A" stroke-width="2.5" stroke-dasharray="4 2"/>
            <text x="18" y="114" fill="#2A483A" font-size="11" font-weight="bold">① 膝後折紋 →</text>
            <!-- ③ 橫紋正中央委中穴 -->
            <circle cx="180" cy="112" r="14" fill="rgba(184,61,46,0.25)"/>
            <circle cx="180" cy="112" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
            <text x="180" y="175" text-anchor="middle" fill="#B83D2E" font-size="11.5" font-weight="bold">② 坐姿微屈膝放鬆，按「橫紋正中央、兩筋中間」＝委中</text>
          </svg>
        `;
      }
      // KI1 湧泉
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 足底板特寫 -->
          <path d="M142,202 C125,202 118,165 122,125 C125,85 112,42 135,24 C158,12 202,12 218,28 C236,48 225,95 218,135 C212,172 205,202 182,202 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- ① 捲趾時的人字形凹紋 -->
          <path d="M136,102 Q172,72 208,102" fill="none" stroke="#2A483A" stroke-width="3" stroke-linecap="round"/>
          <line x1="236" y1="32" x2="236" y2="200" stroke="#8C6D46" stroke-width="1.5" stroke-dasharray="3 2"/>
          <line x1="230" y1="86" x2="244" y2="86" stroke="#B83D2E" stroke-width="2"/>
          <text x="250" y="90" fill="#2A483A" font-size="11" font-weight="bold">← 前 1/3 與後 2/3 交界</text>
          <!-- 湧泉靶心 -->
          <circle cx="172" cy="86" r="14" fill="rgba(184,61,46,0.25)"/>
          <circle cx="172" cy="86" r="6.5" fill="#B83D2E" stroke="#FFF" stroke-width="2"/>
          <text x="16" y="85" fill="#B83D2E" font-size="11.5" font-weight="bold">① 腳趾用力往下捲</text>
          <text x="16" y="104" fill="#B83D2E" font-size="11.5" font-weight="bold">② 「人」字凹窩最深處</text>
        </svg>
      `;
  }
}
