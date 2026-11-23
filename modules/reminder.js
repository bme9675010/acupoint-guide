// ⏰ 每日經絡養生提醒（可自訂時間 + Web Notification API + iOS/Android 行事曆 .ics 一鍵訂閱備援）
import { state } from './state.js';
import { saveSettings } from './storage.js';
import { showToast } from './ui.js';

let reminderCheckInterval = null;
let lastNotifiedDateKey = '';

export function updateReminderUI() {
  const enabled = !!state.settings?.reminderEnabled;
  const timeStr = state.settings?.reminderTime || '21:30';

  const btn = document.getElementById('reminderToggleBtn');
  if (btn) {
    btn.textContent = enabled ? `⏰ ${timeStr} 已開` : '⏰ 開啟每日提醒';
    btn.classList.toggle('active', enabled);
  }

  const timeInput = document.getElementById('reminderTimeInput');
  if (timeInput && timeInput.value !== timeStr) {
    timeInput.value = timeStr;
  }

  const statusText = document.getElementById('reminderStatusText');
  if (statusText) {
    statusText.textContent = enabled
      ? `✅ 已啟用：每日 ${timeStr} 推播提醒（需保持 PWA 權限）`
      : `目前關閉（設定時間：${timeStr}，iPhone 建議點下方加入行事曆最準時）`;
  }
}

export function setReminderTime(timeStr) {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return;
  state.settings.reminderTime = timeStr;
  saveSettings();
  updateReminderUI();
  if (state.settings.reminderEnabled) {
    startReminderScheduler();
    showToast(`⏰ 每日按穴提醒已調整為 ${timeStr}`);
  }
}

export async function toggleDailyReminder(timeStr) {
  if (timeStr && /^\d{2}:\d{2}$/.test(timeStr)) {
    state.settings.reminderTime = timeStr;
  }

  if (state.settings.reminderEnabled) {
    state.settings.reminderEnabled = false;
    saveSettings();
    if (reminderCheckInterval) {
      clearInterval(reminderCheckInterval);
      reminderCheckInterval = null;
    }
    updateReminderUI();
    showToast('🔕 已關閉每日按穴提醒');
    return false;
  }

  const targetTime = state.settings.reminderTime || '21:30';

  if ('Notification' in window) {
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        state.settings.reminderEnabled = true;
        saveSettings();
        startReminderScheduler();
        updateReminderUI();
        showToast(`⏰ 已開啟每日 ${targetTime} 按穴通知！`);
        return true;
      }
    } catch (_) {}
  }

  // iOS Safari 未加入主畫面或拒絕通知權限時，自動提供 .ics 行事曆鬧鐘檔下載
  downloadCalendarReminderIcs(targetTime);
  updateReminderUI();
  showToast(`📅 已產生 ${targetTime} 手機行事曆每日提醒檔 (.ics)！`);
  return false;
}

export function startReminderScheduler() {
  updateReminderUI();
  if (reminderCheckInterval) clearInterval(reminderCheckInterval);
  if (!state.settings?.reminderEnabled) return;

  reminderCheckInterval = setInterval(() => {
    if (!state.settings?.reminderEnabled) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (`${hh}:${mm}` === state.settings.reminderTime && lastNotifiedDateKey !== dateKey) {
      lastNotifiedDateKey = dateKey;
      fireWellnessNotification();
    }
  }, 25000);
}

async function fireWellnessNotification() {
  const title = '🌿 本草尋穴・每日經絡按導時間';
  const body = '花 3 分鐘按揉神門、湧泉或耳神門，放鬆筋膜、疏通氣血！';
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: './icon-192.png',
          badge: './icon-192.png',
          data: { url: './?p=KI1&v=sole' }
        });
        return;
      }
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: './icon-192.png' });
    }
  } catch (_) {}
}

export function downloadCalendarReminderIcs(timeStr = '21:30') {
  const [hh, mm] = (timeStr || '21:30').split(':').map((n) => parseInt(n, 10) || 0);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
  const pad = (n) => String(n).padStart(2, '0');
  const dtStart = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(hh)}${pad(mm)}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AcupointGuide//TCM Wellness//ZH',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    'DURATION:PT10M',
    'RRULE:FREQ=DAILY',
    'SUMMARY:🌿 本草尋穴・每日 3 分鐘經絡按導',
    'DESCRIPTION:開啟本草尋穴跟練呼吸按揉，疏通氣血、一夜好眠：https://bme9675010.github.io/acupoint-guide/',
    'BEGIN:VALARM',
    'TRIGGER:-PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:該按穴放鬆囉！',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `本草尋穴每日提醒-${pad(hh)}${pad(mm)}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
