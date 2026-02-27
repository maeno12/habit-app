import { ref, computed, watch } from 'vue'
import { TARGET_DAYS, RESET_AFTER_MISSED_DAYS, STORAGE_KEY } from '../constants'

export interface HabitData {
  habitName: string
  recordedDates: string[] // ISO date strings YYYY-MM-DD
}

function loadData(): HabitData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { habitName: '', recordedDates: [] }
    const data = JSON.parse(raw) as HabitData
    if (!data.recordedDates) data.recordedDates = []
    return data
  } catch {
    return { habitName: '', recordedDates: [] }
  }
}

function saveData(data: HabitData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return Math.floor((d2 - d1) / (24 * 60 * 60 * 1000))
}

const data = ref<HabitData>(loadData())

let autoResetChecked = false
function checkAutoResetOnce() {
  if (autoResetChecked) return
  autoResetChecked = true
  const dates = data.value.recordedDates
  const last = dates.length ? dates.slice().sort().pop()! : null
  if (!last) return
  if (daysBetween(last, todayStr()) >= RESET_AFTER_MISSED_DAYS) {
    data.value = { ...data.value, recordedDates: [] }
    saveData(data.value)
  }
}

export function useHabit() {
  checkAutoResetOnce()

  const habitName = computed({
    get: () => data.value.habitName,
    set: (v: string) => {
      data.value = { ...data.value, habitName: v.trim() }
      saveData(data.value)
    }
  })

  const recordedDates = computed(() => data.value.recordedDates)

  const lastRecordDate = computed(() => {
    const dates = data.value.recordedDates
    if (dates.length === 0) return null
    return dates.slice().sort().pop() ?? null
  })

  // 2日間未入力で自動リセット
  function checkAutoReset() {
    const last = lastRecordDate.value
    if (!last) return
    const daysSince = daysBetween(last, todayStr())
    if (daysSince >= RESET_AFTER_MISSED_DAYS) {
      data.value = { ...data.value, recordedDates: [] }
      saveData(data.value)
    }
  }

  const progressPercent = computed(() => {
    const n = data.value.recordedDates.length
    return Math.min(100, Math.floor((n / TARGET_DAYS) * 100))
  })

  const completedCount = computed(() => data.value.recordedDates.length)

  const isTodayRecorded = computed(() =>
    data.value.recordedDates.includes(todayStr())
  )

  function setHabitName(name: string) {
    data.value = { ...data.value, habitName: name.trim() }
    saveData(data.value)
  }

  function recordToday() {
    const today = todayStr()
    if (data.value.recordedDates.includes(today)) return
    checkAutoReset()
    const dates = [...data.value.recordedDates, today]
    data.value = { ...data.value, recordedDates: dates }
    saveData(data.value)
  }

  function resetRecords() {
    data.value = { ...data.value, recordedDates: [] }
    saveData(data.value)
  }

  function hasGoal() {
    return data.value.habitName.length > 0
  }

  watch(data, () => saveData(data.value), { deep: true })

  return {
    habitName,
    recordedDates,
    lastRecordDate,
    progressPercent,
    completedCount,
    isTodayRecorded,
    setHabitName,
    recordToday,
    resetRecords,
    hasGoal,
    checkAutoReset,
    TARGET_DAYS
  }
}
