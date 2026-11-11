// 👶 小兒推拿與青少年轉骨穴位 1:1 微距特寫圖解
export function getChildCloseupSvgMarkup(pointId) {
  const commonDefs = `
    <defs>
      <marker id="childArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#B83D2E" />
      </marker>
      <marker id="childGreenArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2A7352" />
      </marker>
    </defs>
  `;

  switch (pointId) {
    case 'PED-PI': // 小兒脾經：大拇指螺紋面
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 幼兒大拇指指腹微距特寫 -->
          <path d="M120,180 L120,110 C120,60 150,45 180,45 C210,45 240,60 240,110 L240,180 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 指甲輪廓（指背示意） -->
          <!-- 指腹螺旋指紋線 -->
          <ellipse cx="180" cy="110" rx="38" ry="42" fill="none" stroke="#8C6D46" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.6"/>
          <ellipse cx="180" cy="110" rx="26" ry="28" fill="none" stroke="#8C6D46" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.6"/>
          <ellipse cx="180" cy="110" rx="14" ry="16" fill="none" stroke="#8C6D46" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.7"/>

          <!-- 旋推補脾經指示弧線 -->
          <path d="M152,90 A34,34 0 1,1 206,128" fill="none" stroke="#B83D2E" stroke-width="2.5" marker-end="url(#childArrow)"/>
          <circle cx="180" cy="110" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

          <text x="24" y="40" fill="#2A483A" font-size="11" font-weight="bold">① 塗少許嬰兒乳液於大拇指指腹</text>
          <text x="24" y="62" fill="#2A483A" font-size="11" font-weight="bold">② 家長拇指順時針「輕快旋推」</text>
          <text x="260" y="102" fill="#7A4F13" font-size="10" font-weight="bold">🔄 順時針旋推</text>
          <text x="260" y="120" fill="#655E53" font-size="9.5">每分鐘約 120 次</text>
          <text x="260" y="138" fill="#655E53" font-size="9.5">連續推 200~300 下</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 補脾經：挑食厭食、體虛吃不胖幼兒每日必推，開胃健脾神效
          </text>
        </svg>
      `;

    case 'PED-BANMEN': // 板門：大魚際平面
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 幼兒手掌大魚際特寫 -->
          <path d="M100,195 C85,160 80,105 110,65 C135,35 170,40 195,65 C225,95 235,160 215,195 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 第一掌骨基底陰影 -->
          <path d="M115,175 C110,135 125,85 155,60" fill="none" stroke="#8C6D46" stroke-width="3" stroke-dasharray="3 3" opacity="0.45"/>

          <!-- 板門穴位點與揉法圓環 -->
          <ellipse cx="158" cy="120" rx="22" ry="20" fill="rgba(42,72,58,0.2)" stroke="#2A483A" stroke-width="2"/>
          <path d="M138,110 A20,20 0 1,1 178,130" fill="none" stroke="#2A7352" stroke-width="2.5" marker-end="url(#childGreenArrow)"/>
          <circle cx="158" cy="120" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

          <text x="24" y="38" fill="#2A483A" font-size="11" font-weight="bold">① 展開幼兒手掌，找到大魚際肉球中心</text>
          <text x="24" y="60" fill="#2A483A" font-size="11" font-weight="bold">② 拇指指端順時針輕揉 100~300 次</text>
          <text x="240" y="105" fill="#1D4734" font-size="10" font-weight="bold">掌面大魚際中央</text>
          <text x="240" y="123" fill="#655E53" font-size="9.5">消食導滯化胃脹</text>
          <text x="240" y="141" fill="#655E53" font-size="9.5">吐奶溢奶請推向手腕</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 揉板門：小兒積食腹部鼓脹、口氣酸臭時，揉 2 分鐘即刻排氣通暢
          </text>
        </svg>
      `;

    case 'PED-SIHENGWEN': // 四橫紋（四縫穴）：四指指關節
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 四指近端指節展開特寫 -->
          <path d="M50,180 L50,105 C50,65 75,60 85,95 L88,140" fill="#EFE6D5" stroke="#5A5246" stroke-width="1.8"/>
          <path d="M88,140 L90,85 C90,45 118,40 128,75 L130,140" fill="#EFE6D5" stroke="#5A5246" stroke-width="1.8"/>
          <path d="M130,140 L132,90 C132,50 160,45 170,80 L172,140" fill="#EFE6D5" stroke="#5A5246" stroke-width="1.8"/>
          <path d="M172,140 L174,105 C174,70 198,68 206,98 L208,180 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="1.8"/>

          <!-- 四指第一指關節橫紋線 -->
          <line x1="60" y1="135" x2="80" y2="135" stroke="#5A5246" stroke-width="2.5"/>
          <line x1="98" y1="135" x2="120" y2="135" stroke="#5A5246" stroke-width="2.5"/>
          <line x1="140" y1="135" x2="162" y2="135" stroke="#5A5246" stroke-width="2.5"/>
          <line x1="180" y1="135" x2="200" y2="135" stroke="#5A5246" stroke-width="2.5"/>

          <!-- 四橫紋紅點標記 -->
          <circle cx="70" cy="135" r="5" fill="#B83D2E" stroke="#FFF" stroke-width="1.2"/>
          <circle cx="109" cy="135" r="5" fill="#B83D2E" stroke="#FFF" stroke-width="1.2"/>
          <circle cx="151" cy="135" r="5" fill="#B83D2E" stroke="#FFF" stroke-width="1.2"/>
          <circle cx="190" cy="135" r="5" fill="#B83D2E" stroke="#FFF" stroke-width="1.2"/>

          <!-- 橫推方向雙向箭頭 -->
          <line x1="55" y1="155" x2="205" y2="155" stroke="#B83D2E" stroke-width="3" marker-end="url(#childArrow)"/>
          <line x1="205" y1="155" x2="55" y2="155" stroke="#B83D2E" stroke-width="3" marker-end="url(#childArrow)"/>

          <text x="24" y="36" fill="#2A483A" font-size="11" font-weight="bold">① 食、中、無名、小指第一指關節橫紋</text>
          <text x="24" y="56" fill="#2A483A" font-size="11" font-weight="bold">② 家長拇指腹在四橫紋上「快速來回橫推」</text>
          <text x="235" y="105" fill="#8A2519" font-size="10" font-weight="bold">↔ 來回平推100次</text>
          <text x="235" y="125" fill="#655E53" font-size="9.5">亦可以指甲輕掐各指</text>
          <text x="235" y="143" fill="#655E53" font-size="9.5">嚴禁針挑破皮！</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 四橫紋：中醫小兒疳積第一要穴，退熱除煩、改善面黃肌瘦不吸收
          </text>
        </svg>
      `;

    case 'PED-TIANHESHI': // 清天河水：前臂中線
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 前臂內側掌面微距輪廓 -->
          <path d="M120,185 L125,50 L195,50 L200,185 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <text x="160" y="45" text-anchor="middle" fill="#655E53" font-size="9.5">手肘橫紋(曲澤)</text>
          <text x="160" y="198" text-anchor="middle" fill="#655E53" font-size="9.5">手腕橫紋(總筋)</text>

          <!-- 天河水正中線與由下往上飛推箭頭 -->
          <line x1="160" y1="180" x2="160" y2="58" stroke="#2A7352" stroke-width="5" stroke-linecap="round" marker-end="url(#childGreenArrow)"/>
          <line x1="160" y1="180" x2="160" y2="58" stroke="#FFF" stroke-width="1.5" stroke-dasharray="4 3"/>

          <!-- 併攏食中指飛推示意 -->
          <circle cx="160" cy="130" r="14" fill="rgba(42,115,82,0.22)" stroke="#2A7352" stroke-width="1.5"/>
          <circle cx="160" cy="130" r="5" fill="#2A7352"/>

          <text x="20" y="34" fill="#2A483A" font-size="11" font-weight="bold">① 手臂抹少許溫水或清涼膏</text>
          <text x="20" y="54" fill="#2A483A" font-size="11" font-weight="bold">② 食中二指併攏「由腕向肘單向推」</text>
          <text x="220" y="95" fill="#1D4734" font-size="10.5" font-weight="bold">↑ 單向推 300~500 下</text>
          <text x="220" y="115" fill="#655E53" font-size="9.5">輕快如春風拂柳</text>
          <text x="220" y="133" fill="#655E53" font-size="9.5">每分鐘 150~200 次</text>
          <text x="220" y="151" fill="#B83D2E" font-size="9.5">方向切勿逆推！</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 清天河水：小兒低燒、心火口瘡、煩躁夜啼的天然散熱清涼法
          </text>
        </svg>
      `;

    case 'PED-XIAOTIANXIN': // 小天心：大小魚際交界凹窩
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 幼兒手掌底部特寫 -->
          <path d="M80,180 C70,120 85,70 120,50 C140,40 180,40 200,50 C235,70 250,120 240,180 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 大魚際與小魚際兩團肉球 -->
          <ellipse cx="120" cy="115" rx="30" ry="40" fill="rgba(196,137,59,0.15)" stroke="#8C6D46" stroke-width="1.2" stroke-dasharray="3 2"/>
          <text x="120" y="118" text-anchor="middle" fill="#8C6D46" font-size="9.5">大魚際</text>
          <ellipse cx="200" cy="115" rx="26" ry="38" fill="rgba(196,137,59,0.15)" stroke="#8C6D46" stroke-width="1.2" stroke-dasharray="3 2"/>
          <text x="200" y="118" text-anchor="middle" fill="#8C6D46" font-size="9.5">小魚際</text>

          <!-- 兩肉球交界正中凹窩（小天心） -->
          <circle cx="160" cy="135" r="16" fill="rgba(184,61,46,0.25)" stroke="#B83D2E" stroke-width="2"/>
          <circle cx="160" cy="135" r="6" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

          <text x="20" y="34" fill="#2A483A" font-size="11" font-weight="bold">① 手掌底部，大拇指肉與小指肉交界處</text>
          <text x="20" y="54" fill="#2A483A" font-size="11" font-weight="bold">② 正中央最深的小凹窩即為小天心</text>
          <text x="235" y="90" fill="#8A2519" font-size="10" font-weight="bold">搗小天心法：</text>
          <text x="235" y="108" fill="#655E53" font-size="9.5">以中指尖輕啄50下</text>
          <text x="235" y="126" fill="#655E53" font-size="9.5">如小雞啄米般輕彈</text>
          <text x="235" y="144" fill="#655E53" font-size="9.5">或指腹柔揉1分鐘</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 小天心：幼童白天受驚、夜啼哭鬧、驚惕不安必搗收驚穴
          </text>
        </svg>
      `;

    case 'PED-NIEJI': // 小兒捏脊：華佗夾脊督脈
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 幼童背部脊柱微距輪廓 -->
          <path d="M120,185 C115,130 115,80 125,45 L195,45 C205,80 205,130 200,185 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 脊椎正中線與提捏箭頭 -->
          <line x1="160" y1="180" x2="160" y2="52" stroke="#B83D2E" stroke-width="4" stroke-linecap="round" marker-end="url(#childArrow)"/>
          <line x1="160" y1="180" x2="160" y2="52" stroke="#FFF" stroke-width="1.5" stroke-dasharray="4 3"/>

          <!-- 夾脊捏皮手勢示意 -->
          <path d="M135,120 Q160,110 185,120" fill="none" stroke="#C4893B" stroke-width="3"/>
          <circle cx="135" cy="120" r="5" fill="#C4893B"/>
          <circle cx="185" cy="120" r="5" fill="#C4893B"/>

          <text x="160" y="40" text-anchor="middle" fill="#8A2519" font-size="9.5" font-weight="bold">終點：第七頸椎(大椎)</text>
          <text x="160" y="198" text-anchor="middle" fill="#8A2519" font-size="9.5" font-weight="bold">起點：尾椎骨(長強)</text>

          <text x="20" y="32" fill="#2A483A" font-size="11" font-weight="bold">① 幼兒趴臥，背部抹少許潤膚油</text>
          <text x="20" y="52" fill="#2A483A" font-size="11" font-weight="bold">② 雙手拇食指夾起脊椎兩側皮肉</text>
          <text x="220" y="90" fill="#8A2519" font-size="10.5" font-weight="bold">↑ 由下往上推進</text>
          <text x="220" y="110" fill="#655E53" font-size="9.5">早晚各推 5~7 遍</text>
          <text x="220" y="128" fill="#655E53" font-size="9.5">捏三提一（提拉鬆解）</text>
          <text x="220" y="146" fill="#2A7352" font-size="9.5">背部微紅發熱為度</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 捏脊法：提升全身陽氣與免疫力，改善反覆感冒、過敏與脾胃消化
          </text>
        </svg>
      `;

    case 'GB39': // 懸鐘（絕骨）：外踝尖上3寸
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 小腿下段與外踝特寫 -->
          <path d="M110,35 L115,145 C112,165 105,185 118,195 L195,195 C202,185 198,165 192,145 L185,35 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 外踝骨頭突出點 -->
          <circle cx="168" cy="165" r="11" fill="rgba(140,109,70,0.25)" stroke="#8C6D46" stroke-width="1.6"/>
          <text x="168" y="185" text-anchor="middle" fill="#655E53" font-size="9.5">外踝尖</text>

          <!-- 腓骨前緣長骨虛線 -->
          <line x1="168" y1="35" x2="168" y2="155" stroke="#8C6D46" stroke-width="4" stroke-dasharray="3 3" opacity="0.45"/>

          <!-- 3寸標尺 (四橫指) -->
          <line x1="195" y1="165" x2="195" y2="98" stroke="#1D4734" stroke-width="1.8" stroke-dasharray="2 2"/>
          <text x="215" y="135" fill="#1D4734" font-size="10" font-weight="bold">↑ 3寸(4指寬)</text>

          <!-- 懸鐘穴位點 (腓骨前緣) -->
          <ellipse cx="160" cy="98" rx="14" ry="12" fill="rgba(42,115,82,0.28)" stroke="#2A7352" stroke-width="2"/>
          <line x1="135" y1="98" x2="152" y2="98" stroke="#B83D2E" stroke-width="2.5" marker-end="url(#childArrow)"/>
          <circle cx="160" cy="98" r="5.5" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

          <text x="20" y="34" fill="#2A483A" font-size="11" font-weight="bold">① 找到腳踝外側突起骨尖(外踝尖)</text>
          <text x="20" y="54" fill="#2A483A" font-size="11" font-weight="bold">② 直上量四橫指(3寸)，在骨頭前緣凹槽</text>
          <text x="235" y="85" fill="#1D4734" font-size="10.5" font-weight="bold">八會穴之「髓會」</text>
          <text x="235" y="105" fill="#655E53" font-size="9.5">大拇指深按得氣</text>
          <text x="235" y="123" fill="#655E53" font-size="9.5">骨骼生長痛改善</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 懸鐘穴：青少年長高轉骨第一要穴，刺激生長板骨髓充盈與小腿伸長
          </text>
        </svg>
      `;

    case 'ST2': // 四白穴：瞳孔直下眶下孔
      return `
        <svg viewBox="0 0 360 220" class="closeup-svg" xmlns="http://www.w3.org/2000/svg">
          ${commonDefs}
          <rect width="360" height="220" rx="12" fill="#F8F4EC" />
          <!-- 面頰眼眶微距特寫 -->
          <path d="M90,30 C80,80 85,140 120,180 C150,195 190,195 220,180 C255,140 260,80 250,30 Z" fill="#EFE6D5" stroke="#5A5246" stroke-width="2"/>
          <!-- 雙眼與瞳孔 -->
          <path d="M105,75 Q125,60 145,75 Q125,90 105,75 Z" fill="#FFF" stroke="#5A5246" stroke-width="1.8"/>
          <circle cx="125" cy="75" r="7" fill="#332A20"/>
          <path d="M195,75 Q215,60 235,75 Q215,90 195,75 Z" fill="#FFF" stroke="#5A5246" stroke-width="1.8"/>
          <circle cx="215" cy="75" r="7" fill="#332A20"/>

          <!-- 瞳孔直下垂線 -->
          <line x1="125" y1="82" x2="125" y2="120" stroke="#8C6D46" stroke-width="1.5" stroke-dasharray="3 2"/>
          <line x1="215" y1="82" x2="215" y2="120" stroke="#8C6D46" stroke-width="1.5" stroke-dasharray="3 2"/>

          <!-- 眶下骨孔（四白穴）與揉按光圈 -->
          <circle cx="125" cy="120" r="13" fill="rgba(196,137,59,0.28)" stroke="#C4893B" stroke-width="1.8"/>
          <circle cx="125" cy="120" r="5" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

          <circle cx="215" cy="120" r="13" fill="rgba(196,137,59,0.28)" stroke="#C4893B" stroke-width="1.8"/>
          <circle cx="215" cy="120" r="5" fill="#B83D2E" stroke="#FFF" stroke-width="1.5"/>

          <text x="20" y="32" fill="#2A483A" font-size="11" font-weight="bold">① 眼睛平視，瞳孔正中心垂直向下</text>
          <text x="20" y="52" fill="#2A483A" font-size="11" font-weight="bold">② 眼眶骨下緣一橫指凹孔處即為四白</text>
          <text x="250" y="105" fill="#7A4F13" font-size="10" font-weight="bold">國小護眼操</text>
          <text x="250" y="123" fill="#655E53" font-size="9.5">食指指腹輕揉圓</text>
          <text x="250" y="141" fill="#655E53" font-size="9.5">切勿向上壓眼球！</text>

          <text x="180" y="210" text-anchor="middle" fill="#B83D2E" font-size="10.5" font-weight="bold">
            ③ 四白穴：放鬆眼底睫狀肌痙攣，改善假性近視、看黑板模糊與眼眶黑眼圈
          </text>
        </svg>
      `;

    default:
      return '';
  }
}
