// 🎙️ 免手觸控控制中心（Web Speech API 語音口令識別 + 鍵盤人體工學快捷鍵）
import { showToast } from './ui.js';
import { vibrate, playSingingBowl } from './audio.js';

let recognition = null;
let isVoiceActive = false;
let shouldRestart = false;
let dispatchAction = null;

// 指令模式字典
const COMMAND_PATTERNS = [
  { action: 'start', keywords: ['開始', '按揉', '計時', '跟練', '播放', '動手', '開始按', '繼續'] },
  { action: 'pause', keywords: ['暫停', '停止', '休息', '結束', '別按了', '停下來', '暫停按'] },
  { action: 'next', keywords: ['下一穴', '下一個', '換下一穴', '換穴', '跳過', '下一點'] },
  { action: 'prev', keywords: ['上一穴', '上一個', '換上一穴', '回上一個', '上一點'] },
  { action: 'switchSide', keywords: ['換邊', '換手', '換側', '另一側', '另一手', '另一腳'] },
  { action: 'flipCloseup', keywords: ['翻轉', '換側對照', '鏡像', '反面', '轉向'] },
  { action: 'capture', keywords: ['定格', '拍照', '截圖', '確認位置'] },
  { action: 'openAr', keywords: ['打開鏡頭', '開啟鏡頭', '開啟ar', '打開ar', '相機找穴'] }
];

export function isVoiceSupported() {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

function parseVoiceCommand(transcript) {
  const clean = transcript.trim().toLowerCase();
  for (const cmd of COMMAND_PATTERNS) {
    for (const kw of cmd.keywords) {
      if (clean.includes(kw)) {
        return { action: cmd.action, matchedKeyword: kw, rawText: transcript };
      }
    }
  }
  return null;
}

export function initVoiceAndKeyboardControls({ onAction }) {
  dispatchAction = onAction;

  // 1. 初始化 Web Speech Recognition（若環境支援）
  const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechClass) {
    try {
      recognition = new SpeechClass();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'zh-TW';

      recognition.onstart = () => {
        isVoiceActive = true;
        updateVoiceButtonUI(true);
      };

      recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript;
        const matched = parseVoiceCommand(transcript);

        if (matched) {
          vibrate('press');
          showToast(`🎙️ 語音口令：「${matched.matchedKeyword}」`, 2000);
          if (dispatchAction) {
            dispatchAction(matched.action, { source: 'voice', raw: transcript });
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          shouldRestart = false;
          isVoiceActive = false;
          updateVoiceButtonUI(false);
          showToast('⚠️ 麥克風權限已被拒絕，請於瀏覽器網址列開啟權限');
        } else if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        if (shouldRestart) {
          // 沉默自動中斷時，背景自動續聽
          setTimeout(() => {
            if (shouldRestart) {
              try {
                recognition.start();
              } catch (_) {}
            }
          }, 400);
        } else {
          isVoiceActive = false;
          updateVoiceButtonUI(false);
        }
      };
    } catch (e) {
      console.warn('Voice recognition init failed:', e);
    }
  }

  // 2. 初始化全域鍵盤快捷鍵（方便雙手推拿或放在桌面時一鍵操作）
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
    if (isTyping) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (dispatchAction) dispatchAction('toggleTimer', { source: 'keyboard' });
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      if (dispatchAction) dispatchAction('next', { source: 'keyboard' });
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      if (dispatchAction) dispatchAction('prev', { source: 'keyboard' });
    } else if (e.code === 'KeyF') {
      e.preventDefault();
      if (dispatchAction) dispatchAction('flipCloseup', { source: 'keyboard' });
    } else if (e.code === 'KeyV') {
      e.preventDefault();
      toggleVoiceControl();
    } else if (e.code === 'KeyM') {
      e.preventDefault();
      if (dispatchAction) dispatchAction('switchSide', { source: 'keyboard' });
    }
  });
}

export function toggleVoiceControl() {
  if (!recognition) {
    showToast('💡 您的瀏覽器暫不支援語音辨識，請使用空白鍵與方向鍵快捷鍵');
    return false;
  }

  if (isVoiceActive) {
    shouldRestart = false;
    try {
      recognition.stop();
    } catch (_) {}
    isVoiceActive = false;
    updateVoiceButtonUI(false);
    showToast('🎙️ 已關閉免手碰語音辨識');
    return false;
  } else {
    shouldRestart = true;
    try {
      recognition.start();
      isVoiceActive = true;
      updateVoiceButtonUI(true);
      showToast('🎙️ 免手碰語音已開啟！請說：「開始」、「暫停」、「下一穴」或「換邊」', 4000);
      return true;
    } catch (err) {
      console.warn('Voice start error:', err);
      showToast('⚠️ 啟動語音辨識失敗，請確認已授權麥克風');
      return false;
    }
  }
}

function updateVoiceButtonUI(active) {
  const btn = document.getElementById('voiceControlBtn');
  const timerVoiceBtn = document.getElementById('timerVoiceBtn');
  [btn, timerVoiceBtn].forEach((el) => {
    if (!el) return;
    el.classList.toggle('active', active);
    el.classList.toggle('listening', active);
    if (active) {
      el.title = '免手碰語音聆聽中（點擊關閉）';
      el.setAttribute('aria-label', '免手碰語音聆聽中');
    } else {
      el.title = '開啟免手碰語音指令（塗精油乳液免碰螢幕，可說「開始/暫停/下一穴」）';
      el.setAttribute('aria-label', '開啟免手碰語音控制');
    }
  });
}
