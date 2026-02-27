import { ref, onMounted } from 'vue'
import { useHabit } from './useHabit'
import { NOTIFICATION_SETTINGS_KEY } from '../constants'

export type NotificationPermission = 'default' | 'granted' | 'denied'

function loadReminderHour(): number {
  try {
    const raw = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)
    if (raw === null) return 20
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= 0 && n <= 23 ? n : 20
  } catch {
    return 20
  }
}

export function useNotification() {
  const permission = ref<NotificationPermission>('default')
  const reminderHour = ref(loadReminderHour())

  function saveReminderHour() {
    const h = Math.min(23, Math.max(0, Math.floor(reminderHour.value)))
    reminderHour.value = h
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, String(h))
  }

  function requestPermission() {
    if (!('Notification' in window)) return
    Notification.requestPermission().then((p) => {
      permission.value = p
    })
  }

  const REMINDER_SHOWN_KEY = 'habit-app-reminder-shown'

  function checkAndNotify() {
    if (!('Notification' in window) || permission.value !== 'granted') return
    const { isTodayRecorded, habitName } = useHabit()
    if (isTodayRecorded.value) return
    const hour = new Date().getHours()
    if (hour < reminderHour.value) return
    const today = new Date().toISOString().slice(0, 10)
    if (localStorage.getItem(REMINDER_SHOWN_KEY) === today) return
    const title = '習慣のリマインド'
    const body = habitName.value
      ? `「${habitName.value}」の記録はお済みですか？`
      : '今日の習慣を記録しましょう'
    try {
      new Notification(title, { body, icon: '/icon-192.png' })
      localStorage.setItem(REMINDER_SHOWN_KEY, today)
    } catch {
      // ignore
    }
  }

  function initPermission() {
    if ('Notification' in window) {
      const p = (window.Notification as unknown as { permission: NotificationPermission }).permission
      permission.value = p ?? 'default'
    }
    reminderHour.value = loadReminderHour()
  }
  onMounted(initPermission)
  initPermission()

  return {
    permission,
    reminderHour,
    requestPermission,
    saveReminderHour,
    checkAndNotify
  }
}
