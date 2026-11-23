// 🩺 3 題問診式動態配穴精靈（症狀 × 體質 × 姿勢 → 現場組出專屬 4 穴處方與茶飲）
import { state } from './state.js';
import { POSTURE_SCENARIOS } from './posture.js';
import { saveCustomPresets } from './storage.js';
import { showToast } from './ui.js';

const SYMPTOM_GROUPS = [
  { id: 'head_eye', label: '🤕 頭痛・眼酸疲勞', points: ['EX-HN5', 'BL2', 'GB20', 'LI4', 'ST2', 'EAR-APEX'] },
  { id: 'neck_back', label: '💻 肩頸僵硬・腰背痠', points: ['GB21', 'SI3', 'GB20', 'GV14', 'BL40', 'BL60', 'LI11'] },
  { id: 'sleep_calm', label: '🌙 失眠焦慮・心悸胸悶', points: ['HT7', 'PC6', 'EX-HN3', 'EAR-SHENMEN', 'EAR-ZERO', 'KI1', 'CV17'] },
  { id: 'stomach', label: '🍲 胃脹消化・反胃打嗝', points: ['PC6', 'ST36', 'CV12', 'ST25', 'EAR-STOMACH', 'REFLEX-STOMACH'] },
  { id: 'cold_edema', label: '❄️ 手腳冰冷・水腫經痛', points: ['SP6', 'SP9', 'KI3', 'CV6', 'KI1', 'SP10', 'REFLEX-KIDNEY'] },
  { id: 'nose_throat', label: '👃 鼻塞過敏・喉嚨有痰', points: ['LI20', 'LU7', 'LU10', 'LI4', 'ST40', 'EAR-ADRENAL'] },
  { id: 'child', label: '👶 小兒積食・夜啼轉骨', points: ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'PED-XIAOTIANXIN', 'PED-NIEJI', 'GB39', 'ST2'] }
];

const CONSTITUTIONS = [
  { id: 'balanced', label: '⚖️ 平和保養', boost: ['ST36', 'LI4', 'PC6'], teaTip: '溫開水或淡味麥茶、菊花枸杞茶皆宜' },
  { id: 'heat', label: '🔥 上火燥熱・口苦嘴破', boost: ['LR3', 'PC8', 'LI11', 'EX-LE-LINEITING', 'EAR-APEX'], teaTip: '宜搭薄荷菊花茶、蓮子心麥冬茶清降虛火' },
  { id: 'cold', label: '🧊 怕冷氣虛・手腳冰涼', boost: ['CV6', 'KI1', 'KI3', 'BL23', 'ST36'], teaTip: '宜搭生薑紅棗茶、肉桂黑糖茶或黃耆枸杞茶溫陽' },
  { id: 'damp', label: '💧 濕重水腫・頭重倦怠', boost: ['SP9', 'ST40', 'SP6', 'CV12', 'REFLEX-KIDNEY'], teaTip: '宜搭茯苓陳皮炒薏仁茶、玉米鬚茶淡滲祛濕' },
  { id: 'stress', label: '🦉 熬夜壓力・自律神經緊', boost: ['LR3', 'EAR-SHENMEN', 'EAR-ZERO', 'HT7', 'CV17', 'GB20'], teaTip: '宜搭玫瑰佛手茶、洋甘菊茶疏肝解鬱安神' }
];

const POSTURES = [
  { id: 'office', label: '🪑 坐著 / 辦公' },
  { id: 'commute', label: '🚇 通勤站姿（不脫鞋）' },
  { id: 'bed', label: '🛏️ 躺床 / 居家放鬆' },
  { id: 'parenting', label: '🏠 親子照護（幫小孩按）' }
];

export function computeWizardPrescription(allPoints, { symptoms, constitution, posture }) {
  const scores = new Map();
  const addScore = (id, delta) => scores.set(id, (scores.get(id) || 0) + delta);

  const selectedGroups = SYMPTOM_GROUPS.filter((g) => symptoms.includes(g.id));
  selectedGroups.forEach((g) => {
    g.points.forEach((pid, idx) => {
      // 越靠前的主穴權重越高
      addScore(pid, Math.max(2, 5 - idx * 0.5));
    });
  });

  const constObj = CONSTITUTIONS.find((c) => c.id === constitution) || CONSTITUTIONS[0];
  constObj.boost.forEach((pid) => addScore(pid, 2.2));

  const postureObj = POSTURE_SCENARIOS.find((p) => p.id === posture);
  const pointMap = new Map(allPoints.map((p) => [p.id, p]));

  const ranked = [...scores.entries()]
    .map(([pid, rawScore]) => {
      const pt = pointMap.get(pid);
      if (!pt) return null;
      if (state.pregnancySafeMode && pt.contraindications?.pregnancyForbidden) return null;
      let score = rawScore;
      if (postureObj) {
        score += postureObj.filter(pt) ? 2.5 : -2.0;
      }
      return { pt, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const chosen = ranked.slice(0, 4).map((x) => x.pt);
  const groupShortTitle =
    selectedGroups.length > 0
      ? selectedGroups.map((g) => g.label.split(' ')[1].split('・')[0]).slice(0, 2).join('＋')
      : '全方位養生';

  return {
    title: `問診配穴：${groupShortTitle}`,
    points: chosen.map((p) => p.id),
    pointObjects: chosen,
    teaTip: constObj.teaTip
  };
}

export function openSymptomWizardModal(allPoints, { onApplyTempPreset, onSaveCustomPreset }) {
  let modal = document.getElementById('symptomWizardModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'symptomWizardModal';
    modal.className = 'ar-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '3 題問診式動態配穴精靈');
    document.body.appendChild(modal);
  }

  const selection = {
    symptoms: ['neck_back'],
    constitution: 'stress',
    posture: 'office'
  };

  const paint = () => {
    const result = computeWizardPrescription(allPoints, selection);
    const previewHtml =
      result.pointObjects.length === 0
        ? `<p style="color:var(--cinnabar); font-size:0.84rem;">目前條件下無合適穴位（可能受孕期安全鎖過濾），請調整選項。</p>`
        : result.pointObjects
            .map(
              (pt, idx) => `
              <div class="wizard-result-pill">
                <strong>${idx + 1}. ${pt.name} (${pt.id})</strong>
                <span>${pt.benefits.symptoms.slice(0, 2).join('、')}</span>
              </div>
            `
            )
            .join('');

    modal.innerHTML = `
      <div class="ar-modal-card wizard-modal-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif); color:var(--herb-deep); margin:0; font-size:1.08rem;">
            🩺 3 題快速問診・現場配專屬處方
          </h3>
          <button type="button" id="closeWizardBtn" class="ar-close-btn">✕ 關閉</button>
        </div>

        <div class="wizard-step">
          <div class="wizard-step-label">1️⃣ 目前最不舒服的地方（可複選 1～3 項）</div>
          <div class="wizard-chip-grid">
            ${SYMPTOM_GROUPS.map(
              (g) => `
              <button type="button" class="wizard-chip ${selection.symptoms.includes(g.id) ? 'active' : ''}" data-w-sym="${g.id}">
                ${g.label}
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div class="wizard-step">
          <div class="wizard-step-label">2️⃣ 近期體質傾向</div>
          <div class="wizard-chip-grid">
            ${CONSTITUTIONS.map(
              (c) => `
              <button type="button" class="wizard-chip ${selection.constitution === c.id ? 'active' : ''}" data-w-const="${c.id}">
                ${c.label}
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div class="wizard-step">
          <div class="wizard-step-label">3️⃣ 現在的姿勢情境</div>
          <div class="wizard-chip-grid">
            ${POSTURES.map(
              (p) => `
              <button type="button" class="wizard-chip ${selection.posture === p.id ? 'active' : ''}" data-w-posture="${p.id}">
                ${p.label}
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div class="wizard-result-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
            <strong style="color:var(--herb-deep); font-family:var(--font-serif);">✨ 即時為您配出 ${result.points.length} 穴處方${state.pregnancySafeMode ? '（已過濾孕期禁穴）' : ''}</strong>
            <span style="font-size:0.76rem; color:var(--ink-muted);">🍵 ${result.teaTip}</span>
          </div>
          <div class="wizard-result-list">${previewHtml}</div>
          <div class="wizard-actions">
            <button type="button" id="wizardApplyBtn" class="btn-primary-timer" ${result.points.length === 0 ? 'disabled' : ''}>
              ▶️ 立即開啟並跟練這組處方
            </button>
            <button type="button" id="wizardSaveBtn" class="btn-secondary-timer" ${result.points.length === 0 ? 'disabled' : ''}>
              💾 存成自訂處方
            </button>
          </div>
        </div>
      </div>
    `;

    modal.querySelector('#closeWizardBtn')?.addEventListener('click', () => modal.classList.remove('open'));

    modal.querySelectorAll('[data-w-sym]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-w-sym');
        if (selection.symptoms.includes(sid)) {
          if (selection.symptoms.length > 1) {
            selection.symptoms = selection.symptoms.filter((x) => x !== sid);
          }
        } else {
          selection.symptoms = [...selection.symptoms, sid].slice(-3);
        }
        // 若選到小兒照護，自動幫切親子姿勢方便對症
        if (sid === 'child' && selection.symptoms.includes('child')) {
          selection.posture = 'parenting';
        }
        paint();
      });
    });

    modal.querySelectorAll('[data-w-const]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selection.constitution = btn.getAttribute('data-w-const');
        paint();
      });
    });

    modal.querySelectorAll('[data-w-posture]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selection.posture = btn.getAttribute('data-w-posture');
        paint();
      });
    });

    modal.querySelector('#wizardApplyBtn')?.addEventListener('click', () => {
      const preset = {
        id: 'wizard_temp',
        title: result.title,
        subtitle: result.pointObjects.map((p) => p.name).join('＋'),
        icon: '🩺',
        points: result.points
      };
      modal.classList.remove('open');
      if (onApplyTempPreset) onApplyTempPreset(preset);
    });

    modal.querySelector('#wizardSaveBtn')?.addEventListener('click', () => {
      const newPreset = {
        id: `custom_${Date.now()}`,
        title: result.title.replace('問診配穴：', ''),
        icon: '🩺',
        points: result.points
      };
      state.customPresets.unshift(newPreset);
      saveCustomPresets();
      modal.classList.remove('open');
      showToast(`💾 已儲存為自訂處方【${newPreset.title}】！`);
      if (onSaveCustomPreset) onSaveCustomPreset(newPreset);
    });
  };

  paint();
  modal.classList.add('open');
}
