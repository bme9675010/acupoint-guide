// ✨ 首次開啟 3 步快速新手導覽（僅首次顯示，亦可隨時於設定重看，P2-2）
const ONBOARDING_KEY = 'acupoint_onboarding_seen_v1';

const STEPS = [
  {
    badge: '第 1 步 / 共 3 步',
    icon: '🔍',
    title: '白話痛點秒找穴・或用 3 題問診自動配處方',
    desc: '不記得穴位名也沒關係！在搜尋框直接打白話（如「落枕、宿醉、胃脹、失眠」，繁簡與無聲調拼音皆通），或點上方「🩺 問診配穴」，3 秒依症狀、體質與當下姿勢幫你組出專屬 4 穴處方。',
    tip: '💡 還能點「📋 總表」依十四經絡／部位查閱全站 56 穴。'
  },
  {
    badge: '第 2 步 / 共 3 步',
    icon: '📷',
    title: '1:1 摸骨微距圖 × 56 穴 100% AR 定格找穴',
    desc: '每個穴位都附有 1:1 解剖骨度圖（支援「🔄 換側對照」鏡像翻轉與「🆚 易混鄰穴對比」）。不確定落點就開「📷 AR 找穴」，對準後按「❄️ 定格畫面」＋「🔍 放大 2x 拖曳」，放下手機也能照著紅點精準按揉。',
    tip: '💡 手部、臉部、下肢、背部、胸腹、足底與耳穴全數支援，離線包下載後無網路也能開 AR！'
  },
  {
    badge: '第 3 步 / 共 3 步',
    icon: '🎙️',
    title: '頌缽呼吸跟練 × 免手碰語音 × 全家獨立檔案',
    desc: '塗乳液或精油雙手油膩時，開啟「🎙️ 語音」直接喊「開始 / 暫停 / 換邊 / 下一穴」，或開「⛶ 沉浸全螢幕」放桌上遠看。按完點一下體感打卡，系統會自動累積 28 天日曆熱力圖並調配專屬茶飲！',
    tip: '💡 頂部「👤 成員」可替寶寶（柔和推拿）、長輩（大字模式）、孕媽（安全鎖）各自建立獨立檔案。'
  }
];

export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch (_) {
    return true;
  }
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1');
  } catch (_) {}
}

export function openOnboardingModal() {
  let modal = document.getElementById('onboardingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'onboardingModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '本草尋穴新手 3 步快速導覽');
    document.body.appendChild(modal);
  }

  let stepIdx = 0;

  const paint = () => {
    const s = STEPS[stepIdx];
    const isFirst = stepIdx === 0;
    const isLast = stepIdx === STEPS.length - 1;

    modal.innerHTML = `
      <div class="ar-modal-card onboarding-modal-card">
        <div class="onb-top-row">
          <span class="onb-step-badge">${s.badge}</span>
          <button type="button" id="onbSkipBtn" class="util-pill-btn">略過導覽 ✕</button>
        </div>

        <div class="onb-hero-icon">${s.icon}</div>
        <h3 class="onb-title">${s.title}</h3>
        <p class="onb-desc">${s.desc}</p>
        <div class="onb-tip">${s.tip}</div>

        <div class="onb-dots" aria-hidden="true">
          ${STEPS.map((_, i) => `<span class="onb-dot ${i === stepIdx ? 'active' : ''}"></span>`).join('')}
        </div>

        <div class="onb-actions">
          ${
            !isFirst
              ? `<button type="button" id="onbPrevBtn" class="btn-secondary-timer">← 上一步</button>`
              : '<span></span>'
          }
          <button type="button" id="onbNextBtn" class="btn-primary-timer">
            ${isLast ? '🌿 開始本草尋穴' : '下一步 →'}
          </button>
        </div>
      </div>
    `;

    const finish = () => {
      markOnboardingSeen();
      modal.classList.remove('open');
    };

    modal.querySelector('#onbSkipBtn')?.addEventListener('click', finish);
    modal.querySelector('#onbPrevBtn')?.addEventListener('click', () => {
      if (stepIdx > 0) {
        stepIdx -= 1;
        paint();
      }
    });
    modal.querySelector('#onbNextBtn')?.addEventListener('click', () => {
      if (isLast) finish();
      else {
        stepIdx += 1;
        paint();
      }
    });
  };

  paint();
  modal.classList.add('open');
}
