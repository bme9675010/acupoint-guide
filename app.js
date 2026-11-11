import { ACUPOINTS, SYMPTOM_PRESETS, ZIWU_LIUZHU } from './data/acupoints.js';
import { getCloseupSvgMarkup } from './data/closeupDiagrams.js';
import { AR_SUPPORTED_POINTS, openArModal, initArControls } from './arFinder.js';

// 狀態管理
const state = {
  currentView: 'front',          // 'front' | 'back' | 'head' | 'hand' | 'foot'
  selectedPointId: 'LI4',        // 預設選中合谷穴
  activePresetId: null,          // 當前處方籤 ID
  activeSymptomTag: null,        // 當前單一症狀篩選
  highlightedIds: new Set(),     // 高亮穴位集合
  xrayOpacity: 0.55,             // 骨骼透視透明度 (0 ~ 1)
  autoZoomEnabled: true,         // 點擊穴位時是否自動局部放大畫布
  isZoomedIn: false,             // 當前畫布是否處於局部放大狀態
  playlist: {
    isPlaying: false,            // 是否正在跑整套處方連續自動跟練
    queue: [],                   // 處方穴位 ID 陣列
    currentIndex: 0,             // 目前跟練到第幾顆
    completedIds: new Set()      // 已完成跟練的穴位
  },
  timer: {
    running: false,
    phase: 'idle',               // 'idle' | 'press' | 'release'
    phaseTimeLeft: 0,
    totalTimeLeft: 60,
    intervalId: null
  }
};

// Web Audio API 頌缽與木魚溫潤音效合成器（完美解決 iPhone Safari 無震動 API 的問題）
let audioCtx = null;

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSingingBowl(type = 'press') {
  const soundEnabled = document.getElementById('soundToggle')?.checked;
  if (!soundEnabled) return;

  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);

  if (type === 'press') {
    const freqs = [256, 512, 768];
    const gains = [0.28, 0.12, 0.05];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(gains[idx], now + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  } else {
    const freqs = [432, 648];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(idx === 0 ? 0.16 : 0.06, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.25);
    });
  }
}

function speakGuide(text) {
  const soundEnabled = document.getElementById('soundToggle')?.checked;
  if (!soundEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-TW';
    utter.rate = 0.96;
    utter.pitch = 0.95;
    utter.volume = 0.8;
    window.speechSynthesis.speak(utter);
  } catch (_) {}
}

// 取得 5 大視圖（正面、背面、頭面特寫、手部特寫、足腿特寫）的新中式人體與骨骼透視 SVG
function getBaseBodySvgMarkup(view, xrayOpacity) {
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

  // 新增：足腿與足底特寫視圖 (foot)
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

    const statusClass = [
      'acupoint-node',
      isSelected ? 'selected' : '',
      isHighlighted ? 'highlighted' : '',
      isDimmed ? 'dimmed' : ''
    ].filter(Boolean).join(' ');

    const labelOnRight = coord.x > 210;
    const labelX = labelOnRight ? coord.x + 12 : coord.x - 12;
    const labelAnchor = labelOnRight ? 'start' : 'end';

    nodesMarkup.push(`
      <g class="${statusClass}" data-point-id="${pt.id}" role="button" tabindex="0" aria-label="${pt.name}穴 (${pt.id})">
        <circle class="acupoint-pulse" cx="${coord.x}" cy="${coord.y}" r="11" />
        <circle class="acupoint-core" cx="${coord.x}" cy="${coord.y}" r="6.5" />
        <text class="acupoint-label" x="${labelX}" y="${coord.y + 4}" text-anchor="${labelAnchor}">${pt.name}</text>
      </g>
    `);

    // 正面與背面全身視圖繪製左右對稱鏡像點
    if ((state.currentView === 'front' || state.currentView === 'back') && Math.abs(coord.x - 200) > 4) {
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

  svg.querySelectorAll('.acupoint-node').forEach((node) => {
    node.addEventListener('click', () => {
      const pointId = node.getAttribute('data-point-id');
      selectAcupoint(pointId, true);
    });
  });
}

// 選取穴位並更新右側教學面板
function selectAcupoint(pointId, autoSwitchViewIfNeeded = false, keepTimerIfPlaylist = false) {
  const point = ACUPOINTS.find((p) => p.id === pointId);
  if (!point) return;

  state.selectedPointId = point.id;

  // 若當前視圖沒有這個穴位，優先切換到局部特寫視圖或正反面視圖
  if (autoSwitchViewIfNeeded && !point.views[state.currentView]) {
    const preferredOrder = ['head', 'hand', 'foot', 'front', 'back'];
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
}

// 針對選中穴位自動將全身畫布局部放大聚焦
function applySvgZoomForPoint(point) {
  const svg = document.getElementById('bodySvg');
  const resetBtn = document.getElementById('resetZoomFloatingBtn');
  if (!svg) return;

  const coord = point?.views[state.currentView];
  // 特寫視圖 (head / hand / foot) 本身已經是放大圖，不需再裁切 viewBox
  if (!state.autoZoomEnabled || !coord || ['head', 'hand', 'foot'].includes(state.currentView)) {
    svg.setAttribute('viewBox', '0 0 400 680');
    state.isZoomedIn = false;
    if (resetBtn) resetBtn.style.display = 'none';
    return;
  }

  const zoomW = 180;
  const zoomH = 306;
  const minX = Math.max(0, Math.min(400 - zoomW, coord.x - zoomW / 2));
  const minY = Math.max(0, Math.min(680 - zoomH, coord.y - zoomH / 2));

  svg.setAttribute('viewBox', `${minX.toFixed(0)} ${minY.toFixed(0)} ${zoomW} ${zoomH}`);
  state.isZoomedIn = true;
  if (resetBtn) resetBtn.style.display = 'inline-block';
}

function resetSvgZoom() {
  const svg = document.getElementById('bodySvg');
  const resetBtn = document.getElementById('resetZoomFloatingBtn');
  if (svg) svg.setAttribute('viewBox', '0 0 400 680');
  state.isZoomedIn = false;
  if (resetBtn) resetBtn.style.display = 'none';
}

// 更新右側詳情面板內容
function renderInspector(point) {
  document.getElementById('pointName').textContent = point.name;
  document.getElementById('pointCode').textContent = point.id;
  document.getElementById('pointPinyin').textContent = point.pinyin;
  document.getElementById('pointMeridian').textContent = point.meridian;
  document.getElementById('pointAttr').textContent = point.attribute;

  const cautionEl = document.getElementById('cautionBanner');
  cautionEl.textContent = point.contraindications.notes;
  cautionEl.className = point.contraindications.pregnancyForbidden
    ? 'caution-banner'
    : 'caution-banner safe';

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

// 🎵 處方連續自動跟練播放清單控制
function updatePlaylistBannerUI() {
  const banner = document.getElementById('playlistBanner');
  const titleEl = document.getElementById('playlistTitle');
  const stepsEl = document.getElementById('playlistSteps');
  const playBtn = document.getElementById('startPlaylistBtn');
  if (!banner || !titleEl || !stepsEl || !playBtn) return;

  const preset = SYMPTOM_PRESETS.find((p) => p.id === state.activePresetId);
  if (!preset) {
    banner.style.display = 'none';
    return;
  }

  banner.style.display = 'flex';
  titleEl.textContent = `${preset.icon} 【${preset.title}】連續跟練處方（共 ${preset.points.length} 穴）`;

  stepsEl.innerHTML = preset.points
    .map((pid, idx) => {
      const pt = ACUPOINTS.find((p) => p.id === pid);
      const isCurrent = state.selectedPointId === pid;
      const isDone = state.playlist.completedIds.has(pid);
      const cls = [
        'playlist-step-pill',
        isCurrent ? 'current' : '',
        isDone ? 'done' : ''
      ].filter(Boolean).join(' ');
      return `
        <span class="${cls}" data-step-point="${pid}">
          ${isDone ? '✓ ' : `${idx + 1}. `}${pt ? pt.name : pid}
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

  if (state.playlist.isPlaying) {
    playBtn.textContent = `⏸ 停止處方連播 (${state.playlist.currentIndex + 1}/${state.playlist.queue.length})`;
    playBtn.classList.add('playing');
  } else {
    playBtn.textContent = '▶️ 連續跟練整套處方';
    playBtn.classList.remove('playing');
  }
}

function togglePlaylistExecution() {
  const preset = SYMPTOM_PRESETS.find((p) => p.id === state.activePresetId);
  if (!preset) return;

  if (state.playlist.isPlaying) {
    state.playlist.isPlaying = false;
    stopAndResetTimer();
    updatePlaylistBannerUI();
    return;
  }

  // 啟動整套處方自動連播
  state.playlist.isPlaying = true;
  state.playlist.queue = [...preset.points];
  state.playlist.currentIndex = 0;
  state.playlist.completedIds.clear();

  const firstId = state.playlist.queue[0];
  const firstPt = ACUPOINTS.find((p) => p.id === firstId);
  selectAcupoint(firstId, true, false);
  switchDetailTab('tab-massage');
  updatePlaylistBannerUI();

  if (firstPt) {
    speakGuide(`開始${preset.title}處方跟練，第一穴：${firstPt.name}穴，請深按`);
  }
  toggleTimer();
}

// 啟動或暫停呼吸跟練計時器（支援單穴跟練與處方自動跳下一穴）
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
    return;
  }

  const { pressSeconds, releaseSeconds, totalDurationSec } = point.massageGuide.rhythm;
  if (state.timer.phase === 'idle') {
    state.timer.phase = 'press';
    state.timer.phaseTimeLeft = pressSeconds;
    state.timer.totalTimeLeft = totalDurationSec;
  }

  state.timer.running = true;
  btn.textContent = '暫停跟練';

  const updateTimerUI = (triggerSound = false) => {
    const prefix = state.playlist.isPlaying
      ? `[處方 ${state.playlist.currentIndex + 1}/${state.playlist.queue.length} ${point.name}] `
      : '';
    if (state.timer.phase === 'press') {
      phaseEl.textContent = '吐氣・深按';
      ring.className = 'breathing-orb-ring pressing';
      if (triggerSound) {
        playSingingBowl('press');
        speakGuide('深按');
      }
    } else {
      phaseEl.textContent = '吸氣・緩放';
      ring.className = 'breathing-orb-ring releasing';
      if (triggerSound) {
        playSingingBowl('release');
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
          speakGuide('恭喜您完成整套養生處方按揉，請喝一杯溫開水休息');
          return;
        }
      }

      phaseEl.textContent = '功德圓滿';
      secEl.textContent = '✓';
      playSingingBowl('press');
      speakGuide('按揉完成，請喝溫水休息');
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

// 渲染處方籤與症狀快篩列
function initFilters() {
  const presetRow = document.getElementById('presetRow');
  presetRow.innerHTML = SYMPTOM_PRESETS.map((preset) => `
    <div class="preset-card" data-preset-id="${preset.id}">
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
        return;
      }

      state.activePresetId = id;
      state.activeSymptomTag = null;
      presetRow.querySelectorAll('.preset-card').forEach((c) => c.classList.remove('active'));
      document.querySelectorAll('.symptom-chip').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      const preset = SYMPTOM_PRESETS.find((p) => p.id === id);
      if (preset) {
        state.highlightedIds = new Set(preset.points);
        selectAcupoint(preset.points[0], true);
        updatePlaylistBannerUI();
      }
    });
  });

  const allSymptoms = ['肩頸痠痛', '頭痛', '失眠焦慮', '用眼過度', '胃脹噁心', '下肢水腫', '經痛', '手腳冰冷', '腰痠背痛', '鼻塞流涕', '咽喉乾痛', '耳鳴重聽'];
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

function applySymptomFilter(symptom) {
  state.activeSymptomTag = symptom;
  state.activePresetId = null;
  state.playlist.isPlaying = false;
  updatePlaylistBannerUI();

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
  state.playlist.isPlaying = false;
  state.highlightedIds.clear();
  updatePlaylistBannerUI();
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

  badge.textContent = `${currentZiwu.zhi}・${currentZiwu.meridian}`;
  text.textContent = `當令養${currentZiwu.organ}｜宜按：${recNames}`;

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
      renderBodyCanvas();
      resetSvgZoom();
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

  document.getElementById('headerArBtn')?.addEventListener('click', () => {
    openArModal(state.selectedPointId);
  });
  document.getElementById('inspectorArBtn')?.addEventListener('click', () => {
    openArModal(state.selectedPointId);
  });

  initArControls((newPointId) => {
    selectAcupoint(newPointId, true);
  });
}

// 啟動應用
window.addEventListener('DOMContentLoaded', () => {
  initZiwuLiuzhu();
  initFilters();
  bindEvents();
  selectAcupoint('LI4', false);
});
