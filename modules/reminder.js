// ⏰ 每日經絡養生提醒（支援 Web Notification API + iOS/Android 行事曆 .ics 一鍵訂閱備援）
import { state } from './state.js';
import { saveSettings } from './storage.js';
import { showToast } from './ui.js';

let reminderCheckInterval = null;
let lastNotifiedDateKey = '';

export async function toggleDailyReminder(timeStr) {
  if (timeStr) {
    state.settings.reminderTime = timeStr;
  }

  if (state.settings.reminderEnabled) {
    state.settings.reminderEnabled = false;
    saveSettings();
    showToast('🔕 已關閉每日按穴提醒');
    return false;
  }

  if ('Notification' in window) {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      state.settings.reminderEnabled = true;
      saveSettings();
      startReminderScheduler();
      showToast(`⏰ 已開啟每日 ${state.settings.reminderTime} 按穴通知！`);
      return true;
    }
  }

  // iOS Safari 未加入主畫面或不支援背景推播時，自動提供 .ics 行事曆鬧鐘檔下載
  downloadCalendarReminderIcs(state.settings.reminderTime || '21:30');
  showToast('📅 已為您產生手機行事曆每日提醒檔 (.ics)！');
  return false;
}

export function startReminderScheduler() {
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
  const title = '🌿 本草尋穴・睡前經絡按導時間';
  const body = '花 3 分鐘按揉神門、湧泉或耳神門，放鬆筋膜、引火歸元好入眠！';
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: './icon.svg',
          badge: './icon.svg',
          data: { url: './?p=KI1&v=sole' }
        });
        return;
      }
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: './icon.svg' });
    }
  } catch (_) {}
}

export function downloadCalendarReminderIcs(timeStr = '21:30') {
  const [hh, mm] = timeStr.split(':').map((n) => parseInt(n, 10) || 0);
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
  a.download = '本草尋穴每日提醒.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
